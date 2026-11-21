"""通过桌面实际使用的进程协议检查已打包引擎；未指定路径时测试 Python 入口。"""
import argparse
import hashlib
import json
import os
from pathlib import Path
from queue import Queue, Empty
import subprocess
import sys
import tempfile
from threading import Thread
import time

from openpyxl import Workbook
from docx import Document


def verify(command):
    with tempfile.TemporaryDirectory() as temp:
        location=Path(temp)
        root=location/'测试台账'
        root.mkdir()
        source=root/'库存.xlsx'
        def save(codes):
            workbook=Workbook()
            sheet=workbook.active
            sheet.append(['编码','库存'])
            for code in codes:
                sheet.append([code,10])
            workbook.save(location/'待提交.xlsx')
            workbook.close()
            os.replace(location/'待提交.xlsx',source)
        save(['A','B'])
        cwd=Path(__file__).resolve().parents[1] if command[0]==sys.executable else location
        process=subprocess.Popen(command,cwd=cwd,
                                 env={**os.environ,'FILEGUARD_DATA':str(location/'仓库')},
                                 stdin=subprocess.PIPE,stdout=subprocess.PIPE,encoding='utf-8')
        replies=Queue()
        def receive():
            for response in process.stdout:
                replies.put(response)
            replies.put('')
        reader=Thread(target=receive,daemon=True)
        reader.start()
        def call(cmd,**args):
            process.stdin.write(json.dumps({'cmd':cmd,'args':args})+'\n')
            process.stdin.flush()
            try:
                line=replies.get(timeout=60)
            except Empty as exc:
                raise TimeoutError(f'{cmd} 请求超时') from exc
            if not line:
                raise RuntimeError(f'引擎提前停止，操作为 {cmd}')
            reply=json.loads(line)
            if not reply['ok']:
                raise RuntimeError(reply['error'])
            return reply['data']
        def wait_for(check):
            limit=time.monotonic()+45
            while time.monotonic()<limit:
                result=check()
                if result:
                    return result
                time.sleep(.25)
            raise TimeoutError('未生成预期的文件版本')
        try:
            rid=call('configure',path=str(root))
            found=wait_for(lambda:call('files')['items'])
            fid=found[0]['id']
            before=call('history',id=fid)[0]
            save(['A','X','B'])
            call('scan',id=rid)
            def parsed():
                history=call('history',id=fid)
                return history[0] if len(history)>1 and history[0]['status']=='已解析' else None
            after=wait_for(parsed)
            items=call('compare',old=before['id'],new=after['id'])['items']
            if len(items)!=1 or items[0].get('record_key')!='X':
                raise ValueError('独立引擎的 Excel 编号对齐结果异常')
            if call('finder',record='X',root=rid)['total']!=1:
                raise ValueError('独立引擎的跨文件差异检索异常')
            receipt=call('save_receipt',id=fid,mode='full',object=True)
            if receipt['result']!='已记入最新版本' or receipt['object_state']!='历史副本校验通过':
                raise ValueError('已保存文件与最新版本核对异常')
            table=call('table_source',id=after['id'])
            if not table['rows'] or table['rows'][2][0][1]!='X':
                raise ValueError('台账版本读取异常')
            if call('field_trace',id=fid,record='X')['total']!=1:
                raise ValueError('新增记录未出现在字段轨迹中')
            if not call('period_report',group='file',root_id=rid)['after']:
                raise ValueError('期间对照没有记录本次保存')
            hit=call('sheet_find',old=before['id'],new=after['id'],side='new',q='X',exact=True)['items']
            if len(hit)!=1 or hit[0]['address']!='A3':
                raise ValueError('整表单元格地址异常')
            if not call('scan_log',root=rid)['total']:
                raise ValueError('未记录独立引擎扫描运行')
            checkpoint=call('checkpoint_create',root=rid,label='独立进程交接')
            archive=location/'交付.zip'
            call('handoff_create',id=checkpoint,path=str(archive))
            if not call('handoff_verify',id=checkpoint,path=str(archive))['ok']:
                raise ValueError('独立引擎交付包校验异常')
            if call('checkpoint_disk',id=checkpoint)['counts'].get('内容一致')!=1:
                raise ValueError('独立引擎磁盘核对异常')
            preview=call('restore_info',id=before['id'])
            call('restore',id=before['id'],preview=preview['preview'])
            restored=call('history',id=fid)[0]
            actual_hash=hashlib.sha256(source.read_bytes()).hexdigest()
            if actual_hash!=before['sha'] or restored['sha']!=actual_hash or restored['num']<=after['num']:
                raise ValueError('独立引擎的恢复结果异常')
            word=root/'作业指导书.docx'
            def save_word(revised):
                doc=Document()
                doc.add_paragraph('核对物料编号。')
                if revised:
                    doc.add_paragraph('填写复核人姓名。')
                doc.add_paragraph('保存记录。')
                doc.sections[0].footer.paragraphs[0].text='版次 B' if revised else '版次 A'
                stage=location/'待提交.docx'
                doc.save(stage)
                os.replace(stage,word)
            save_word(False)
            call('scan',id=rid)
            doc_id=wait_for(lambda:call('files',q=word.name)['items'])[0]['id']
            first=call('history',id=doc_id)[0]
            save_word(True)
            call('scan',id=rid)
            def parsed_word():
                result=call('history',id=doc_id)
                return result[0] if len(result)>1 and result[0]['status']=='已解析' else None
            second=wait_for(parsed_word)
            word_result=call('compare',old=first['id'],new=second['id'])
            if word_result['total']!=2 or not any('页脚' in r['sheet'] for r in word_result['items']):
                raise ValueError('独立引擎的 Word 段落与页脚对比异常')
        finally:
            process.stdin.close()
            try:
                process.wait(timeout=15)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()
            reader.join(timeout=2)
            process.stdout.close()
        if process.returncode:
            raise RuntimeError(f'引擎退出码 {process.returncode}')
    print('引擎已通过保存核对、台账版本读取、期间对照、字段变动轨迹、建档、Excel 编号对齐与定位、跨文件检索、扫描记录、Word 段落与页脚比较、交付包、现场核对、预览后恢复与退出检查。')


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--engine',type=Path)
    options=parser.parse_args()
    verify([str(options.engine.resolve())] if options.engine else [sys.executable,'-m','engine.main'])
