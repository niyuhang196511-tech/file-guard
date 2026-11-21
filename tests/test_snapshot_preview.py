import codecs
import csv
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from engine import snapshot_preview
from engine.service import Service
from engine.store import Store


class SnapshotPreviewTests(unittest.TestCase):
    def setUp(self):
        temp=tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.base=Path(temp.name)
        self.folder=self.base/'监控'
        self.folder.mkdir()
        self.store=Store(self.base/'Data')
        self.api=Service(self.store)
        self.rid=self.store.configure(self.folder)

    def save(self,value,name='样例.txt'):
        path=self.folder/name
        path.write_bytes(value if isinstance(value,bytes) else value.encode('utf-8'))
        self.store.scan(self.rid)
        with self.store.db() as db:
            return dict(db.execute("""SELECT v.* FROM versions v JOIN files f ON f.id=v.file_id
                                      WHERE f.rel=? ORDER BY v.id DESC LIMIT 1""",(name,)).fetchone())

    def view(self,row,**options):
        return self.api.dispatch('snapshot_preview',dict(id=row['id'],**options))

    def export(self,row,name='原件.csv',**options):
        path=self.base/name
        self.api.dispatch('snapshot_preview_csv',dict(id=row['id'],path=str(path),**options))
        return path

    def test_original_before_or_after_site_change_remains_readable(self):
        first=self.save('第一版\n后置',name='检查.txt')
        newest=self.save('第二版',name='检查.txt')
        (self.folder/'检查.txt').rename(self.folder/'改名.txt')
        self.store.scan(self.rid)
        (self.folder/'改名.txt').unlink()
        self.store.scan(self.rid)
        result=self.view(first)
        self.assertEqual((result['mode'],result['units'],result['meta']['num'],result['meta']['rel']),
                         ('text',2,1,'改名.txt'))
        self.assertEqual(result['meta']['sha'],first['sha'])
        self.assertEqual(result['items'][0]['right'],'第一版')
        self.assertEqual(self.view(newest)['items'][0]['right'],'第二版')

    def test_preserves_crlf_cr_lf_blank_lines_and_final_missing_newline(self):
        row=self.save('第一行\r\n\r中间\n末尾')
        result=self.view(row)
        self.assertEqual(result['endings'],{'CRLF':1,'CR':1,'LF':1,'无':1})
        self.assertEqual([(r['pos'],r['right'],r['ending']) for r in result['items']],
                         [(1,'第一行','CRLF'),(2,'','CR'),(3,'中间','LF'),(4,'末尾','无')])
        self.assertEqual(self.view(self.save(''))['total'],0)
        self.assertEqual(self.view(self.save('\n'))['total'],1)

    def test_supported_text_encodings_and_bom_is_visible_in_hex(self):
        for i,(raw,name) in enumerate([
            (codecs.BOM_UTF8+'中文'.encode(),'UTF-8 BOM'),
            (codecs.BOM_UTF16_LE+'中文'.encode('utf-16-le'),'UTF-16 LE'),
            (codecs.BOM_UTF16_BE+'中文'.encode('utf-16-be'),'UTF-16 BE'),
            (codecs.BOM_UTF32_LE+'中文'.encode('utf-32-le'),'UTF-32 LE'),
            (codecs.BOM_UTF32_BE+'中文'.encode('utf-32-be'),'UTF-32 BE'),
            ('中文'.encode('gb18030'),'GB18030'),
        ]):
            with self.subTest(encoding=name):
                row=self.save(raw,name=f'编码{i}.log')
                result=self.view(row)
                self.assertEqual((result['encoding'],result['items'][0]['right']),(name,'中文'))
                self.assertEqual(self.view(row,mode='hex')['items'][0]['cells'],[f'{b:02X}' for b in raw])

    def test_binary_detection_and_explicit_override(self):
        binary=self.save(b'PK\x03\x04\0abc',name='二进制.dat')
        normal=self.view(binary)
        self.assertEqual((normal['mode'],normal['fallback']),('hex','此格式按原始字节查看'))
        self.assertEqual(normal['items'][0]['ascii'],'PK...abc')
        with self.assertRaisesRegex(ValueError,'无法按文本查看'):
            self.view(binary,mode='text')
        text=self.save('外部类型',name='可读.custom')
        self.assertEqual(self.view(text)['mode'],'hex')
        self.assertEqual(self.view(text,mode='text')['items'][0]['right'],'外部类型')

    def test_auto_fallback_for_decode_or_line_limit(self):
        bad=self.save(b'with\0nul')
        self.assertIn('自动改按原始字节',self.view(bad)['fallback'])
        good=self.save('1\n2\n3')
        with patch.object(snapshot_preview,'MAX_LINES',2):
            self.assertEqual(self.view(good)['mode'],'hex')
            with self.assertRaisesRegex(ValueError,'物理行'):
                self.view(good,mode='text')

    def test_casefold_exact_range_and_unicode_column(self):
        row=self.save('😀Straße\nSTRASSE\nStraße\n空格 ')
        folded=self.view(row,q='STRASSE')
        self.assertEqual(folded['total'],3)
        self.assertEqual((folded['items'][0]['match'],folded['items'][0]['hit']),(2,'Straße'))
        opts=dict(q='STRASSE',low=2,high=3,exact=True,sensitive=True)
        self.assertEqual(self.view(row,**opts)['total'],1)
        self.assertEqual(self.view(row,q=' ',exact=False)['items'][0]['pos'],4)

    def test_long_multibyte_line_window_preserves_match_and_export(self):
        row=self.save('长'*410+'匹配'+'尾'*410)
        result=self.view(row,q='匹配')['items'][0]
        self.assertTrue(result['before'] and result['after'])
        self.assertEqual(result['hit'],'匹配')
        self.assertEqual(sum(len(result[k]) for k in ('left','hit','right')),360)
        self.assertEqual(result['match'],411)
        with self.export(row,q='匹配').open(encoding='utf-8-sig',newline='') as stream:
            exported,=csv.DictReader(stream)
        self.assertEqual(len(exported['原文']),822)

    def test_line_location_finds_filtered_page_and_clamps_outside_end(self):
        row=self.save('\n'.join(f"{i} {'匹配' if i%2 else ''}" for i in range(1,90)))
        with_page=self.view(row,q='匹配',size=20,at=42)
        self.assertEqual((with_page['page'],with_page['total'],with_page['items'][1]['pos']),(2,45,43))
        self.assertEqual(self.view(row,at=1000,size=20)['page'],5)
        self.assertEqual(self.view(row,page=0,size=20)['page'],1)

    def test_hex_range_clips_edges_and_uses_decimal_positions(self):
        row=self.save(bytes(range(70)),name='bytes.bin')
        report=self.view(row,low=14,high=33,width=16)
        self.assertEqual([(r['pos'],r['end'],len(r['cells'])) for r in report['items']],[(14,15,2),(16,31,16),(32,33,2)])
        self.assertEqual(report['items'][-1]['ascii'],' !')
        self.assertEqual(len(self.view(row,width=32)['items']),3)

    def test_hex_signature_search_can_span_two_rows_and_respects_exact_range(self):
        row=self.save(b'x'*15+b'ABCD'+b'x'*34,name='bytes.bin')
        result=self.view(row,q='41 42 43 44')
        one,=result['items']
        self.assertEqual((one['pos'],one['match'],one['match_size']),(0,15,4))
        self.assertEqual(self.view(row,q='41424344',low=15,high=18)['total'],1)
        self.assertEqual(self.view(row,q='41424344',low=15,high=17)['total'],0)

    def test_hex_direct_location_uses_row_containing_offset(self):
        row=self.save(bytes(range(256))*5,name='data.bin')
        before=self.view(row,at=319,size=20,width=16)
        next_page=self.view(row,at=320,size=20,width=16)
        self.assertEqual((before['page'],next_page['page']),(1,2))
        self.assertEqual(self.view(row,at=9000,size=20)['page'],4)

    def test_archive_error_and_size_upper_limit_before_read(self):
        row=self.save('可验证')
        with patch.object(snapshot_preview,'MAX_BYTES',5),patch.object(snapshot_preview,'snapshot_bytes') as raw:
            with self.assertRaisesRegex(ValueError,'预览上限'):
                self.view(row)
            raw.assert_not_called()
        obj=self.store.obj(row['sha'])
        obj.write_bytes(b'X'*row['size'])
        with self.assertRaisesRegex(ValueError,'副本校验失败'):
            self.view(row,mode='hex')
        obj.unlink()
        with self.assertRaisesRegex(ValueError,'副本缺失或不可读'):
            self.view(row)
        with self.assertRaisesRegex(ValueError,'历史版本不存在'):
            self.view({'id':71234})

    def test_csv_export_exact_filters_formula_safety_and_no_overwrite(self):
        row=self.save('=字段,中文\r\n'+ '\n'.join(f'字段 {i}' for i in range(40)))
        path=self.export(row,low=1,high=35,size=20,page=2)
        self.assertTrue(path.read_bytes().startswith(codecs.BOM_UTF8))
        with path.open(encoding='utf-8-sig',newline='') as stream:
            rows=list(csv.DictReader(stream))
        self.assertEqual((len(rows),rows[0]['原文'],rows[0]['换行']),(35,"'=字段,中文",'CRLF'))
        with self.assertRaises(FileExistsError):
            self.export(row)
        for path in (self.store.home/'里面.csv',self.base/'非.csv.log'):
            with self.assertRaises(ValueError):
                self.api.dispatch('snapshot_preview_csv',dict(id=row['id'],path=str(path)))
        self.assertEqual(self.api.dispatch('audit',{'action':'导出历史原件预览'})['total'],1)

    def test_hex_csv_and_export_threshold(self):
        row=self.save(b'AB\x00z'+b' '*40,name='data.bin')
        report=self.export(row,low=0,high=3)
        with report.open(encoding='utf-8-sig',newline='') as stream:
            entry,=csv.DictReader(stream)
        self.assertEqual((entry['起始字节偏移'],entry['结束字节偏移'],entry['十六进制'],entry['ASCII']),('0','3','41 42 00 7A','AB.z'))
        with patch.object(snapshot_preview,'MAX_CSV',1),self.assertRaisesRegex(ValueError,'缩小'):
            self.export(row,'超限.csv')
        self.assertFalse((self.base/'超限.csv').exists())

    def test_bad_parameters_and_schema_preserved(self):
        row=self.save('TEXT')
        for opts in ({'mode':'render'},{'size':21},{'width':8},{'at':0},{'low':False},{'low':4,'high':3},
                     {'q':'\n'},{'q':'字'*161},{'mode':'hex','q':'A'},{'mode':'hex','q':'00 '*65}):
            with self.subTest(opts=opts),self.assertRaises(ValueError):
                self.view(row,**opts)
        with self.store.db() as db:
            self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0],11)
