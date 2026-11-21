#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::{json, Value};
use std::io::{BufRead, BufReader, Write};
use std::process::{Child, ChildStdin, ChildStdout, Command, Stdio};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::{AppHandle, Manager};

struct Worker {
    child: Child,
    input: ChildStdin,
    output: BufReader<ChildStdout>,
    started: Instant,
    retry_at: Instant,
    delay: u64,
}

impl Worker {
    fn start(cause: &str) -> Result<Self, String> {
        let host = std::env::current_exe().map_err(|e| e.to_string())?;
        let folder = host.parent().ok_or("无法定位程序目录")?;
        let mut command = Command::new(folder.join("fileguard-engine.exe"));
        command.stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::null());
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
        let mut child = command.spawn().map_err(|e| format!("无法启动监控引擎：{e}"))?;
        let input = child.stdin.take().ok_or("引擎输入不可用")?;
        let output = BufReader::new(child.stdout.take().ok_or("引擎输出不可用")?);
        Ok(Self {child,input,output,started:Instant::now(),retry_at:Instant::now(),delay:1})
    }
    fn ensure_running(&mut self, cause: &str) -> Result<(),String> {
        if self.child.try_wait().map_err(|e|e.to_string())?.is_none() {return Ok(())}
        let now = Instant::now();
        if now < self.retry_at {return Err("引擎正等待恢复，请稍后刷新状态".into())}
        if self.started.elapsed() >= Duration::from_secs(120) {self.delay=1; self.started=now;}
        let delay=self.delay;
        self.retry_at=now+Duration::from_secs(delay);
        self.delay=(delay*2).min(60);
        let mut next=Self::start(cause)?;
        next.delay=self.delay;
        next.retry_at=self.retry_at;
        *self=next;
        Ok(())
    }
    fn call(&mut self, cmd: &str, args: Value) -> Result<Value, String> {
        let msg = json!({"cmd":cmd,"args":args});
        writeln!(self.input, "{msg}").and_then(|_| self.input.flush()).map_err(|e| e.to_string())?;
        let mut line = String::new();
        self.output.read_line(&mut line).map_err(|e| e.to_string())?;
        if line.is_empty() {return Err("引擎已停止，请重新检查运行状态".into())}
        let reply: Value = serde_json::from_str(&line).map_err(|e| e.to_string())?;
        if reply["ok"] == true {Ok(reply["data"].clone())} else {
            Err(reply["error"].as_str().unwrap_or("操作失败").to_string())
        }
    }
}

type Shared = Arc<Mutex<Worker>>;

#[tauri::command]
async fn operation(state: tauri::State<'_, Shared>, cmd: String, args: Value) -> Result<Value,String> {
    let engine = Arc::clone(state.inner());
    tauri::async_runtime::spawn_blocking(move || {
        let mut worker = engine.lock().map_err(|_| "引擎通信锁异常".to_string())?;
        worker.ensure_running("界面请求恢复")?;
        worker.call(&cmd,args)
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
            let worker = Worker::start(if std::env::args().any(|v|v=="--background") {"后台启动"} else {"桌面启动"}).map_err(std::io::Error::other)?;
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
            let mut tray=TrayIconBuilder::new().tooltip("FileGuard 正在后台监控 · 右键打开或退出").menu(&menu)
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
            if !std::env::args().any(|v|v=="--background") {show(app.handle());}
            Ok(())
        })
        .on_window_event(|window,event| {
            if let tauri::WindowEvent::CloseRequested{api,..}=event {api.prevent_close(); let _=window.hide();}
        })
        .invoke_handler(tauri::generate_handler![operation,pick_path])
        .run(tauri::generate_context!()).expect("桌面应用启动失败");
}

