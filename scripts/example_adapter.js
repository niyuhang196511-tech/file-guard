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
  if(cmd==='period_report'||cmd==='period_csv'){
    const iso=x=>new Date(x).toISOString().slice(0,10);
    const end=a.end||d.summary.stamp.slice(0,10),last=Date.parse(end+'T00:00:00Z');
    const start=a.start||iso(last-6*86400000),first=Date.parse(start+'T00:00:00Z'),span=last-first+86400000;
    if(!Number.isFinite(span)||span<86400000||span>366*86400000)throw Error('请选择 1 至 366 天');
    const previous=iso(first-span),previous_end=iso(first-86400000);
    const totals=[0,0],files=[new Set(),new Set()],groups=new Map();
    const exts=String(a.ext||'').toLowerCase().split(/[,，;；\s]+/).filter(Boolean).map(v=>'.'+v.replace(/^\.+/,''));
    const q=String(a.q||'').toLowerCase().replaceAll('\\','/'),mode=a.group||'file';
    for(const e of d.events.map(publicEvent).filter(x=>x?.file_id).sort((x,y)=>x.stamp.localeCompare(y.stamp)||x.id-y.id)){
      const day=e.stamp.slice(0,10);if(day<previous||day>end||(!a.initial&&e.kind==='初始建档'))continue;
      if(a.root_id&&+a.root_id!==e.root_id||a.kind&&a.kind!==e.kind||a.source&&a.source!==e.source||exts.length&&!exts.includes(e.ext))continue;
      if(q&&![e.rel,e.old_rel].some(x=>String(x||'').toLowerCase().includes(q)))continue;
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
        const key=JSON.stringify([item.sheet,record,field,category,record&&field?'':loc]),set=memory.get(key)||new Set();
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
  if(cmd==='rule_history')return d.rules[a.root]||[];
  if(cmd==='checkpoint_diff'||cmd==='checkpoint_export'){
    const rows=d.cpDiff[a.old+'-'+a.new];
    if(!rows)throw Error('请选择同一目录的两份不同清单');
    const q=(a.q||'').trim().replaceAll('\\','/').toLowerCase();
    const found=rows.filter(r=>[r.old_path,r.new_path].some(p=>p&&p.toLowerCase().includes(q)));
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
    if(a.sort==='oldest')selected.sort((x,y)=>x.stamp.localeCompare(y.stamp)||x.eid-y.eid||x.ordinal-y.ordinal);
    if(a.sort==='path')selected.sort((x,y)=>x.rel.localeCompare(y.rel)||y.stamp.localeCompare(x.stamp)||y.eid-x.eid||x.ordinal-y.ordinal);
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
    const rows=d.waits[a.root]||[],filtered=rows.filter(r=>(!a.reason||r.reason===a.reason)&&(!a.q||r.rel.toLowerCase().includes(a.q.trim().replaceAll('\\','/').toLowerCase())));
    if(a.sort==='attempts')filtered.sort((l,r)=>r.attempts-l.attempts);
    if(a.sort==='path')filtered.sort((l,r)=>l.rel.localeCompare(r.rel));
    return {...paginate(filtered,25),reasons:[...new Set(rows.map(r=>r.reason))],pages:Math.max(1,Math.ceil(filtered.length/25))};
  }
  if(cmd==='scan_log'||cmd==='scan_log_export'){
    const runs=d.scanRuns[a.root]||[],selected=runs.filter(r=>(!a.state||r.status===a.state)&&(!a.skips||r.skipped)&&(!a.source||r.source===a.source));
    if(cmd==='scan_log_export')return csvText([Object.values(d.scanColumns),...selected.map(r=>Object.keys(d.scanColumns).map(k=>r[k]))]);
    const finished=selected.filter(r=>r.ended);
    return {...paginate(selected,20),pages:Math.max(1,Math.ceil(selected.length/20)),sources:[...new Set(runs.map(r=>r.source))],average:Math.round(finished.reduce((n,r)=>n+r.elapsed_ms,0)/(finished.length||1)),longest:Math.max(0,...finished.map(r=>r.elapsed_ms))};
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
  if(cmd==='review_queue'||cmd==='export_review'){
    if(a.start&&a.end&&a.start>a.end)throw Error('结束日期不能早于开始日期');
    const query=(a.q||'').trim().toLowerCase(),ext=(a.ext||'').trim().replace(/^\./,'').toLowerCase();
    const items=d.files.flatMap(f=>d.history[f.id].filter(v=>(a.baseline||v.parent_id)&&(!a.latest||v.num===f.version)
      &&(!a.starred||f.starred)&&(!a.root||+a.root===f.root_id)&&(!ext||v.ext==='.'+ext||(!v.ext&&f.ext==='.'+ext))
      &&(!a.status||a.status===v.status)&&inRange(v.stamp)&&(!query||[f.rel,v.note,v.error].some(x=>(x||'').toLowerCase().includes(query))))
      .map(v=>({...v,rel:f.rel,root:f.root,ext:v.ext||f.ext,starred:f.starred})));
    const counts=Object.fromEntries(['待复核','需跟进','已复核'].map(state=>[state,items.filter(r=>r.review===state).length]));
    const selected=items.filter(v=>!a.state||a.state===v.review);
    selected.sort((x,y)=>a.sort==='changes'?y.changes-x.changes||y.id-x.id:a.sort==='reviewed'?y.reviewed_at.localeCompare(x.reviewed_at)||y.id-x.id:
      a.sort==='oldest'?x.stamp.localeCompare(y.stamp)||x.id-y.id:y.stamp.localeCompare(x.stamp)||y.id-x.id);
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

