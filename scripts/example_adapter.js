// 仅离线界面样例使用。所有记录均来自随时间生成的示例仓库。
window.exampleRequest=async function(cmd,a={}){
  const d=window.FILEGUARD_EXAMPLE;
  const paginate=(arr,size=25)=>{
    const page=Math.max(1,Math.min(a.page||1,Math.ceil(arr.length/size)||1));
    return {items:arr.slice((page-1)*size,page*size),total:arr.length,page,size};
  };
  const csvText=rows=>{
    const quote=v=>{
      let value=String(v??'');
      if(/^[\t\r\n]|^\s*[=+@-]/.test(value))value="'"+value;
      return '"'+value.replace(/"/g,'""')+'"';
    };
    return '\uFEFF'+rows.map(row=>row.map(quote).join(',')).join('\r\n')+'\r\n';
  };
  const inRange=stamp=>(!a.start||stamp.slice(0,10)>=a.start)&&(!a.end||stamp.slice(0,10)<=a.end);
  if(['events','export','audit'].includes(cmd)&&a.start&&a.end&&a.start>a.end)
    throw Error('结束日期不能早于开始日期');
  const auditExample=(action,note)=>d.audit.unshift({id:Math.max(0,...d.audit.map(x=>x.id))+1,stamp:d.summary.stamp,action,note});
  const edits=d.exampleEdits??={};
  const publicEvent=e=>{
    const h=edits[e.id]?.[0];
    if(!h)return e;
    if(h.hidden===2)return null;
    if(!h.hidden)return {...e,caption:h.caption,revision:h.revision};
    return {id:e.id,stamp:e.stamp,rel:'（已撤回）',old_rel:'',kind:'已撤回',source:'',ext:'',caption:'',revision:h.revision};
  };
  const page112=arr=>{const p=paginate(arr,25);return {...p,pages:Math.max(1,Math.ceil(p.total/25))}};
  if(cmd==='snapshot_preview'||cmd==='snapshot_preview_csv'){
    const bundle=d.snapshotPreview,entry=bundle.samples[a.id];
    if(!entry)throw Error('离线预览提供文本样例和一份工作簿。');
    const size=a.size||50,width=a.width||16;
    const q=a.q===undefined?'':a.q;
    if(typeof q!=='string'||Array.from(q).length>512||/[\r\n\0]/.test(q))throw Error('检索内容须为不超过 512 字的单行文本');
    if(a.low!=null&&a.high!=null&&a.low>a.high)throw Error('起始位置须小于或等于结束位置');
    let mode=a.mode||'auto',fallback='';
    if(mode==='auto'&&!entry.auto_text){mode='hex';fallback='此格式按原始字节查看';}
    if(mode!=='hex'&&!entry.text){
      if(mode==='text')throw Error('无法按文本查看：'+entry.error);
      mode='hex';fallback='自动改按原始字节查看：'+entry.error;
    }else if(mode!=='hex')mode='text';
    const rows=[];
    let units,make,encoding='',endings={};
    if(mode==='text'){
      if(Array.from(q).length>160)throw Error('检索内容须为不超过 160 字的单行文本');
      if([a.low,a.high,a.at].includes(0))throw Error('文本行号从 1 开始');
      const text=entry.text;
      units=text.rows.length;encoding=text.encoding;endings=text.endings;
      const fold=s=>Array.from(s,c=>d.textSearch.fold[c]??c.toLowerCase()).join('');
      const transform=a.sensitive?s=>s:fold;
      const needle=transform(q);
      for(let pos=a.low||1;pos<=Math.min(a.high??units,units);pos++){
        const original=text.rows[pos-1][0],hay=transform(original);
        const index=a.exact?(hay===needle?0:-1):hay.indexOf(needle);
        if(needle&&index<0)continue;
        let start=0,stop=0;
        if(needle){
          let offset=0,found=false;
          for(const [i,char] of Array.from(original).entries()){
            offset+=transform(char).length;
            if(!found&&offset>index){start=i;found=true;}
            if(offset>=index+needle.length){stop=i+1;break;}
          }
        }
        rows.push({pos,start,stop,match:needle?start+1:null});
      }
      make=({pos,start,stop,match})=>{
        const [original,ending]=text.rows[pos-1],chars=Array.from(original);
        const lo=Math.max(0,Math.min(start-64,chars.length-bundle.screen)),hi=lo+bundle.screen;
        return {pos,match,text:original,ending,left:chars.slice(lo,start).join(''),hit:chars.slice(start,Math.min(stop,hi)).join(''),
          right:chars.slice(stop,hi).join(''),before:lo>0,after:hi<chars.length};
      };
    }else{
      const compact=q.replace(/[\p{White_Space}\u001c-\u001f]+/gu,'');
      if(compact&&!/^(?:[0-9a-f]{2}){1,64}$/i.test(compact))throw Error('字节检索请输入 1 至 64 组两位十六进制数字');
      const needle=(compact.match(/../g)||[]).map(x=>parseInt(x,16));
      const raw=Uint8Array.from(atob(entry.raw),c=>c.charCodeAt(0));
      units=raw.length;
      const lo=a.low??0,hi=Math.min(units,(a.high??units-1)+1);
      if(lo<hi)for(let start=Math.floor(lo/width)*width;start<hi;start+=width){
        const pos=Math.max(start,lo),end=Math.min(start+width,hi)-1;
        let match=null;
        for(let i=pos;needle.length&&i<=end&&i+needle.length<=hi;i++){
          if(needle.every((byte,j)=>byte===raw[i+j])){match=i;break;}
        }
        if(!needle.length||match!==null)rows.push({pos,end,match,match_size:needle.length});
      }
      make=row=>{
        const chunk=raw.slice(row.pos,row.end+1);
        return {...row,cells:Array.from(chunk,b=>b.toString(16).toUpperCase().padStart(2,'0')),
          ascii:Array.from(chunk,b=>b>=32&&b<=126?String.fromCharCode(b):'.').join('')};
      };
    }
    if(cmd==='snapshot_preview_csv'){
      if(!rows.length||rows.length>10000)throw Error(rows.length?'超过 1 万行，请缩小预览范围':'当前没有可导出的记录');
      return csvText([mode==='text'?bundle.text_header:bundle.hex_header,...rows.map(item=>{
        const r=make(item);
        return [entry.meta.rel,entry.meta.num,...(mode==='text'?[r.pos,r.match,r.ending,r.text]:
          [r.pos,r.end,r.match,r.cells.join(' '),r.ascii])];
      })]);
    }
    const pages=Math.max(1,Math.ceil(rows.length/size));
    let page=Math.min(pages,Math.max(1,a.page||1));
    if(a.at!=null&&rows.length){
      const index=rows.findIndex(r=>mode==='text'?r.pos>=a.at:r.end>=a.at);
      page=Math.floor((index<0?rows.length-1:index)/size)+1;
    }
    return {meta:entry.meta,mode,encoding,endings,fallback,units,total:rows.length,page,pages,size,at:a.at??null,
      items:rows.slice((page-1)*size,page*size).map(make).map(({text,...r})=>r)};
  }
  if(cmd==='path_history'||cmd==='path_history_csv'){
    const mode=a.mode||'path';
    let path=String(a.rel||'').replaceAll('\\','/');
    if(mode==='folder')path=path.replace(/\/+$/,'');
    if(mode==='identity'){
      if(!Number.isSafeInteger(a.file)||a.file<1)throw Error('请输入有效的文件身份编号');
      path='';
    }else if(!path||/^[a-z]:/i.test(path)||path.split('/').some(p=>!p||p==='.'||p==='..')){
      throw Error('请输入相对于监控目录的路径');
    }
    if(a.start&&a.end&&a.start>a.end)throw Error('开始日期须早于或等于结束日期');
    const structural=new Set(['初始建档','新增','重命名','移动','删除']);
    const fold=s=>Array.from(s,c=>d.textSearch.fold[c]??c.toLowerCase()).join('');
    const normalize=s=>a.fold?fold(s):s;
    const needle=normalize(path);
    const match=s=>mode==='folder'?normalize(s).startsWith(needle+'/'):normalize(s)===needle;
    const items=[];
    for(const event of d.events.map(publicEvent)){
      if(!event?.file_id||(a.root&&event.root_id!==a.root)||(a.kind&&event.kind!==a.kind)||
         (a.source&&event.source!==a.source.trim())||(a.structural&&!structural.has(event.kind))||!inRange(event.stamp))continue;
      const old_match=mode!=='identity'&&match(event.old_rel||'');
      const new_match=mode!=='identity'&&match(event.rel);
      if(mode==='identity'?event.file_id!==a.file:!old_match&&!new_match)continue;
      let direction='原位置记录';
      if(['初始建档','新增'].includes(event.kind))direction='新占用记录';
      else if(event.kind==='删除')direction='删除记录';
      else if(mode==='identity'&&['重命名','移动'].includes(event.kind))direction=event.kind;
      else if(event.old_rel){
        if(old_match&&new_match)direction='范围内路径变化';
        else if(old_match)direction='移出范围';
        else if(new_match)direction='移入范围';
      }
      if(!a.direction||a.direction===direction)items.push({...event,old_match,new_match,direction});
    }
    items.sort((x,y)=>Date.parse(x.stamp)-Date.parse(y.stamp)||x.id-y.id);
    const first=items[0]?.stamp??null,last=items.at(-1)?.stamp??null;
    if(cmd==='path_history_csv'){
      if(!items.length)throw Error('当前范围没有可导出的记录');
      if(a.sort!=='oldest')items.reverse();
      return csvText([d.pathHistoryHeader,...items.map(r=>d.pathHistoryFields.map(k=>r[k]))]);
    }
    const counts={},byFile=new Map();
    for(const e of items){
      counts[e.direction]=(counts[e.direction]||0)+1;
      const row=byFile.get(e.file_id)||{file_id:e.file_id,root_id:e.root_id,root:e.root,total:0,first:e.stamp,last:e.stamp};
      row.total++;row.last=e.stamp;
      byFile.set(e.file_id,row);
    }
    const groups=[...byFile.values()].sort((x,y)=>Date.parse(y.last)-Date.parse(x.last)||y.file_id-x.file_id);
    const identity_pages=Math.max(1,Math.ceil(groups.length/20));
    const identity_page=Math.min(identity_pages,Math.max(1,a.identity_page||1));
    if(a.sort!=='oldest')items.reverse();
    const p=paginate(items,a.size||25);
    return {...p,mode,path,first,last,counts,pages:Math.max(1,Math.ceil(p.total/p.size)),
      identities:groups.length,roots:new Set(items.map(r=>r.root_id)).size,
      groups:groups.slice((identity_page-1)*20,identity_page*20),identity_page,identity_pages};
  }
  if(['version_bundle_preview','version_bundle_create','version_bundle_csv','version_bundle_verify'].includes(cmd)){
    const bundle=d.versionBundle;
    if(!Array.isArray(a.ids)||!a.ids.length||a.ids.length>100||new Set(a.ids).size!==a.ids.length)
      throw Error('请选择 1 至 100 个不同的历史版本');
    const label=String(a.label||'').trim()||'历史版本交付',include_paths=!!a.include_paths;
    const ids=[...a.ids].sort((x,y)=>x-y),expected=bundle.example.map(row=>row.id);
    const items=ids.map(id=>bundle.rows[id]||{version_id:id,source_state:'历史版本不存在'});
    const complete=items.every(row=>row.rel&&row.source_state!=='版本索引无效');
    const bytes=items.reduce((n,r)=>n+(r.size||0),0);
    const reasons=bytes>256*1024**2?['所选原始文件合计超过 256 MiB']:[];
    const ready=complete&&!reasons.length&&items.every(r=>r.source_state==='可打包，待验正文');
    const token=complete?JSON.stringify([ids,label,include_paths]):'';
    const sample_zip=ids.join(',')===expected.join(',')&&label==='历史版本交付'&&!include_paths;
    if(cmd==='version_bundle_preview'){
      const counts={};
      for(const r of items)counts[r.source_state]=(counts[r.source_state]||0)+1;
      return {items,total:items.length,bytes,objects:new Set(items.map(r=>r.sha).filter(Boolean)).size,
        roots:new Set(items.map(r=>r.root).filter(Boolean)).size,label,include_paths,counts,ready,complete,reasons,token,sample_zip};
    }
    if(cmd==='version_bundle_verify'){
      if(!complete)throw Error('交付篮含无效或已不存在的版本');
      const receipt=structuredClone(bundle.receipt);
      const extra=expected.filter(id=>!ids.includes(id)),missing=ids.filter(id=>!expected.includes(id));
      for(const [kind,list] of [['当前清单未选择',extra],['当前清单条目未交付',missing]]){
        if(list.length)receipt.counts[kind]=list.length;
        for(const id of list)receipt.issues.push({kind,rel:bundle.rows[id].rel});
      }
      receipt.issue_count=receipt.issues.length;receipt.ok=!receipt.issue_count;
      return receipt;
    }
    if(!complete||a.token!==token)throw Error('交付范围已变化，请重新预览');
    if(cmd==='version_bundle_create'){
      if(!sample_zip)throw Error('请先载入示例交付清单');
      return bundle.zip;
    }
    const header=include_paths?[...bundle.header,'最近登记相对路径']:bundle.header;
    const fields=include_paths?[...bundle.fields,'source_rel']:bundle.fields;
    return csvText([header,...items.map(row=>fields.map(k=>row[k]))]);
  }
  if(cmd==='line_origins'||cmd==='line_origins_csv'){
    const bundle=d.lineOrigins;
    const modes=bundle.reports[a.id]?.[a.moves?1:0];
    const depth=a.depth||20;
    const found=modes?.find(([n])=>n>=depth)||modes?.at(-1);
    if(!found)throw Error('无法追溯目标版本：不支持的历史文件格式或超过上限');
    if(a.high&&a.low>a.high)throw Error('起始行须小于或等于结束行');
    const {target,rows,chain,boundary}=found[1];
    const fold=s=>Array.from(s,c=>d.textSearch.fold[c]??c.toLowerCase()).join('');
    const transform=a.sensitive?s=>s:fold;
    const needle=transform(a.q||'');
    const counts={moved:0},stats=new Map(),selected=[];
    for(const r of rows){
      const origin=r.origin.id;
      counts[r.kind]=(counts[r.kind]||0)+1;counts.moved+=Number(r.moves>0);
      if(!stats.has(origin))stats.set(origin,{lines:0,unknown:0,moved:0});
      const s=stats.get(origin);s.lines++;s.unknown+=Number(r.kind==='unknown');s.moved+=Number(r.moves>0);
      if(a.origin&&a.origin!==origin||a.low&&r.line<a.low||a.high&&r.line>a.high)continue;
      const matches={target:r.kind==='introduced'&&origin===target.id,earlier:r.kind!=='unknown'&&origin!==target.id,
        initial:r.kind==='initial',unknown:r.kind==='unknown',moved:r.moves>0};
      if(a.kind&&!matches[a.kind])continue;
      const text=transform(r.text);
      if(needle&&(a.exact?text!==needle:!text.includes(needle)))continue;
      selected.push(r);
    }
    if(cmd.endsWith('_csv')){
      if(!selected.length)throw Error('当前条件没有可导出的行');
      const labels={initial:'首次建档可见',unknown:'来源未确认',introduced:'此保存中出现'};
      return csvText([bundle.header,...selected.map(r=>[target.rel,target.num,target.stamp,r.line,labels[r.kind],r.origin.num,
        r.origin.stamp,r.source_line,r.moves,r.text])]);
    }
    const page=paginate(selected,a.size||50);
    page.items=page.items.map(row=>{
      const chars=Array.from(row.text);
      return {...row,text:chars.slice(0,bundle.width).join(''),truncated:chars.length>bundle.width};
    });
    return {...page,target,chain,boundary,counts,sources:chain.filter(v=>stats.has(v.id)).map(v=>({...v,...stats.get(v.id)})),
      lines:rows.length,pages:Math.max(1,Math.ceil(page.total/page.size))};
  }
  if(['content_groups','content_refs','content_groups_csv','content_refs_csv','content_verify'].includes(cmd)){
    const c=d.contentCatalog;
    const sha=String(a.sha||'').trim().toLowerCase();
    const refs=cmd.startsWith('content_refs');
    if((sha||refs||cmd==='content_verify')&&!(/^[a-f0-9]{6,64}$/.test(sha))||
       ((refs||cmd==='content_verify')&&sha.length!==64))throw Error('请输入有效的 SHA-256 或前缀');
    if(cmd==='content_verify'){
      if(!c.checks[sha])throw Error('没有引用该摘要的版本');
      return {...c.checks[sha],checked:d.summary.stamp};
    }
    if(refs&&!c.checks[sha])throw Error('没有引用该摘要的版本');
    if(a.start&&a.end&&a.start>a.end)throw Error('开始日期须早于或等于结束日期');
    const min=a.minimum===''||a.minimum==null?0:Number(a.minimum);
    const max=a.maximum===''||a.maximum==null?Number.MAX_SAFE_INTEGER:Number(a.maximum);
    if(!Number.isSafeInteger(min)||!Number.isSafeInteger(max)||min<0||max<min)
      throw Error('最小字节数须小于或等于最大字节数');
    const fold=text=>Array.from(text,ch=>d.textSearch.fold[ch]??ch.toLowerCase()).join('');
    const keyword=fold(String(a.q||'').trim().replaceAll('\\','/'));
    const exts=new Set(String(a.ext||'').toLowerCase().split(/[,，;；\s]+/).filter(e=>e.replace(/^\.+/,'')).map(e=>'.'+e.replace(/^\.+/,'')));
    if(exts.size>32)throw Error('一次最多筛选 32 种历史后缀');
    const items=[];
    for(const f of d.files){
      if((a.root&&f.root_id!==a.root)||(a.starred&&!f.starred)||(a.state&&f.file_state!==a.state)||
         (keyword&&!fold(f.rel).includes(keyword)))continue;
      const versions=d.history[f.id]||[];
      for(const v of versions){
        const latest=v.id===versions[0]?.id;
        if((a.latest&&!latest)||!inRange(v.stamp)||(sha&&!v.sha.startsWith(sha))||
           (exts.size&&!exts.has(v.ext))||(!(a.empty??refs)&&v.size===0)||v.size<min||v.size>max)continue;
        items.push({...v,latest,root:f.root,root_id:f.root_id,rel:f.rel,state:f.file_state});
      }
    }
    const cmp=(x,y)=>x<y?-1:x>y?1:0;
    const recent=(x,y)=>cmp(y.stamp,x.stamp)||y.id-x.id;
    let ordered,summary={};
    if(refs){
      const by={recent,oldest:(x,y)=>recent(y,x),path:(x,y)=>cmp(fold(x.rel),fold(y.rel))||x.file_id-y.file_id||y.num-x.num||y.id-x.id};
      ordered=items.sort(by[a.sort||'recent']);
    }else{
      const grouped=new Map();
      for(const v of items){
        if(!grouped.has(v.sha))grouped.set(v.sha,[]);
        grouped.get(v.sha).push(v);
      }
      ordered=[...grouped].map(([sha,rows])=>{
        const sizes=new Set(rows.map(v=>v.size));
        const size=rows[0].size;
        const conflict=sizes.size!==1||size<0;
        const days=rows.map(v=>v.stamp).sort();
        return {sha,conflict,size:conflict?null:size,versions:rows.length,
          files:new Set(rows.map(v=>v.file_id)).size,roots:new Set(rows.map(v=>v.root_id)).size,
          formats:new Set(rows.map(v=>v.ext)).size,latest:rows.filter(v=>v.latest).length,
          first_stamp:days[0],last_stamp:days.at(-1),logical:conflict?null:size*rows.length,
          saved:conflict?null:size*(rows.length-1)};
      });
      const modes={cross:x=>x.files>1,repeat:x=>x.versions>x.files,shared:x=>x.versions>1,all:()=>true};
      const by={saved:(x,y)=>(y.saved??-1)-(x.saved??-1)||y.versions-x.versions,
        versions:(x,y)=>y.versions-x.versions||y.files-x.files,files:(x,y)=>y.files-x.files||y.versions-x.versions,
        bytes:(x,y)=>(y.size??-1)-(x.size??-1),recent:(x,y)=>cmp(y.last_stamp,x.last_stamp)};
      const order=by[a.sort||'saved'];
      ordered=ordered.filter(modes[a.mode||'cross']).sort((x,y)=>order(x,y)||cmp(x.sha,y.sha));
      summary={total:ordered.length,versions:0,unique_bytes:0,logical:0,saved:0,conflicts:0};
      for(const r of ordered){
        summary.versions+=r.versions;summary.unique_bytes+=r.size??0;
        summary.logical+=r.logical??0;summary.saved+=r.saved??0;summary.conflicts+=Number(r.conflict);
      }
    }
    if(cmd.endsWith('_csv')){
      if(!ordered.length)throw Error('当前范围没有可导出的结果');
      const [header,fields,marker]=refs?[c.ref_header,c.ref_fields,'latest']:[c.group_header,c.group_fields,'conflict'];
      return csvText([header,...ordered.map(r=>fields.map(k=>k===marker?(r[k]?'是':'否'):r[k]))]);
    }
    const p=paginate(ordered,a.size||25);
    return {...p,pages:Math.max(1,Math.ceil(p.total/p.size)),summary};
  }
  if(cmd==='text_search'||cmd==='text_search_csv'){
    const data=d.textSearch;
    const [versionLimit,resultLimit,fileLimit,byteLimit,previewLimit,width]=data.limits;
    const fold=text=>Array.from(text,c=>data.fold[c]??c.toLowerCase()).join('');
    const keyword=String(a.q??'');
    if(!keyword.trim()||Array.from(keyword).length>160||/[\r\n\0]/.test(keyword))
      throw Error('请输入 1 至 160 字的单行检索内容');
    if(a.start&&a.end&&a.start>a.end)throw Error('开始日期须早于或等于结束日期');
    const exts=String(a.ext||'').toLowerCase().split(/[,，;；\s]+/).filter(Boolean).map(ext=>'.'+ext.replace(/^\.+/,''));
    if(exts.some(ext=>!data.extensions.includes(ext)))throw Error('扩展名中含有不支持的文本格式');
    const cap=a.cap||data.cap;
    const before=a.before||0;
    const path=fold(String(a.filename||'').trim().replaceAll('\\','/'));
    const byFile=new Map(d.files.map(f=>[f.id,f]));
    const previous=new Map();
    const states={live:['当前在册','目录已暂停'],history:['已删除','规则已排除','目录已移除'],
      deleted:['已删除'],removed:['目录已移除'],excluded:['规则已排除']};
    for(const row of data.versions){
      if(row.id>cap||previous.has(row.file_id))continue;
      const latest=d.history[row.file_id]?.find(v=>v.id<=cap);
      previous.set(row.file_id,latest?.id);
    }
    const candidates=data.versions.filter(v=>{
      const file=byFile.get(v.file_id);
      return v.id<=cap&&(!before||v.id<before)&&(!a.file||v.file_id===a.file)&&(!a.root||v.root_id===a.root)&&
        (!path||fold(v.rel).includes(path))&&(!exts.length||exts.includes(v.ext))&&inRange(v.stamp)&&
        (!a.scope||states[a.scope]?.includes(v.state))&&(!a.starred||file?.starred)&&(!a.skip_initial||v.parent_id)&&
        (a.latest===false||previous.get(v.file_id)===v.id);
    });
    const items=[],skipped={};
    const transform=a.sensitive?x=>x:fold;
    const needle=transform(keyword);
    const context=a.context||0;
    let scanned=0,checked=0,bytes=0;
    for(const {text,problem,...row} of candidates){
      if(scanned===versionLimit||items.length===resultLimit||row.size<=fileLimit&&bytes+row.size>byteLimit)break;
      scanned++;
      if(row.size<=fileLimit)bytes+=row.size;
      if(problem){skipped[problem]=(skipped[problem]||0)+1;continue;}
      checked++;
      const lines=text.replaceAll('\r\n','\n').replaceAll('\r','\n').replace(/\n$/,'').split('\n');
      const previews=[];
      let matches=0;
      for(let i=0;i<lines.length;i++){
        const value=transform(lines[i]);
        const start=a.exact?(value===needle?0:-1):value.indexOf(needle);
        if(start<0)continue;
        matches++;
        if(previews.length===previewLimit)continue;
        let offset=0,left=null,right=null;
        for(const [index,char] of Array.from(lines[i]).entries()){
          offset+=transform(char).length;
          if(left===null&&offset>start)left=index;
          if(offset>=start+needle.length){right=index+1;break;}
        }
        const rows=[];
        for(let j=Math.max(0,i-context);j<Math.min(lines.length,i+context+1);j++){
          const chars=Array.from(lines[j]);
          const hit=j===i;
          const from=hit?Math.max(0,Math.min(left-64,chars.length-width)):0;
          const until=from+width;
          rows.push({line:j+1,column:hit?left+1:null,head:from>0,tail:chars.length>until,
            prefix:hit?chars.slice(from,left).join(''):'',match:hit?chars.slice(left,Math.min(right,until)).join(''):'',
            suffix:chars.slice(hit?right:from,until).join('')});
        }
        previews.push({line:i+1,rows});
      }
      if(matches)items.push({...row,matches,previews});
    }
    if(cmd==='text_search_csv'){
      if(!items.length)throw Error('此批没有可导出的命中');
      return csvText([data.header,...items.flatMap(item=>item.previews.map(hit=>{
        const row=hit.rows.find(r=>r.column!==null);
        return [item.root,item.rel,item.ext,item.state,item.num,item.stamp,item.encoding,
          item.matches,row.line,row.column,row.prefix+row.match+row.suffix,row.head?'是':'',row.tail?'是':''];
      }))]);
    }
    return {items,checked,skipped,scanned,cap,next:scanned<candidates.length?candidates[scanned-1].id:null};
  }
  if(cmd==='period_report'||cmd==='period_csv'){
    const iso=x=>new Date(x).toISOString().slice(0,10);
    const end=a.end||d.summary.stamp.slice(0,10),last=Date.parse(end+'T00:00:00Z');
    const start=a.start||iso(last-6*86400000),first=Date.parse(start+'T00:00:00Z'),span=last-first+86400000;
    if(!Number.isFinite(span)||span<86400000||span>366*86400000)throw Error('请选择 1 至 366 天');
    const previous=iso(first-span),previous_end=iso(first-86400000);
    const totals=[0,0],files=[new Set(),new Set()],groups=new Map();
    const exts=String(a.ext||'').toLowerCase().split(/[,，;；\s]+/).filter(Boolean).map(v=>'.'+v.replace(/^\.+/,''));
    const fold=text=>Array.from(text,c=>d.textSearch.fold[c]??c.toLowerCase()).join('');
    const q=fold(String(a.q||'').trim().replaceAll('\\','/')),mode=a.group||'file';
    for(const e of d.events.map(publicEvent).filter(x=>x?.file_id).sort((x,y)=>Date.parse(x.stamp)-Date.parse(y.stamp)||x.id-y.id)){
      const day=e.stamp.slice(0,10);if(day<previous||day>end||(!a.initial&&e.kind==='初始建档'))continue;
      if(a.root_id&&+a.root_id!==e.root_id||a.kind&&a.kind!==e.kind||a.source&&a.source!==e.source||exts.length&&!exts.includes(e.ext))continue;
      if(q&&![e.rel,e.old_rel].some(x=>fold(String(x||'')).includes(q)))continue;
      const curr=Number(day>=start);totals[curr]++;files[curr].add(e.file_id);
      let key,label;
      if(mode==='file'){key=e.file_id;label=e.root+' / '+e.rel;}
      else if(mode==='root'){key=e.root_id;label=e.root;}
      else if(mode==='folder'){const folder=e.rel.split('/').slice(0,-1).join('/');key=JSON.stringify([e.root_id,folder]);label=e.root+' / '+(folder||'（根目录）');}
      else if(mode==='weekday'){key=new Date(day+'T00:00:00Z').getUTCDay();label='星期'+'日一二三四五六'[key];}
      else if(mode==='hour'){key=e.stamp.slice(11,13);label=key+' 时';}
      else{key=e[mode];label=key||'（无）';}
      const r=groups.get(key)||{before:0,after:0,first:'',last:'',fs:new Set(),ds:new Set()};
      r.label=label;r.event_id=e.id;groups.set(key,r);
      if(curr){r.after++;r.fs.add(e.file_id);r.ds.add(day);r.first||=e.stamp;r.last=e.stamp;}else r.before++;
    }
    const rows=[...groups.values()].map(({fs,ds,...r})=>({...r,files:fs.size,days:ds.size,delta:r.after-r.before})).filter(r=>!a.trend||({up:r.delta>0,down:r.delta<0,equal:r.delta===0,new:!r.before,gone:!r.after})[a.trend]);
    const sort=a.sort||'after';
    rows.sort((x,y)=>(sort==='label'?0:sort==='drop'?x.delta-y.delta:y[sort]-x[sort])||(x.label<y.label?-1:x.label>y.label?1:0));
    if(cmd==='period_csv')return csvText([['上期开始','上期结束','本期开始','本期结束',...Object.values(d.periodColumns)],...rows.map(r=>[previous,previous_end,start,end,...Object.keys(d.periodColumns).map(k=>r[k])])]);
    return {...page112(rows),start,end,previous,previous_end,before:totals[0],after:totals[1],files_before:files[0].size,files_after:files[1].size};
  }
  if(cmd==='field_trace'||cmd==='trace_csv'){
    const val=k=>String(a[k]||'').trim(),low=Number(val('low')||1),high=Number(val('high')||2147483648);
    if(!val('record')&&!val('field')&&!val('location'))throw Error('至少输入一个业务编号、字段或位置');
    if(!Number.isInteger(low)||!Number.isInteger(high)||low<1||high<low)throw Error('版本区间无效');
    const rows=[],coverage={},matched=new Set(),memory=new Map();
    for(const e of d.events.map(publicEvent).filter(x=>x?.file_id===+a.id&&x.old_v&&x.new_v&&x.old_v!==x.new_v).sort((x,y)=>x.version-y.version||x.id-y.id)){
      const pair=d.pairs[e.old_v+'-'+e.new_v];
      if(!pair||e.version<low||e.version>high||!d.history[a.id]?.some(v=>v.id===e.new_v&&v.parent_id===e.old_v))continue;
      coverage[e.status]=(coverage[e.status]||0)+1;if(e.status!=='已解析')continue;
      for(const item of pair.items){
        const record=item.record_key||'',field=item.field||'',category=item.category||'',loc=item.location;
        if(val('record')&&val('record')!==record||val('field')&&val('field')!==field||val('sheet')&&val('sheet')!==item.sheet)continue;
        if(val('location')&&val('location')!==loc&&!loc.split(' · ')[0].split(' → ').includes(val('location')))continue;
        const valueCategory=['单元格值','数据类型','公式'].includes(category)?'单元格值':category;
        const key=JSON.stringify([item.sheet,record,field,valueCategory,record&&field?'':loc]),set=memory.get(key)||new Set();
        const oldKey=JSON.stringify([item.old_type,item.old]),newKey=JSON.stringify([item.new_type,item.new]);
        const back=item.new!=null&&oldKey!==newKey&&set.has(newKey);
        if(item.old!=null)set.add(oldKey);if(item.new!=null)set.add(newKey);memory.set(key,set);
        if(a.only_return&&!back||val('kind')&&item.kind!==val('kind')||val('category')&&category!==val('category'))continue;
        if(val('value')&&![item.old,item.new].some(v=>v!=null&&String(v).toLowerCase().includes(val('value').toLowerCase())))continue;
        matched.add(e.new_v);
        rows.push({prior:e.prior,version:e.version,stamp:e.stamp,rel:e.rel,old_v:e.old_v,new_v:e.new_v,sheet:item.sheet,record,field,category,location:loc,kind:item.kind,old:item.old,new:item.new,returning:back?'是':'否',event_id:e.id});
      }
    }
    if(!a.ascending)rows.sort((x,y)=>y.version-x.version);
    if(cmd==='trace_csv')return csvText([Object.values(d.traceColumns),...rows.map(r=>Object.keys(d.traceColumns).map(k=>r[k]))]);
    const result=page112(rows);result.items=result.items.map(r=>({...r,old:r.old?.length>800?r.old.slice(0,800)+'…':r.old,new:r.new?.length>800?r.new.slice(0,800)+'…':r.new}));
    return {...result,coverage,versions:matched.size,returns:rows.filter(r=>r.returning==='是').length};
  }
  if(cmd==='table_source'){
    const sheets=d.ledgerSources[a.id];if(!sheets)throw Error('示例中没有这一表格版本');
    const first=Object.keys(sheets)[0],result=sheets[a.sheet||first];
    if(!result)throw Error('工作表不存在');return structuredClone(result);
  }
  if(cmd==='save_receipt'){
    const sample=d.saveReceipts[a.id]?.[a.mode||'quick'];if(!sample)throw Error('没有该文件的示例现场');
    return {...sample,object_state:a.object?sample.object_state:''};
  }
  if(cmd==='ledger_templates')return structuredClone(d.ledgerTemplates||[]);
  if(cmd==='ledger_save'){
    const list=d.ledgerTemplates??=[];const name=String(a.name||'').trim();
    if(!name||name.length>60)throw Error('请输入 1 至 60 字的模板名称');
    if(list.some(t=>t.name===name))throw Error('已存在同名模板，请换一个名称');
    if(list.length>=50)throw Error('最多保留 50 份对账模板');
    const id=(d.ledgerLastId||0)+1;d.ledgerLastId=id;
    list.push({id,name,config:JSON.parse(JSON.stringify(a.config))});return id;
  }
  if(cmd==='ledger_remove'){
    const list=d.ledgerTemplates||[],i=list.findIndex(t=>t.id===a.id);if(i===-1)throw Error('模板已经移除');
    list.splice(i,1);return '已移除模板';
  }
  if(cmd==='restore_info'){
    const r=d.restorePreviews[a.id];
    if(!r||r.error)throw Error(r?.error||'版本不存在');
    return structuredClone(r);
  }
  if(cmd==='inspect_backup')return d.backupExample;
  if(['checkpoint_inventory','checkpoint_disk','inventory_csv','handoff_create','handoff_verify'].includes(cmd)){
    const id=a.id||Object.keys(d.inventory)[0],original=d.inventory[id];
    const meta=Object.values(d.checkpoints).flat().find(c=>c.id===Number(id));
    if(!meta)throw Error('目录清单不存在');
    const q=String(a.q||'').trim().toLowerCase().replaceAll('\\','/'),folder=String(a.folder||'').trim().replaceAll('\\','/').replace(/^\/+|\/+$/g,'');
    const ext=String(a.ext||'').toLowerCase().split(/[,，;；\s]+/).filter(Boolean).map(k=>'.'+k.replace(/^\.+/,''));
    const sha=String(a.sha||'').trim().toLowerCase();if(sha&&!/^[0-9a-f]{1,64}$/.test(sha))throw Error('摘要前缀格式不正确');
    const items=original.filter(r=>(!q||r.rel.toLowerCase().includes(q))&&(!folder||r.rel.startsWith(folder+'/'))&&(!ext.length||ext.includes(r.ext))&&r.sha.startsWith(sha));
    if(a.sort==='size')items.sort((x,y)=>y.size-x.size);
    if(a.sort==='version')items.sort((x,y)=>y.num-x.num);
    if(a.sort==='updated')items.sort((x,y)=>y.stamp.localeCompare(x.stamp));
    if(cmd==='handoff_create'){
      if(items.length!==original.length)throw Error('离线预览提供完整示例包');
      return d.packages[id];
    }
    if(cmd==='handoff_verify'){
      const result=structuredClone(d.receipts[id]);
      if(a.id){
        result.compared=true;const expected=new Set(items.map(r=>r.rel));
        const extra=original.filter(r=>!expected.has(r.rel));
        if(extra.length){result.ok=false;result.counts={'当前清单未选择':extra.length};result.issues=extra.slice(0,100).map(r=>({kind:'当前清单未选择',rel:r.rel}));result.issue_count=extra.length;}
      }
      return result;
    }
    if(cmd==='inventory_csv')return csvText([['相对路径','版本号','大小字节','SHA-256','保存时间'],...items.map(r=>[r.rel,r.num,r.size,r.sha,r.stamp])]);
    const p={...page112(items),meta,bytes:items.reduce((n,r)=>n+r.size,0),objects:new Set(items.map(r=>r.sha)).size};
    if(cmd==='checkpoint_disk'){
      p.items=p.items.map(r=>({...d.diskPages[id][r.rel]}));p.counts={};
      for(const r of p.items){if(a.quick&&['内容一致','内容不同'].includes(r.state)){r.state='大小一致，待验内容';r.disk_sha=null}p.counts[r.state]=(p.counts[r.state]||0)+1;}
      p.checked=d.summary.stamp;p.quick=!!a.quick;
    }
    return p;
  }
  if(cmd==='health_reports')return d.healthReports;
  if(['health_state','health_start','health_cancel'].includes(cmd))return {state:'完成',done:d.healthReports[0].objects,total:d.healthReports[0].objects,report:d.healthReports[0].id};
  if(cmd==='health_results'||cmd==='health_csv'){
    const raw=d.healthRows[a.id];
    const items=raw.items.filter(r=>(a.change?r.change===a.change:r.change!=='本轮未再发现')&&(!a.status||r.status===a.status)&&r.object_key.toLowerCase().includes((a.q||'').toLowerCase()));
    if(cmd==='health_csv')return csvText([['对象或位置','检查结果','索引字节','实际字节','引用版本数','引用文件数','与上轮相比'],...items.map(r=>[r.object_key,r.status,r.expected,r.actual,r.versions,r.files,r.change])]);
    return {...raw,...page112(items)};
  }
  if(cmd==='health_references')return page112(d.healthRefs[a.key]||[]);
  if(cmd==='variance'||cmd==='variance_csv'){
    const base=d.variance[[a.old,a.new,a.mode||'aligned'].join('-')];
    if(!base)throw Error('此版本对尚无数值核对结果');
    const amount=a.minimum==null||a.minimum===''?null:Number(a.minimum),rate=a.rate==null||a.rate===''?null:Number(a.rate);
    if([amount,rate].some(n=>n!==null&&(!Number.isFinite(n)||n<0)))throw Error('阈值必须是非负数');
    const selected=base.items.filter(r=>(!a.sheet||a.sheet===r.sheet)&&(!a.field||r.field===a.field)&&(!a.record||r.record===a.record)&&(amount===null||Math.abs(Number(r.delta))>=amount)&&(rate===null||(Number(r.old)!==0&&Math.abs(Number(r.delta))*100>=rate*Math.abs(Number(r.old)))));
    const counts={};selected.forEach(r=>counts[r.direction]=(counts[r.direction]||0)+1);
    const items=selected.filter(r=>!a.direction||r.direction===a.direction);
    if(a.sort!=='position')items.sort((l,r)=>a.sort==='down'?Number(l.delta)-Number(r.delta):a.sort==='up'?Number(r.delta)-Number(l.delta):a.sort==='rate'?(r.percent===null?-1:Math.abs(Number(r.percent)))-(l.percent===null?-1:Math.abs(Number(l.percent))):Math.abs(Number(r.delta))-Math.abs(Number(l.delta)));
    const groups=new Map();
    for(const r of items){
      const key=JSON.stringify([r.sheet,r.field]),g=groups.get(key)||{sheet:r.sheet,field:r.field,count:0,old:0,new:0,delta:0};
      g.count++;g.old+=Number(r.old);g.new+=Number(r.new);g.delta+=Number(r.delta);groups.set(key,g);
    }
    if(cmd==='variance_csv'){
      const src=d.pairs[a.old+'-'+a.new];
      return csvText([['旧版本','新版本',...Object.values(d.varColumns)],...items.map(r=>[src.old_number,src.new_number,...Object.keys(d.varColumns).map(k=>r[k])])]);
    }
    return {...page112(items),skips:a.sheet||a.field||a.record?{}:base.skips,counts,groups:[...groups.values()]};
  }
  if(cmd==='private_records'){
    const items=Object.entries(edits).filter(([id,list])=>list[0].hidden===2&&(!a.before||Number(id)<a.before)).map(([id,list])=>({id:Number(id),revision:list[0].revision,stamp:list[0].stamp,kind:'已撤回'})).sort((l,r)=>r.id-l.id);
    return {items:items.slice(0,25),before:items.length>25?items[24].id:null};
  }
  if(cmd==='record_detail'||cmd==='record_amend'){
    const e=d.events.find(x=>x.id===a.id);
    if(!e)throw Error('记录不存在');
    const changes=edits[e.id]||[];
    const prev=changes[0]||{revision:0,hidden:false,caption:''};
    if(cmd==='record_detail')return {original:structuredClone(e),changes:structuredClone(changes),revision:prev.revision};
    if(a.revision!==prev.revision)throw Error('记录已更新，请重新查看后再操作');
    if(!a.reason?.trim()||(a.action==='更正'&&!a.caption?.trim()))throw Error('请填写操作原因和更正说明');
    if((a.action==='恢复展示')!==!!prev.hidden)throw Error('当前状态不允许此操作');
    edits[e.id]=[{revision:prev.revision+1,hidden:a.action==='移出普通日志'?2:a.action==='撤回',caption:a.action==='更正'?a.caption:prev.caption,action:a.action,reason:a.reason,stamp:d.summary.stamp},...changes];
    auditExample('记录'+a.action,'事件 #'+e.id+' · 第 '+(prev.revision+1)+' 次处置');return '记录已'+a.action;
  }
  if(cmd==='runtime')return {pid:3048,started:d.summary.stamp,uptime:0,watch:d.summary.watch,queued:0,parsing:0,waiting:0,due_in:null,beats:{扫描:d.summary.stamp,解析:d.summary.stamp},faults:{}};
  if(cmd==='checkpoints')return d.checkpoints[a.root]||[];
  if(cmd==='checkpoint_three'||cmd==='checkpoint_three_csv'){
    if(new Set([a.base,a.left,a.right]).size!==3)throw Error('请选择三份不同的目录清单');
    if(a.base>=Math.min(a.left,a.right))throw Error('基准清单须早于左右两份清单');
    const report=d.cpThree[a.base+'-'+a.left+'-'+a.right];
    if(!report)throw Error('请选择同一监控目录的三份清单');
    const sides=['base','left','right'],fold=s=>Array.from(s,c=>d.textSearch.fold[c]??c.toLowerCase()).join('');
    const q=fold((a.q||'').trim().replaceAll('\\','/'));
    const exts=new Set((a.ext||'').trim().toLowerCase().split(/[,，;；\s]+/).filter(e=>e.replace(/^\.+/,'')).map(e=>'.'+e.replace(/^\.+/,'')));
    if(exts.size>32)throw Error('一次最多选择 32 种后缀');
    const paths=r=>sides.map(s=>r[s]?.rel).filter(Boolean);
    const extOf=path=>path.slice(path.lastIndexOf('/')+1).match(/.(\.[^.]+)$/)?.[1].toLowerCase();
    const selected=report.items.filter(r=>(!q||paths(r).some(p=>fold(p).includes(q)))&&
      (!exts.size||paths(r).some(p=>exts.has(extOf(p))))&&(a.kind?r.kind===a.kind:a.unchanged||r.kind!=='相同'||r.review)&&
      (!a.issues||r.review)&&(!a.collision||r.collision));
    const sortPath=r=>fold((r.candidate_path||paths(r).at(-1)).normalize('NFC'));
    const bytes=r=>a.sort==='left'?Math.abs(r.left_delta):a.sort==='right'?Math.abs(r.right_delta):
      a.sort==='impact'?Math.max(Math.abs(r.left_delta),Math.abs(r.right_delta)):a.sort==='path'?0:Number(r.review);
    selected.sort((x,y)=>bytes(y)-bytes(x)||(sortPath(x)<sortPath(y)?-1:sortPath(x)>sortPath(y)?1:x.file_id-y.file_id));
    if(cmd==='checkpoint_three_csv'){
      if(!selected.length)throw Error('当前范围没有可导出的项目');
      return csvText([d.cpThreeHeader,...selected.map(r=>[
        ...sides.map(s=>report.meta[s].label),r.file_id,r.kind,r.review?'是':'否',r.collision,r.other_count,
        ...sides.flatMap(s=>['rel','num','size','sha'].map(k=>r[s]?.[k])),
        r.left_kind,r.right_kind,r.left_delta,r.right_delta,r.candidate_path,r.candidate_sha])]);
    }
    const counts={};
    for(const r of selected)counts[r.kind]=(counts[r.kind]||0)+1;
    const p=paginate(selected,a.size||25);
    return {...p,meta:report.meta,counts,pages:Math.max(1,Math.ceil(p.total/p.size)),
      review:selected.filter(r=>r.review).length,collisions:selected.filter(r=>r.collision).length,
      left_delta:selected.reduce((sum,r)=>sum+r.left_delta,0),right_delta:selected.reduce((sum,r)=>sum+r.right_delta,0)};
  }
  if(cmd==='rule_history')return d.rules[a.root]||[];
  if(cmd==='checkpoint_diff'||cmd==='checkpoint_export'){
    const rows=d.cpDiff[a.old+'-'+a.new];
    if(!rows)throw Error('请选择同一目录的两份不同清单');
    const fold=text=>Array.from(text,c=>d.textSearch.fold[c]??c.toLowerCase()).join('');
    const q=fold((a.q||'').trim().replaceAll('\\','/'));
    const found=rows.filter(r=>[r.old_path,r.new_path].some(p=>p&&fold(p).includes(q)));
    const counts={};
    found.forEach(r=>counts[r.kind]=(counts[r.kind]||0)+1);
    const selected=found.filter(r=>a.kind?r.kind===a.kind:a.unchanged||r.kind!=='相同');
    if(a.sort)selected.sort((l,r)=>({growth:r.delta-l.delta,shrink:l.delta-r.delta,change:Math.abs(r.delta)-Math.abs(l.delta)})[a.sort]||l.file_id-r.file_id);
    if(cmd==='checkpoint_export')return csvText([['变化','原路径','现路径','旧版本','新版本','旧字节','新字节','字节变化','旧摘要','新摘要'],...selected.map(r=>['kind','old_path','new_path','old_num','new_num','old_size','new_size','delta','old_sha','new_sha'].map(k=>r[k]))]);
    return {...paginate(selected,a.size||25),counts,delta:selected.reduce((sum,r)=>sum+r.delta,0)};
  }
  if(['finder_presets','finder_save','finder_forget'].includes(cmd)){
    const presets=d.finderPresets??=[];
    if(cmd==='finder_presets')return structuredClone(presets);
    if(cmd==='finder_forget'){
      const index=presets.findIndex(p=>p.id===a.id);
      if(index<0)throw Error('条件组合已移除');
      presets.splice(index,1);return '已移除条件组合';
    }
    const {name:raw,...filters}=a,name=raw.trim();
    if(!name||name.length>60)throw Error('请输入 1 至 60 字的名称');
    if(presets.some(p=>p.name===name))throw Error('已有同名条件组合');
    const id=Math.max(0,...presets.map(p=>p.id))+1;
    presets.push({id,name,filters});return id;
  }
  if(['finder','finder_export'].includes(cmd)){
    if(a.start&&a.end&&a.start>a.end)throw Error('开始日期须早于或等于结束日期');
    const valid=new Set(d.events.map(publicEvent).filter(e=>e?.file_id).map(e=>e.id));
    const stars=new Set(d.files.filter(f=>f.starred).map(f=>f.id));
    const norm=v=>a.sensitive?String(v):String(v).toLowerCase();
    const query=norm((a.q||'').trim()),exts=(a.ext||'').toLowerCase().split(/[,，;；\s]+/).filter(Boolean).map(e=>'.'+e.replace(/^\.+/,''));
    const selected=d.finder.filter(r=>{
      if(!valid.has(r.eid)||(a.starred&&!stars.has(r.file_id))||(a.root&&+a.root!==r.root_id)||!inRange(r.stamp))return false;
      if(exts.length&&!exts.includes(r.ext))return false;
      if(a.filename&&!r.rel.toLowerCase().includes(a.filename.trim().toLowerCase().replaceAll('\\','/')))return false;
      for(const [key,col] of [['kind','kind'],['sheet','sheet'],['field','field'],['record','record_key']])if(a[key]&&a[key].trim()!==r[col])return false;
      if(a.direction&&a.direction!==r.direction)return false;
      return !query||(a.side?[a.side]:['old_value','new_value','location','sheet','field','record_key']).some(k=>r[k]!=null&&(a.exact?norm(r[k])===query:norm(r[k]).includes(query)));
    });
    const instant=stamp=>{const value=Date.parse(stamp);return Number.isFinite(value)?value:-Infinity;};
    if(a.sort==='oldest')selected.sort((x,y)=>instant(x.stamp)-instant(y.stamp)||x.eid-y.eid||x.ordinal-y.ordinal);
    if(a.sort==='path')selected.sort((x,y)=>x.rel.localeCompare(y.rel)||instant(y.stamp)-instant(x.stamp)||y.eid-x.eid||y.ordinal-x.ordinal);
    if(cmd==='finder_export')return csvText([Object.values(d.finderColumns),...selected.map(r=>Object.keys(d.finderColumns).map(k=>r[k]))]);
    const result=paginate(selected,a.size||25);
    result.items=result.items.map(r=>({...r,old_value:r.old_value_truncated?Array.from(r.old_value).slice(0,320).join(''):r.old_value,new_value:r.new_value_truncated?Array.from(r.new_value).slice(0,320).join(''):r.new_value}));
    return {...result,files:new Set(selected.map(r=>r.file_id)).size,events:new Set(selected.map(r=>r.eid)).size,pages:Math.max(1,Math.ceil(result.total/result.size))};
  }
  if(cmd==='capture_policy'){
    const root=d.summary.roots.find(r=>r.id===a.root);root.settle_ms=a.settle_ms;root.all_types=a.all_types;
    return '已保存示例监听策略';
  }
  if(cmd==='waiting_files'){
    const rows=d.waits[a.root]||[];
    const compare=(l,r)=>l<r?-1:l>r?1:0;
    const lower=value=>value.replace(/[A-Z]/g,c=>c.toLowerCase());
    const first=(l,r)=>compare(l.first_seen,r.first_seen)||compare(l.rel,r.rel);
    const orders={
      '':first,
      attempts:(l,r)=>r.attempts-l.attempts||first(l,r),
      path:(l,r)=>compare(lower(l.rel),lower(r.rel))||compare(l.rel,r.rel),
      recent:(l,r)=>compare(r.last_seen,l.last_seen)||compare(l.rel,r.rel),
    };
    const order=a.sort??'';
    if(!Object.hasOwn(orders,order))throw Error('无效的等待队列排序');
    const fold=value=>Array.from(value,c=>d.textSearch.fold[c]??c.toLowerCase()).join('');
    const q=fold((a.q??'').trim().replaceAll('\\','/'));
    const matching=rows.filter(r=>!q||fold(r.rel).includes(q));
    const counts=Object.create(null);
    for(const row of matching)counts[row.reason]=(counts[row.reason]??0)+1;
    const filtered=matching.filter(r=>!a.reason||r.reason===a.reason).sort(orders[order]);
    return {...paginate(filtered,25),counts,reasons:[...new Set(rows.map(r=>r.reason))].sort(),pages:Math.max(1,Math.ceil(filtered.length/25))};
  }
  if(cmd==='scan_log'||cmd==='scan_log_export'){
    const runs=d.scanRuns[a.root]||[];
    const size=a.size===undefined?20:Number(a.size);
    const sort=a.sort??'recent';
    const recent=(l,r)=>r.id-l.id;
    const orders={
      recent,
      oldest:(l,r)=>l.id-r.id,
      slowest:(l,r)=>Number(!!r.ended)-Number(!!l.ended)||(l.ended&&r.ended?r.elapsed_ms-l.elapsed_ms:0)||recent(l,r),
      waiting:(l,r)=>r.waiting-l.waiting||recent(l,r),
    };
    if(![20,50,100].includes(size))throw Error('无效的每页扫描条数');
    if(!Object.hasOwn(orders,sort))throw Error('无效的扫描顺序');
    if(a.state&&!d.scanStates.includes(a.state))throw Error('无效的扫描状态');
    for(const key of ['start','end']){
      const value=a[key]??'';
      if(value==='')continue;
      const date=new Date(value+'T00:00:00Z');
      if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||value.startsWith('0000')||!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==value)
        throw Error('日期须为有效的 YYYY-MM-DD');
    }
    if(a.start&&a.end&&a.start>a.end)throw Error('开始日期须早于或等于结束日期');
    for(const key of ['waiting','skips','detail'])if(a[key]!==undefined&&typeof a[key]!=='boolean')throw Error('无效的开关');
    const reasons=r=>Object.keys(r.skip_reasons);
    const selected=runs.filter(r=>inRange(r.started)&&(!a.state||a.state===r.status)&&(!a.source||a.source===r.source)&&
      (!a.problem||a.problem===r.problem)&&(!a.skip_reason||Object.hasOwn(r.skip_reasons,a.skip_reason))&&
      (!a.waiting||r.waiting>0)&&(!a.skips||r.skipped>0)).sort(orders[sort]);
    if(cmd==='scan_log_export'){
      const columns=a.detail?{...d.scanColumns,...d.scanDetailColumns}:d.scanColumns;
      const fields=Object.keys(columns);
      const detail=r=>JSON.stringify(Object.fromEntries(reasons(r).sort().map(k=>[k,r.skip_reasons[k]])));
      return csvText([Object.values(columns),...selected.map(r=>fields.map(k=>k==='skip_reasons'?detail(r):r[k]))]);
    }
    const durations=selected.filter(r=>r.ended).map(r=>r.elapsed_ms).sort((l,r)=>l-r);
    const finished=durations.length;
    const rank=p=>durations[Math.ceil(finished*p/100)-1]??0;
    const mean=durations.reduce((n,x)=>n+x,0)/(finished||1);
    const lower=Math.floor(mean);
    const average=mean-lower===0.5&&lower%2===0?lower:Math.round(mean);
    const sum=(items,key)=>items.reduce((n,r)=>n+r[key],0);
    const tally=(key,rows)=>{
      const counts=Object.create(null);
      for(const r of rows)if(r[key])counts[r[key]]=(counts[r[key]]??0)+1;
      return counts;
    };
    const skipCounts=Object.create(null);
    for(const r of selected)for(const reason of reasons(r))skipCounts[reason]=(skipCounts[reason]??0)+r.skip_reasons[reason];
    const unique=entries=>[...new Set(entries)].sort();
    const totals=Object.fromEntries(['candidates','captured','read_bytes','reused','waiting','skipped'].map(k=>[k,sum(selected,k)]));
    return {...paginate(selected,size),pages:Math.max(1,Math.ceil(selected.length/size)),sources:unique(runs.map(r=>r.source)),
      average,longest:durations.at(-1)??0,facets:{problems:unique(runs.map(r=>r.problem).filter(Boolean)),skip_reasons:unique(runs.flatMap(reasons))},
      summary:{...totals,finished,p50:rank(50),p95:rank(95),states:tally('status',selected),skip_reasons:skipCounts,problems:tally('problem',selected)}};
  }
  if(cmd==='sheet_find'){
    const book=d.grids[a.old+'-'+a.new+'-'+(a.mode||'aligned')],entries=book.cells[a.sheet||book.first];
    const norm=x=>a.sensitive?x:x.toLowerCase(),q=norm(a.q.trim());
    if(!q)throw Error('请输入单元格内容');
    const items=entries.filter(r=>(!a.side||a.side===r.side)&&(!a.changed||r.changed)&&(!a.type||r.type===a.type)&&(!a.field||r.field===a.field)&&(a.exact?norm(r.value)===q:norm(r.value).includes(q)));
    const offset=a.offset||0;
    return {items:items.slice(offset,offset+20),offset,more:items.length>offset+20};
  }
  if(cmd==='storage')return d.storage;
  if(cmd==='star_file'){
    const f=d.files.find(x=>x.id===a.id);
    if(!f)throw Error('文件不存在');
    if(!!f.starred!==a.starred)auditExample(a.starred?'关注文件':'取消关注文件',f.rel);
    f.starred=a.starred;return '已更新关注';
  }
  if(cmd==='save_review'){
    const v=Object.values(d.history).flat().find(x=>x.id===a.id);
    if(!v)throw Error('版本不存在');
    const note=a.note.trim();
    if(a.state==='需跟进'&&!note)throw Error('请填写需要跟进的事项');
    if(v.review===a.state&&v.note===note)return '复核记录已保存';
    if(v.revision!==a.revision)throw Error('复核记录已更新，请刷新');
    Object.assign(v,{review:a.state,note,revision:v.revision+1,reviewed_at:d.summary.stamp});
    auditExample('更新版本复核','版本 #'+v.id+' · '+a.state+' · '+note);return '复核记录已保存';
  }
  if(cmd==='review_batch_preview'||cmd==='review_batch_apply'){
    const states=['','待复核','需跟进','已复核'];
    const {targets,state='',mode='keep'}=a;
    const reason=String(a.reason||'').trim();
    const note=mode==='keep'?'':String(a.note||'').trim();
    if(!Array.isArray(targets)||!targets.length||targets.length>100)throw Error('请选择 1 至 100 个版本');
    if(new Set(targets.map(t=>t.id)).size!==targets.length)throw Error('批次中有重复的版本');
    if(!states.includes(state)||!['keep','replace','append'].includes(mode))throw Error('无效的批量复核方式');
    if(!state&&mode==='keep')throw Error('请选择结论或备注变更');
    if(mode==='append'&&!note)throw Error('请输入追加的备注');
    const records=new Map(d.files.flatMap(f=>(d.history[f.id]||[]).map(v=>[v.id,[v,f]])));
    const counts={change:0,same:0,conflict:0,missing:0,invalid:0},items=[];
    for(const {id,revision:expected} of [...targets].sort((a,b)=>a.id-b.id)){
      const record=records.get(id);
      if(!record){
        items.push({id,expected,issue:'版本不存在',status:'missing'});counts.missing++;continue;
      }
      const [v,f]=record;
      const new_state=state||v.review;
      const new_note=mode==='keep'?v.note:mode==='replace'||!v.note?note:v.note+'\n'+note;
      let status='same',issue='';
      if(v.revision!==expected){status='conflict';issue='复核修订已更新';}
      else if(Array.from(new_note).length>2000){status='invalid';issue='合并后的备注超过 2000 字';}
      else if(new_state==='需跟进'&&!new_note.trim()){status='invalid';issue='需跟进版本须有备注';}
      else if(new_state!==v.review||new_note!==v.note)status='change';
      items.push({id,expected,file_id:f.id,rel:f.rel,root:f.root,num:v.num,stamp:v.stamp,review:v.review,note:v.note,
        revision:v.revision,new_state,new_note,status,issue});
      counts[status]++;
    }
    const token=counts.change&&!counts.conflict&&!counts.invalid&&!counts.missing?JSON.stringify([state,mode,note,reason,items]):'';
    const preview={items,counts,total:items.length,token};
    if(cmd==='review_batch_preview')return preview;
    if(!token||a.token!==token)return {applied:false,preview};
    d.reviewBatchCounter=(d.reviewBatchCounter||0)+1;
    const batch='example-'+d.reviewBatchCounter;
    for(const row of items.filter(r=>r.status==='change')){
      const [v,f]=records.get(row.id);
      Object.assign(v,{review:row.new_state,note:row.new_note,revision:v.revision+1,reviewed_at:d.summary.stamp});
      auditExample('更新版本复核','批次 '+batch+'\n'+f.rel+' · V'+row.num+' · '+row.review+' → '+row.new_state+
        '\n此前意见：'+(row.note||'（空）')+'\n本次意见：'+(row.new_note||'（空）'));
    }
    auditExample('批量更新版本复核','批次 '+batch+' · 已更新 '+counts.change+' 项 · 无变化 '+counts.same+' 项'+(reason?'\n批次说明：'+reason:''));
    return {applied:true,batch,changed:counts.change,unchanged:counts.same,stamp:d.summary.stamp};
  }
  if(cmd==='review_queue'||cmd==='export_review'){
    if(a.start&&a.end&&a.start>a.end)throw Error('结束日期不能早于开始日期');
    const query=(a.q||'').trim().toLowerCase(),ext=(a.ext||'').trim().replace(/^\./,'').toLowerCase();
    const items=d.files.flatMap(f=>d.history[f.id].filter(v=>(a.baseline||v.parent_id)&&(!a.latest||v.num===f.version)
      &&(!a.starred||f.starred)&&(!a.root||+a.root===f.root_id)&&(!ext||v.ext==='.'+ext||(!v.ext&&f.ext==='.'+ext))
      &&(!a.status||a.status===v.status)&&inRange(v.stamp)&&(!query||[f.rel,v.note,v.error].some(x=>(x||'').toLowerCase().includes(query))))
      .map(v=>({...v,rel:f.rel,root:f.root,ext:v.ext||f.ext,starred:f.starred})));
    const counts=Object.fromEntries(['待复核','需跟进','已复核'].map(state=>[state,items.filter(r=>r.review===state).length]));
    const selected=items.filter(v=>!a.state||a.state===v.review);
    const timestamp=v=>{
      const value=Date.parse(a.sort==='reviewed'?v.reviewed_at:v.stamp);
      return Number.isFinite(value)?value:-Infinity;
    };
    const newest=(x,y)=>timestamp(y)-timestamp(x)||y.id-x.id;
    selected.sort(a.sort==='changes'?(x,y)=>y.changes-x.changes||y.id-x.id:
      a.sort==='oldest'?(x,y)=>newest(y,x):newest);
    if(cmd==='export_review')return csvText([['文件','监控目录','版本号','保存时间','复核状态','复核备注','最近复核时间','解析状态','差异条数','SHA-256'],
      ...selected.map(v=>[v.rel,v.root,v.num,v.stamp,v.review,v.note,v.reviewed_at,v.status,v.changes,v.sha])]);
    const result=paginate(selected,a.size||25);
    return {...result,counts,pages:Math.max(1,Math.ceil(result.total/result.size))};
  }
  if(cmd==='summary'){
    const info=structuredClone(d.summary);
    const events=d.events.map(publicEvent).filter(Boolean);
    info.recent=events.slice(0,6);
    const days=new Map(info.trend.map(day=>[day.day,{...day,added:0,edited:0,other:0}]));
    info.breakdown={};info.today=0;
    for(const r of events){
      if(r.kind==='初始建档')continue;
      const day=days.get(r.stamp.slice(0,10));
      if(day)day[r.kind==='新增'?'added':r.kind==='内容修改'?'edited':'other']++;
      if(r.stamp.slice(0,10)===info.stamp.slice(0,10)){info.today++;info.breakdown[r.kind]=(info.breakdown[r.kind]||0)+1;}
    }
    info.trend=[...days.values()];
    info.trend=info.trend.slice(-(a.days||7)); return info;
  }
  if(cmd==='folders'){
    const counts=new Map();
    for(const file of d.files.filter(f=>f.root_id===a.id&&f.live&&f.tracked)){
      const dirs=file.rel.split('/').slice(0,-1);
      for(let n=1;n<=dirs.length;n++){
        const path=dirs.slice(0,n).join('/');
        counts.set(path,(counts.get(path)||0)+1);
      }
    }
    const paths=[...counts.keys()].sort();
    return a.counts?paths.map(path=>({path,total:counts.get(path)})):paths;
  }
  if(cmd==='scan'){
    const roots=d.summary.roots.filter(r=>r.active&&(a.id==null||a.id===r.id));
    if(!roots.length)throw Error('没有可扫描的启用目录');
    for(const root of roots){
      if(root.queued_source||root.progress)continue;
      root.queued_source='手动扫描（示例）';
      setTimeout(()=>{root.queued_source=null;root.progress='手动扫描（示例） · 正在枚举文件'},350);
      setTimeout(()=>{root.progress=''},1300);
    }
    return '已模拟安排 '+roots.length+' 个目录扫描';
  }
  if(cmd==='roots')return d.summary.roots;
  if(cmd==='history')return d.history[a.id]||[];
  if(cmd==='settings'){Object.assign(d.summary.settings,a);return '示例设置已更新'}
  if(cmd==='audit'||cmd==='export_audit'){
    const q=(a.q||'').trim().toLowerCase();
    const found=d.audit.filter(r=>(!q||[r.action,r.note].some(v=>v.toLowerCase().includes(q)))&&
      (!a.action||r.action===a.action)&&inRange(r.stamp));
    if(a.sort==='oldest')found.sort((l,r)=>l.stamp.localeCompare(r.stamp)||r.id-l.id);
    if(cmd==='export_audit')return csvText([['编号','时间','操作','内容'],...found.map(r=>[r.id,r.stamp,r.action,r.note])]);
    return {...paginate(found,a.size||25),actions:[...new Set(d.audit.map(r=>r.action))].sort()};
  }
  if(['events','files','export','export_files'].includes(cmd)){
    const files=cmd==='files'||cmd==='export_files';
    const q=(a.q||'').trim().toLowerCase().replaceAll('\\','/');
    const exts=(a.ext||'').trim().toLowerCase().split(/[,，;；\s]+/).filter(Boolean).map(e=>'.'+e.replace(/^\.+/,''));
    const scope=a.scope||(a.history?'all':'current');
    const states={current:['当前在册','目录已暂停'],deleted:['已删除'],excluded:['规则已排除'],removed:['目录已移除']};
    const publicEvents=d.events.map(publicEvent).filter(Boolean);
    const records=files&&q ? d.files.map(file=>{
      if(file.rel.toLowerCase().includes(q))return file;
      const former=publicEvents.find(e=>e.file_id===file.id&&['重命名','移动'].includes(e.kind)&&e.old_rel.toLowerCase().includes(q));
      return former?{...file,matched_path:former.old_rel}:file;
    }) : files?d.files:publicEvents;
    const found=records.filter(x=>{
      const paths=files?[x.rel,x.matched_path]:[x.rel,x.old_rel];
      return (files||((!a.event_id||x.id===Number(a.event_id))&&(!a.amended||x.revision>0)&&(!a.caption||(x.caption||'').toLowerCase().includes(a.caption.trim().toLowerCase()))))&&(!a.starred||x.starred)&&(!q||paths.some(path=>path&&path.toLowerCase().includes(q)))&&
        (!a.prefix||x.rel.startsWith(a.prefix+'/'))&&(!a.root||+a.root===x.root_id)&&
        (!a.kind||a.kind===x.kind)&&(!exts.length||exts.includes(x.ext))&&(!a.activity||x.kind!=='初始建档')&&
        (!a.status||a.status===x.status)&&(!a.source||a.source===x.source)&&
        (!a.sha||x.sha?.startsWith(a.sha.trim().toLowerCase()))&&
        (!a.with_diff||(x.old_v&&x.new_v&&x.old_v!==x.new_v&&x.status==='已解析'&&x.changes>0))&&
        (!files||((!a.multiple||x.version>1)&&(!String(a.min_bytes??'')||x.size>=Number(a.min_bytes))&&
          (!String(a.max_bytes??'')||x.size<=Number(a.max_bytes))&&inRange(x.updated)))&&
        (!a.day||(x.stamp||x.updated).startsWith(a.day))&&(files?(scope==='all'||states[scope]?.includes(x.file_state)):inRange(x.stamp));
    });
    const compareText=(l,r)=>l<r?-1:l>r?1:0;
    if(a.sort)found.sort((l,r)=>({size:r.size-l.size,versions:r.version-l.version,
      name:compareText(l.rel.toLowerCase(),r.rel.toLowerCase()),oldest:compareText(l.updated||l.stamp,r.updated||r.stamp)})[a.sort]||r.id-l.id);
    if(cmd==='export_files')return csvText([['编号','目录','文件','大小字节','版本','更新时间','SHA-256','在册状态','解析状态'],
      ...found.map(r=>[r.id,r.root,r.rel,r.size,r.version,r.updated,r.sha,r.file_state,r.status])]);
    if(cmd==='export'){
      const columns=['id','stamp','root','rel','old_rel','kind','prior','version','sha','source','status','caption'];
      return csvText([['编号','时间','目录','文件','原路径','类型','旧版本','新版本','摘要','来源','解析状态','公开更正'],
        ...found.map(row=>columns.map(field=>row[field]))]);
    }
    return {...paginate(found,a.size||25),sources:[...new Set(publicEvents.map(r=>r.source).filter(Boolean))].sort()};
  }
  if(cmd==='sheet_rows'){
    const book=d.grids[a.old+'-'+a.new+'-'+(a.mode||'aligned')];
    if(!book)throw Error('该版本组合没有整行视图');
    const sheet=a.sheet||book.first;
    const get=(expand,r,c)=>book.pages[JSON.stringify([sheet,expand,r,c])];
    if(a.row_filter&&!a.target){
      const first=get(true,1,a.col_page||1),groups=new Map();
      for(let p=1;p<=first.pages;p++)for(const line of get(true,p,a.col_page||1).rows){
        if(!line.filters.includes(a.row_filter))continue;
        if(!groups.has(line.index))groups.set(line.index,[]);
        groups.get(line.index).push(line);
      }
      const matches=groups.size,pages=Math.max(1,Math.ceil(matches/30)),page=Math.max(1,Math.min(a.page||1,pages));
      return {...first,expanded:false,row_filter:a.row_filter,matches,pages,page,rows:[...groups.values()].slice((page-1)*30,page*30).flat()};
    }
    if(!a.target)return get(!!a.expand,a.page||1,a.col_page||1);
    const first=get(true,1,1),key=a.target.trim();
    const address=/^([A-Z]{1,3})?([1-9]\d{0,6})$/i.exec(key);
    if(a.locate!=='key'&&!address)throw Error('请输入行号或单元格地址，例如 C24');
    const hits=new Map();
    for(let r=1;r<=first.pages;r++){
      for(const line of get(true,r,1).rows){
        if(a.locate==='key'?line.record===key:line[a.locate==='old'?'paired_old':'paired_new']===Number(address[2]))
          hits.set(line.index,r);
      }
    }
    if(hits.size!==1)throw Error('未找到唯一匹配位置');
    const [index,r]=[...hits][0];
    let c=a.col_page||1;
    if(a.locate!=='key'&&address[1]){
      c=0;
      for(let i=1;i<=first.col_pages;i++)if(get(true,r,i).columns.some(col=>col[a.locate]===address[1].toUpperCase()))c=i;
      if(!c)throw Error('该列没有已记录的内容');
    }
    const result=structuredClone(get(true,r,c));
    result.rows.forEach(line=>line.target=line.index===index);return result;
  }
  if(cmd==='compare'||cmd==='export_diff'){
    const key=a.old+'-'+a.new;const raw=(a.mode==='coordinate' && d.coordinates[key]) || d.pairs[key];if(!raw)throw Error('此版本组合不存在');
    const normalize=v=>a.case_sensitive?String(v):String(v).toLowerCase();
    const query=normalize((a.q||'').trim());
    const cols=a.search_in?[a.search_in]:['sheet','location','record_key','field','old','new'];
    const scoped=raw.items.filter(r=>(!a.sheet||r.sheet===a.sheet)&&(!a.category||a.category===r.category)&&(!a.field||a.field===r.field)&&(!a.record||a.record.trim()===r.record_key)&&(!query||
      cols.some(k=>r[k]!=null&&(a.exact?normalize(r[k])===query:normalize(r[k]).includes(query)))));
    const counts=Object.fromEntries(['新增','修改','删除'].map(k=>[k,scoped.filter(r=>r.kind===k).length]));
    const selected=scoped.filter(r=>!a.kind||r.kind===a.kind);
    if(cmd==='export_diff'){
      if(!selected.length)throw Error('当前筛选没有可导出的差异');
      const file=d.files.find(f=>d.history[f.id].some(v=>v.id===a.new));
      const rows=[['文件','旧版本','新版本','分组','位置','记录编号','变化','旧值','新值']];
      if(raw.is_excel||raw.is_tabular)rows[0].push('字段','差异类别','旧类型','新类型');
      for(const item of selected){
        const row=[file.rel,'V'+raw.old_number,'V'+raw.new_number,item.sheet,item.location,item.record_key,item.kind,item.old,item.new];
        if(raw.is_excel||raw.is_tabular)row.push(item.field,item.category,item.old_type,item.new_type);
        rows.push(row);
      }
      return csvText(rows);
    }
    return {...raw,counts,...paginate(selected,a.size||40)};
  }
  throw Error('此操作需在桌面应用中执行');
};

