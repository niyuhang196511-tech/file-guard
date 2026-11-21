"""使用同一套业务引擎和 Vue 界面的本地开发入口。"""
import json
import secrets
import sys
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from engine.main import data_dir
from engine.maintenance import workspace_lock
from engine.service import Service
from engine.store import Store

def run():
    secret=secrets.token_urlsafe(32)
    service=Service(Store(data_dir()))
    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*args):
            pass
        def do_GET(self):
            assets={'/view.js':('view.js','text/javascript'),'/':('index.html','text/html'),'/app.js':('app.js','text/javascript'),'/vue.js':('vue.js','text/javascript'),'/ledger.js':('ledger.js','text/javascript'),'/icons.js':('icons.js','text/javascript'),'/style.css':('style.css','text/css')}
            if self.path not in assets:
                self.send_error(404)
                return
            name,kind=assets[self.path]
            self.reply(200,(ROOT/'web'/name).read_bytes(),kind)
        def reply(self,status,body,mime):
            self.send_response(status)
            self.send_header('Content-Type',mime+'; charset=utf-8')
            self.send_header('Cache-Control','no-store')
            self.send_header('X-Content-Type-Options','nosniff')
            self.send_header('Content-Length',str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        def do_POST(self):
            expected='http://127.0.0.1:'+str(self.server.server_port)
            if self.path!='/api' or self.headers.get('Origin')!=expected or self.headers.get('Host')!=expected[7:] or not secrets.compare_digest(self.headers.get('X-FileGuard',''),secret):
                self.send_error(403)
                return
            try:
                n=int(self.headers.get('Content-Length',0))
                if not 0<n<=65536:
                    raise ValueError('请求大小异常')
                req=json.loads(self.rfile.read(n))
                result={'ok':True,'data':service.dispatch(req['cmd'],req.get('args',{}))}
            except Exception as exc:
                result={'ok':False,'error':str(exc)}
            self.reply(200,json.dumps(result,ensure_ascii=False).encode(),'application/json')
    with ThreadingHTTPServer(('127.0.0.1',0),Handler) as server:
        url=f'http://127.0.0.1:{server.server_port}/#{secret}'
        service.start()
        print('正在运行 FileGuard。关闭此终端将停止开发模式。\n'+url,flush=True)
        threading.Timer(.3,webbrowser.open,args=[url]).start()
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            service.stopping.set()


if __name__=='__main__':
    with workspace_lock(data_dir()):
        run()

