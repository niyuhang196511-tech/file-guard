#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::{json, Value};
use std::io::{BufRead, BufReader, Write};
use std::process::{Child, ChildStdin, ChildStdout, Command, Stdio};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::{AppHandle, Manager};

struct EngineProcess {
    child: Child,
    input: ChildStdin,
    output: BufReader<ChildStdout>,
    started: Instant,
}

impl EngineProcess {
    fn start(cause: &str) -> Result<Self, String> {
        let host = std::env::current_exe().map_err(|e| format!("无法定位桌面程序：{e}"))?;
        let folder = host.parent().ok_or("无法定位程序目录")?;
        let engine = folder.join("fileguard-engine.exe");
        let mut command = Command::new(&engine);
        command
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::null());
        command.env("FILEGUARD_START_CAUSE", cause);
        command.env("FILEGUARD_DESKTOP_EXE", &host);
        if folder.join("portable.flag").exists() {
            command.env("FILEGUARD_DATA", folder.join("Data"));
        }
        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            command.creation_flags(0x08000000);
        }
        let mut child = command.spawn().map_err(|e| {
            format!("无法启动监控引擎，请检查 {}（{e}）", engine.display())
        })?;
        let input = child.stdin.take().ok_or("引擎输入不可用")?;
        let output = BufReader::new(child.stdout.take().ok_or("引擎输出不可用")?);
        Ok(Self {
            child,
            input,
            output,
            started: Instant::now(),
        })
    }

    fn call(&mut self, cmd: &str, args: Value) -> Result<Value, String> {
        let msg = json!({"cmd":cmd,"args":args});
        writeln!(self.input, "{msg}")
            .and_then(|_| self.input.flush())
            .map_err(|e| format!("无法向监控引擎发送请求：{e}"))?;
        let mut line = String::new();
        self.output
            .read_line(&mut line)
            .map_err(|e| format!("无法读取监控引擎的回复：{e}"))?;
        if line.is_empty() {
            return Err("监控引擎未返回结果，请稍后刷新运行状态".into());
        }
        let reply: Value = serde_json::from_str(&line)
            .map_err(|e| format!("监控引擎返回了无法识别的数据：{e}"))?;
        if reply["ok"] == true {
            Ok(reply["data"].clone())
        } else {
            Err(reply["error"].as_str().unwrap_or("操作失败").to_string())
        }
    }
}

struct RetryBackoff {
    next_attempt: Instant,
    delay: Duration,
}

impl RetryBackoff {
    fn new(now: Instant) -> Self {
        Self {
            next_attempt: now,
            delay: Duration::from_secs(1),
        }
    }

    fn observe_running(&mut self, started: Instant, now: Instant) {
        if now.duration_since(started) >= Duration::from_secs(120) {
            *self = Self::new(now);
        }
    }

    fn attempted(&mut self, now: Instant) {
        self.next_attempt = now + self.delay;
        self.delay = (self.delay * 2).min(Duration::from_secs(60));
    }
}

struct Worker {
    process: Option<EngineProcess>,
    backoff: RetryBackoff,
    last_error: Option<String>,
}

impl Worker {
    fn new() -> Self {
        Self {
            process: None,
            backoff: RetryBackoff::new(Instant::now()),
            last_error: None,
        }
    }

    fn ensure_running(&mut self, cause: &str) -> Result<&mut EngineProcess, String> {
        let now = Instant::now();
        if let Some(process) = &mut self.process {
            match process.child.try_wait() {
                Ok(None) => self.backoff.observe_running(process.started, now),
                Ok(Some(status)) => {
                    self.process = None;
                    self.last_error = Some(format!("监控引擎已退出（{status}）"));
                }
                Err(e) => return Err(format!("无法检查监控引擎的运行状态：{e}")),
            }
        }

        if self.process.is_none() {
            if now < self.backoff.next_attempt {
                let error = self.last_error.as_deref().unwrap_or("监控引擎暂不可用");
                return Err(format!("{error}。监控引擎将在后台重试"));
            }

            let result = EngineProcess::start(cause);
            self.backoff.attempted(Instant::now());
            match result {
                Ok(process) => {
                    self.process = Some(process);
                    self.last_error = None;
                }
                Err(error) => {
                    self.last_error = Some(error.clone());
                    return Err(format!("{error}。监控引擎将在后台重试"));
                }
            }
        }

        self.process.as_mut().ok_or_else(|| "监控引擎暂不可用".into())
    }
}

type Shared = Arc<Mutex<Worker>>;

#[tauri::command]
async fn operation(state: tauri::State<'_, Shared>, cmd: String, args: Value) -> Result<Value,String> {
    let engine = Arc::clone(state.inner());
    tauri::async_runtime::spawn_blocking(move || {
        let mut worker = engine.lock().map_err(|_| "引擎通信锁异常".to_string())?;
        worker.ensure_running("界面请求恢复")?.call(&cmd, args)
    }).await.map_err(|e| e.to_string())?
}

#[tauri::command]
async fn pick_path(kind:String,name:String) -> Result<Option<String>, String> {
    let dialog = rfd::AsyncFileDialog::new();
    let selected = match kind.as_str() {
        "directory" => dialog.set_title("选择监控目录").pick_folder().await,
        "delivery" => dialog.set_title("核查历史文件交付包").add_filter("ZIP", &["zip"]).pick_file().await,
        "backup" => dialog.set_title("核查已有备份").add_filter("FileGuard ZIP", &["zip"]).pick_file().await,
        "save" => dialog.set_title("保存到新文件").set_file_name(name).save_file().await,
        _ => return Err("未知选择类型".into())
    };
    Ok(selected.map(|p|p.path().to_string_lossy().into_owned()))
}

fn show(app:&AppHandle) {
    if let Some(w) = app.get_webview_window("main") {let _=w.unminimize(); let _=w.show(); let _=w.set_focus();}
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app,args,_| {
            if !args.iter().any(|arg| arg == "--background") { show(app); }
        }))
        .setup(|app| {
            let background = std::env::args_os().any(|arg| arg == "--background");
            let mut worker = Worker::new();
            let _ = worker.ensure_running(if background { "后台启动" } else { "桌面启动" });
            let shared = Arc::new(Mutex::new(worker));
            // UI polling stops when hidden. Supervise the engine independently of WebView visibility.
            let monitor = Arc::downgrade(&shared);
            std::thread::spawn(move || loop {
                std::thread::sleep(Duration::from_secs(5));
                let Some(engine) = monitor.upgrade() else { break };
                if let Ok(mut worker) = engine.try_lock() {
                    let _ = worker.ensure_running("后台自动恢复");
                };
            });
            app.manage(shared);
            let open=MenuItem::with_id(app,"show","打开工作台",true,None::<&str>)?;
            let quit=MenuItem::with_id(app,"quit","退出监控",true,None::<&str>)?;
            let menu=Menu::with_items(app,&[&open,&quit])?;
            let mut tray=TrayIconBuilder::new().tooltip("FileGuard · 右键打开或退出监控").menu(&menu)
                .show_menu_on_left_click(false)
                .on_tray_icon_event(|tray,event| {
                    if matches!(event,tauri::tray::TrayIconEvent::Click {
                        button:tauri::tray::MouseButton::Left,button_state:tauri::tray::MouseButtonState::Up,..}) {
                        show(tray.app_handle());
                    }
                }).on_menu_event(|app,event| {
                    match event.id.as_ref() {"show"=>show(app),"quit"=>app.exit(0),_=>()}
                });
            if let Some(icon)=app.default_window_icon() {tray=tray.icon(icon.clone());}
            tray.build(app)?;
            if !background {show(app.handle());}
            Ok(())
        })
        .on_window_event(|window,event| {
            if let tauri::WindowEvent::CloseRequested{api,..}=event {api.prevent_close(); let _=window.hide();}
        })
        .invoke_handler(tauri::generate_handler![operation,pick_path])
        .run(tauri::generate_context!()).expect("桌面应用启动失败");
}

#[cfg(test)]
mod tests {
    use super::RetryBackoff;
    use std::time::{Duration, Instant};

    #[test]
    fn retries_use_capped_backoff() {
        let mut now = Instant::now();
        let mut retry = RetryBackoff::new(now);
        assert_eq!(retry.next_attempt, now);
        for seconds in [1, 2, 4, 8, 16, 32, 60, 60] {
            retry.attempted(now);
            now += Duration::from_secs(seconds);
            assert_eq!(retry.next_attempt, now);
        }
    }

    #[test]
    fn stable_running_engine_resets_backoff() {
        let started = Instant::now();
        let mut retry = RetryBackoff::new(started);
        retry.attempted(started);
        retry.observe_running(started, started + Duration::from_secs(119));
        assert_eq!(retry.delay, Duration::from_secs(2));

        let stable_at = started + Duration::from_secs(120);
        retry.observe_running(started, stable_at);
        assert_eq!(retry.next_attempt, stable_at);
        assert_eq!(retry.delay, Duration::from_secs(1));
    }
}

