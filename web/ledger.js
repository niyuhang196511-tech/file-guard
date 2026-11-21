// Shared by the desktop, the local development server and the offline example.
window.FileGuardLedger = (() => {
  'use strict';
  const keyNames=new Set(['编号','编码','物料编码','物料编号','产品编号','订单编号','序列号','批号','id','sku']);
  const text=c=>c?.[1]??'';
  const blank=c=>c==null||text(c)==='';
  function letter(n){
    let code='';
    for(let i=n+1;i>0;i=Math.floor((i-1)/26))code=String.fromCharCode(65+(i-1)%26)+code;
    return code;
  }
  function headers(src,n){
    if(!Number.isInteger(+n)||+n<1||+n>src.rows.length)throw Error('表头行超出工作表范围');
    const line=src.rows[n-1];
    return Array.from({length:src.width},(_,i)=>{
      const name=text(line[i]);
      return {index:i,name,label:letter(i)+' · '+(name||'无表头')};
    });
  }
  function autoMap(left,right){
    const unique=(cols,name)=>name.trim()&&cols.filter(c=>c.name===name).length===1;
    const pairs=left.map(c=>{
      const match=unique(left,c.name)&&unique(right,c.name)?right.find(r=>r.name===c.name):null;
      return {l:c.index,r:match?.index??-1,use:true};
    });
    for(const c of right)if(!pairs.some(p=>p.r===c.index))pairs.push({l:-1,r:c.index,use:true});
    const key=pairs.find(p=>p.l>=0&&p.r>=0&&keyNames.has(left[p.l].name.trim().toLowerCase()));
    return {pairs,keys:[{l:key?.l??-1,r:key?.r??-1}]};
  }
  function normalize(s,opt){
    if(opt.width)s=s.normalize('NFKC');
    if(opt.trim)s=s.trim();
    return opt.fold?s.toLowerCase():s;
  }
  function decimal(s){
    if(s.length>128)return null;
    const m=/^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d{1,3}))?$/.exec(s);
    if(!m||!(m[2]||m[3])||Math.abs(+(m[4]||0))>200)return null;
    return {n:BigInt((m[1]==='-'?'-':'')+(m[2]+(m[3]||''))),e:+(m[4]||0)-(m[3]?.length||0)};
  }
  function units(v,e){return v.n*10n**BigInt(v.e-e);}
  function compareNumber(a,b,t){
    const e=Math.min(a.e,b.e,t?.e??0);
    const diff=units(a,e)-units(b,e);
    if(t&&(diff<0n?-diff:diff)<=units(t,e))return 0;
    return diff===0n?0:diff<0n?-1:1;
  }
  function equal(a,b,opt,tolerance){
    if(opt.empty&&blank(a)&&blank(b))return true;
    if(a==null||b==null)return a==null&&b==null;
    const types=[a[0],b[0]],numbers=types.every(t=>t==='文本'||t==='数值');
    if(types[0]!==types[1]&&(opt.typed||!numbers))return false;
    const x=types[0]==='文本'?normalize(a[1],opt):a[1],y=types[1]==='文本'?normalize(b[1],opt):b[1];
    if(opt.numeric&&numbers){
      const l=decimal(x),r=decimal(y);
      if(l&&r)return compareNumber(l,r,tolerance)===0;
    }
    return x===y;
  }
  const populated=row=>row.some(c=>!blank(c));
  function indexRows(src,header,keys,side,opt){
    const groups=new Map(),issues=[];let empties=0;
    src.rows.slice(header).forEach((row,i)=>{
      if(!populated(row)){empties++;return;}
      const vals=keys.map(k=>text(row[k[side]]));
      const canonical=vals.map(s=>opt.keyTrim?s.trim():s);
      const label=JSON.stringify(vals),entry={row,n:i+header+1,label};
      if(canonical.some(k=>!k.trim())){
        issues.push({side,n:entry.n,key:label,why:canonical.every(k=>!k.trim())?'编号为空':'组合编号不完整'});return;
      }
      const id=JSON.stringify(canonical);
      if(!groups.has(id))groups.set(id,[]);
      groups.get(id).push(entry);
    });
    return {groups,issues,empties};
  }
  function validatePairs(pairs,left,right,keys=false){
    const l=new Set(),r=new Set();
    for(const p of pairs){
      if(!Number.isInteger(p.l)||!Number.isInteger(p.r)||p.l < -1||p.r < -1||p.l>=left.length||p.r>=right.length||
         (keys?(p.l<0||p.r<0):(p.l<0&&p.r<0)))throw Error(keys?'请为每个编号选择两侧列':'字段映射无效');
      if(p.l>=0&&l.has(p.l)||p.r>=0&&r.has(p.r))throw Error('同一列在同一组映射中只能使用一次');
      if(p.l>=0)l.add(p.l);if(p.r>=0)r.add(p.r);
    }
  }
  function reconcile(a,b,cfg){
    const left=headers(a,cfg.ha),right=headers(b,cfg.hb);
    if(!cfg.keys.length||cfg.keys.length>3)throw Error('请选择一至三个编号字段');
    validatePairs(cfg.keys,left,right,true);
    const pairs=cfg.pairs.filter(p=>p.use);
    validatePairs(pairs,left,right);
    const tolerance=decimal(String(cfg.tolerance||'0'));
    if(cfg.numeric&&(!tolerance||tolerance.n<0n))throw Error('数值容差须为有限非负十进制数');
    const leftIndex=indexRows(a,+cfg.ha,cfg.keys,'l',cfg),rightIndex=indexRows(b,+cfg.hb,cfg.keys,'r',cfg);
    const old=leftIndex.groups,newer=rightIndex.groups,issues=[...leftIndex.issues,...rightIndex.issues];
    const all=new Set([...newer.keys(),...old.keys()]),valid=new Set();
    for(const id of all){
      const l=old.get(id)||[],r=newer.get(id)||[];
      if(l.length<=1&&r.length<=1){valid.add(id);continue;}
      for(const [side,list] of [['l',l],['r',r]])for(const e of list)
        issues.push({side,n:e.n,key:e.label,why:list.length>1?'编号重复':'对侧编号重复'});
    }
    if(valid.size*Math.max(1,pairs.length)>450000)throw Error('本次对账超过 45 万个字段位置，请减少参与核对的字段');
    const oldCommon=[...old.keys()].filter(k=>valid.has(k)&&newer.has(k));
    const newCommon=[...newer.keys()].filter(k=>valid.has(k)&&old.has(k));
    const ranks=new Map(oldCommon.map((id,i)=>[id,i]));
    const moved=new Set(newCommon.filter((id,i)=>ranks.get(id)!==i));
    const records=[],counts={};
    for(const id of valid){
      const l=old.get(id)?.[0],r=newer.get(id)?.[0],changes=[],suppressed=[];
      for(const p of pairs){
        const before=l?.row[p.l]??null,after=r?.row[p.r]??null;
        const same=!!(l&&r&&equal(before,after,cfg,tolerance));
        if(same&&before?.[0]===after?.[0]&&before?.[1]===after?.[1])continue;
        if((!l||!r)&&blank(before)&&blank(after))continue;
        const first=left[p.l],second=right[p.r];
        (same?suppressed:changes).push({left:first?.label||'',right:second?.label||'',before,after,
          oldAddress:l&&first?letter(p.l)+l.n:'',newAddress:r&&second?letter(p.r)+r.n:''});
      }
      const status=!l?'仅右侧':!r?'仅左侧':changes.length?(moved.has(id)?'改值并调序':'字段变化'):moved.has(id)?'仅调序':'一致';
      counts[status]=(counts[status]||0)+1;
      records.push({key:(r||l).label,leftKey:l?.label??'',rightKey:r?.label??'',old:l?.n??null,new:r?.n??null,status,changes,suppressed});
    }
    return {records,issues,counts,emptyLeft:leftIndex.empties,emptyRight:rightIndex.empties};
  }
  function profile(src,header){
    const cols=headers(src,header);
    const data=src.rows.slice(+header).map((r,i)=>({r,n:+header+i+1})).filter(x=>populated(x.r));
    if(cols.length*data.length>450000)throw Error('字段体检超过 45 万个位置，请使用较小的工作表');
    return cols.map(col=>{
      const values=new Map(),types={};
      let missing=0,spaces=0,zeros=0,longest=0,longRow=null,min=null,max=null,numericCount=0;
      for(const {r,n} of data){
        const c=r[col.index];
        if(blank(c)){missing++;continue;}
        const [type,value]=c;
        types[type]=(types[type]||0)+1;
        const key=JSON.stringify(c);
        const hit=values.get(key);
        if(hit){hit.count++;hit.last=n;}
        else values.set(key,{type,value,count:1,first:n,last:n});
        if(type==='文本'&&value!==value.trim())spaces++;
        const length=Array.from(value).length;
        if(length>longest){longest=length;longRow=n;}
        if(type==='文本'||type==='数值'){
          const d=decimal(value);
          if(d){numericCount++;if(d.n===0n)zeros++;
            if(!min||compareNumber(d,min.d)<0)min={d,value};
            if(!max||compareNumber(d,max.d)>0)max={d,value};
          }
        }
      }
      const freq=[...values.values()].sort((x,y)=>y.count-x.count||x.first-y.first);
      return {field:col.label,index:col.index,rows:data.length,filled:data.length-missing,missing,unique:freq.length,
        repeated:freq.filter(v=>v.count>1).length,duplicates:data.length-missing-freq.length,
        spaces,numeric:numericCount,zeros,min:min?.value??'',max:max?.value??'',longest,longRow,types,freq};
    });
  }
  function selectRows(report,opt){
    const q=(opt.q||'').trim().toLowerCase(),field=(opt.field||'').trim().toLowerCase();
    const rows=report.records.filter(r=>(!opt.status||r.status===opt.status)&&(!opt.differences||r.status!=='一致'||opt.onlySuppressed)&&
      (!opt.onlySuppressed||r.suppressed.length)&&(!opt.leftRow||r.old===Number(opt.leftRow))&&(!opt.rightRow||r.new===Number(opt.rightRow))&&
      (!opt.cellType||r.changes.some(c=>c.before?.[0]===opt.cellType||c.after?.[0]===opt.cellType))&&
      (!opt.fieldMatch||r.changes.some(c=>c.left===opt.fieldMatch.left&&c.right===opt.fieldMatch.right))&&
      (!q||r.key.toLowerCase().includes(q)||r.leftKey.toLowerCase().includes(q))&&(!field||r.changes.some(c=>(c.left+' '+c.right).toLowerCase().includes(field))));
    if(opt.sort==='count')rows.sort((a,b)=>b.changes.length-a.changes.length);
    if(opt.sort==='old')rows.sort((a,b)=>(a.old??Infinity)-(b.old??Infinity));
    if(opt.sort==='key')rows.sort((a,b)=>a.key.localeCompare(b.key,'zh-CN'));
    return rows;
  }
  function fieldTotals(report){
    const totals=new Map();
    for(const r of report.records)for(const c of r.changes){
      const key=JSON.stringify([c.left,c.right]);
      if(!totals.has(key))totals.set(key,{left:c.left,right:c.right,count:0,added:0,removed:0,changed:0,retyped:0});
      const stat=totals.get(key);stat.count++;
      if(c.before==null)stat.added++;
      else if(c.after==null)stat.removed++;
      else{stat.changed++;if(c.before[0]!==c.after[0])stat.retyped++;}
    }
    return [...totals.values()].sort((a,b)=>b.count-a.count);
  }
  function paginate(rows,page){
    const pages=Math.max(1,Math.ceil(rows.length/25)),p=Math.max(1,Math.min(page||1,pages));
    return {items:rows.slice((p-1)*25,p*25),page:p,pages,total:rows.length};
  }
  function templateConfig(d){
    const config={left:d.colsA.map(c=>c.name),right:d.colsB.map(c=>c.name),keys:d.keys.map(p=>({l:p.l,r:p.r})),pairs:d.pairs.map(p=>({l:p.l,r:p.r,use:p.use}))};
    for(const k of ['keyTrim','trim','fold','width','typed','numeric','tolerance','empty'])config[k]=d[k];
    return config;
  }
  function locateHeader(src,names,current){
    if(src.width!==names.length)throw Error('当前表格的列数与模板不同');
    const same=n=>n>=1&&n<=src.rows.length&&names.every((v,i)=>text(src.rows[n-1][i])===v);
    if(same(+current))return +current;
    const matches=[];
    for(let n=1;n<=Math.min(src.rows.length,50);n++)if(same(n))matches.push(n);
    if(matches.length!==1)throw Error(matches.length?'找到多个匹配表头，请先指定表头行':'前 50 行未找到完全匹配的表头');
    return matches[0];
  }
  function csv(rows){
    const escape=v=>{
      let s=String(v??'');
      if(typeof v==='string'&&(/^[\t\n\r]/.test(s)||/^\s*[=+@-]/.test(s)))s="'"+s;
      return '"'+s.replaceAll('"','""')+'"';
    };
    return '\ufeff'+rows.map(r=>r.map(escape).join(',')).join('\r\n')+'\r\n';
  }
  return {headers,autoMap,fieldTotals,templateConfig,locateHeader,reconcile,profile,selectRows,paginate,csv,text,letter};
})();
