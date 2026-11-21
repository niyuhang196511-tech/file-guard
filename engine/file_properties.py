"""文本序列化、图像属性和压缩包清单。仅处理版本快照。"""
import codecs
from collections import Counter
import hashlib
import warnings
import zipfile

from PIL import Image, ExifTags


def decode_text(path):
    return decode_text_bytes(path.read_bytes())


def decode_text_bytes(raw):
    signatures = (
        (codecs.BOM_UTF32_LE,'utf-32','UTF-32 LE'),(codecs.BOM_UTF32_BE,'utf-32','UTF-32 BE'),
        (codecs.BOM_UTF16_LE,'utf-16','UTF-16 LE'),(codecs.BOM_UTF16_BE,'utf-16','UTF-16 BE'),
        (codecs.BOM_UTF8,'utf-8-sig','UTF-8 BOM'),
    )
    for marker,codec,name in signatures:
        if raw.startswith(marker):
            text = raw.decode(codec)
            break
    else:
        for codec,name in [('utf-8','UTF-8'),('gb18030','GB18030')]:
            try:
                text = raw.decode(codec)
                break
            except UnicodeDecodeError:
                continue
        else:
            raise ValueError('无法识别文本编码')
    if '\0' in text:
        raise ValueError('文本含空字符，请核对文件内容和编码')
    return text,name


def serialization(text, encoding):
    crlf=text.count('\r\n')
    styles=[label for label,count in [('CRLF',crlf),('LF',text.count('\n')-crlf),('CR',text.count('\r')-crlf)] if count]
    return {'文本编码':encoding,'换行方式':'、'.join(styles) or '无',
            '文末换行':'有' if text.endswith(('\n','\r')) else '无'}


def json_object(pairs):
    obj={}
    for name,value in pairs:
        if name in obj:
            raise ValueError('JSON 字段重复：'+name)
        obj[name]=value
    return obj


def archive(path):
    with zipfile.ZipFile(path) as package:
        counts=Counter(info.filename for info in package.infolist())
        for info in package.infolist():
            if counts[info.filename]>1:
                raise ValueError('压缩包内有重名条目：'+info.filename)
            if info.is_dir():
                yield ('压缩包目录',info.filename),'目录'
            else:
                with package.open(info) as file:
                    digest=hashlib.file_digest(file,'sha256').hexdigest()
                yield ('压缩包文件',info.filename), f'{info.file_size} 字节 · SHA-256 {digest}'


def image(path):
    with warnings.catch_warnings():
        warnings.simplefilter('error',Image.DecompressionBombWarning)
        with Image.open(path) as im:
            yield ('图像属性','像素尺寸'), f'{im.width} × {im.height}'
            yield ('图像属性','色彩模式'), im.mode
            yield ('图像属性','帧数'), str(getattr(im,'n_frames',1))
            if profile:=im.info.get('icc_profile'):
                yield ('图像属性','ICC 色彩配置'),hashlib.sha256(profile).hexdigest()
            for tag,value in im.getexif().items():
                if isinstance(value,bytes):
                    value=f'{len(value)} 字节 · SHA-256 '+hashlib.sha256(value).hexdigest()
                yield ('图像 EXIF',ExifTags.TAGS.get(tag,str(tag))),str(value)
            # Normalize the first frame to include palettes and transparency in the digest.
            if im.width*im.height<=12_000_000:
                with im.convert('RGBA') as frame:
                    yield ('图像内容','首帧像素摘要'),hashlib.sha256(frame.tobytes()).hexdigest()
            else:
                yield ('图像内容','首帧像素摘要'),'超过 1200 万像素，仅比较属性'
            frames=getattr(im,'n_frames',1)
            if frames>1:
                if 'loop' in im.info:yield ('动画','循环次数'),str(im.info['loop'])
                budget=24_000_000
                for index in range(min(frames,240)):
                    im.seek(index)
                    pixels=im.width*im.height
                    if pixels>budget or pixels>12_000_000:
                        yield ('动画','逐帧比较范围'),f'已检查 {index} / {frames} 帧'
                        break
                    budget-=pixels
                    area=f'第 {index+1} 帧'
                    if index:
                        with im.convert('RGBA') as frame:
                            yield (area,'像素摘要'),hashlib.sha256(frame.tobytes()).hexdigest()
                    if 'duration' in im.info:yield (area,'显示时长（毫秒）'),str(im.info['duration'])
                else:
                    if frames>240:yield ('动画','逐帧比较范围'),f'已检查 240 / {frames} 帧'
