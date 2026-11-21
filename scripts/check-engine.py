"""通过桌面实际使用的进程协议检查已打包引擎；未指定路径时测试 Python 入口。"""
import argparse
import csv
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
            journal=call('scan_log',root=rid,state='完成',sort='oldest',size=50)
            if not journal['total'] or journal['summary']['finished']!=journal['total'] or journal['summary']['captured']<1:
                raise ValueError('独立引擎扫描运行汇总异常')
            scan_day=journal['items'][-1]['started'][:10]
            criteria=dict(root=rid,start=scan_day,end=scan_day,state='完成',sort='oldest')
            journal=call('scan_log',**criteria)
            report=location/'扫描运行记录.csv'
            call('scan_log_export',**criteria,path=str(report),detail=True)
            with report.open(encoding='utf-8-sig',newline='') as stream:
                scan_rows=list(csv.DictReader(stream))
            report_ids=[int(row['扫描编号']) for row in scan_rows]
            journal_ids=[row['id'] for row in journal['items']]
            if len(report_ids)<journal['total'] or not all(rid in report_ids for rid in journal_ids):
                raise ValueError('独立引擎扫描记录导出与筛选不符')
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
            text=root/'签收.txt'
            text.write_text('第一行\n物料已签收\n备注',encoding='utf-8-sig')
            call('scan',id=rid)
            hit=wait_for(lambda:call('text_search',q='已签收',ext='txt',root=rid,context=1)['items'])[0]
            if hit['encoding']!='UTF-8 BOM' or hit['previews'][0]['rows'][1]['match']!='已签收':
                raise ValueError('独立引擎的历史正文检索异常')
            (root/'签收备存.md').write_bytes(text.read_bytes())
            call('scan',id=rid)
            same=wait_for(lambda:call('content_groups',root=rid,ext='txt, md')['items'])[0]
            references=call('content_refs',sha=same['sha'])['items']
            if {r['rel'] for r in references}!={'签收.txt','签收备存.md'} or call('content_verify',sha=same['sha'])['status']!='通过':
                raise ValueError('独立引擎的相同内容追溯异常')
            text.write_text('前置说明\n第一行\n物料已签收\n补充备注',encoding='utf-8-sig')
            call('scan',id=rid)
            newer=wait_for(lambda:next((v for v in call('history',id=hit['file_id']) if v['num']==2),None))
            report=call('line_origins',id=newer['id'])
            if [(r['origin']['num'],r['source_line']) for r in report['items']]!=[(2,1),(1,1),(1,2),(2,4)]:
                raise ValueError('独立引擎的逐行来源异常')
            batch=dict(targets=[dict(id=row['id'],revision=row['revision']) for row in
                                call('history',id=hit['file_id'])],state='已复核',mode='append',note='协议检查')
            preview=call('review_batch_preview',**batch)
            if preview['counts']['change']!=2 or not preview['token']:
                raise ValueError('独立引擎的批量复核预览异常')
            receipt=call('review_batch_apply',**batch,token=preview['token'])
            if not receipt['applied'] or receipt['changed']!=2 or not all(
                    v['note']=='协议检查' and v['review']=='已复核' for v in call('history',id=hit['file_id'])):
                raise ValueError('独立引擎的批量复核写入异常')
            ids=[v['id'] for v in call('history',id=hit['file_id'])]
            proposal=call('version_bundle_preview',ids=ids)
            bundle=location/'指定版本.zip'
            call('version_bundle_create',ids=ids,token=proposal['token'],path=str(bundle))
            verified=call('version_bundle_verify',ids=ids,path=str(bundle))
            if not verified['ok'] or verified['verified']!=2 or not verified['compared']:
                raise ValueError('独立引擎的历史版本交付核查异常')
            text.rename(root/'分拣签收.txt')
            call('scan',id=rid)
            departures=wait_for(lambda:call('path_history',rel=text.name,root=rid,direction='移出范围')['items'])
            arrivals=call('path_history',rel='分拣签收.txt',root=rid,direction='移入范围')['items']
            if len(arrivals)!=1 or arrivals[0]['id']!=departures[0]['id'] or arrivals[0]['file_id']!=hit['file_id']:
                raise ValueError('独立引擎的路径沿革异常')
            common=root/'三方.txt'
            checkpoints=[]
            for index,body in enumerate(('初始正文','左侧正文','右侧正文')):
                common.write_text(body,encoding='utf-8')
                call('scan',id=rid)
                wait_for(lambda:call('text_search',q=body,filename=common.name,root=rid)['items'])
                checkpoints.append(call('checkpoint_create',root=rid,label='三方协议 '+str(index)))
            base,left,right=checkpoints
            tri=call('checkpoint_three',base=base,left=left,right=right,q=common.name)
            if tri['total']!=1 or tri['review']!=1 or tri['items'][0]['kind']!='两侧内容冲突':
                raise ValueError('独立引擎的清单三方对照异常')
            current=tri['items'][0]['right']['id']
            preview=call('snapshot_preview',id=current,q='右侧')
            if preview['mode']!='text' or preview['items'][0]['hit']!='右侧':
                raise ValueError('独立引擎的历史原件文本预览异常')
            hex_preview=call('snapshot_preview',id=current,mode='hex',low=0,high=2)
            if hex_preview['items'][0]['cells']!=[f'{b:02X}' for b in '右'.encode('utf-8')]:
                raise ValueError('独立引擎的历史原件字节预览异常')
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
    print('引擎已通过扫描诊断和明细导出、历史原件预览、清单三方对照、路径沿革、历史版本交付篮、批量版本复核、逐行来源、相同内容追溯、历史正文检索、保存核对、台账版本读取、期间对照、字段变动轨迹、建档、Excel 编号对齐与定位、跨文件检索、Word 段落与页脚比较、交付包、现场核对、预览后恢复与退出检查。')


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--engine',type=Path)
    options=parser.parse_args()
    verify([str(options.engine.resolve())] if options.engine else [sys.executable,'-m','engine.main'])
