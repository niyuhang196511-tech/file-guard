import json
import os
import subprocess
import sys
import time
from pathlib import Path


class RpcProcess:
    def __init__(self,data):
        self.data=data
    def __enter__(self):
        self.worker=subprocess.Popen([sys.executable,'-m','engine.main'],cwd=Path(__file__).resolve().parents[1],env={**os.environ,'FILEGUARD_DATA':str(self.data)},stdin=subprocess.PIPE,stdout=subprocess.PIPE,encoding='utf-8')
        return self
    def call(self,cmd,args=None):
        self.worker.stdin.write(json.dumps({'cmd':cmd,'args':args or {}})+'\n')
        self.worker.stdin.flush()
        result=json.loads(self.worker.stdout.readline())
        if not result['ok']:
            raise RuntimeError(result['error'])
        return result['data']
    def until(self,fn):
        end=time.monotonic()+20
        while time.monotonic()<end:
            if fn():return
            time.sleep(.2)
        raise AssertionError('监控状态未在时限内达到预期')
    def __exit__(self,*exc):
        self.worker.stdin.close()
        try:
            self.worker.wait(timeout=8)
        except subprocess.TimeoutExpired:
            self.worker.kill();self.worker.wait()
        self.worker.stdout.close()

