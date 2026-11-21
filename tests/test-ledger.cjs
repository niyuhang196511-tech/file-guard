'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
global.window={};require('../web/ledger.js');
const L=window.FileGuardLedger;
const str=s=>['文本',s];
const num=s=>['数值',String(s)];
function src(rows){
  const values=rows.map(row=>row.map(c=>typeof c==='string'?str(c):c));
  return {rows:values,width:Math.max(...values.map(r=>r.length))};
}
function options(a,b,extra={}){
  return {ha:1,hb:1,typed:true,tolerance:'0',...L.autoMap(L.headers(a,1),L.headers(b,1)),...extra};
}
function delta(x,y,opts={}){
  const a=src([['id','x'],['A',x]]),b=src([['id','x'],['A',y]]);
  return L.reconcile(a,b,options(a,b,opts)).records[0];
}
test('both sides of a composite key and reorder without insertion offsets',()=>{
  const a=src([['id','批号','数量'],['A','x','9'],['A','y','10'],['Z','z','3']]);
  const b=src([['批号','数量','id'],['new','0','X'],['y','11','A'],['x','9','A'],['z','3','Z']]);
  const cfg=options(a,b,{keys:[{l:0,r:2},{l:1,r:0}]});
  const out=L.reconcile(a,b,cfg);
  assert.deepEqual(out.counts,{'仅右侧':1,'改值并调序':1,'仅调序':1,'一致':1});
  assert.equal(out.records[1].changes[0].oldAddress,'C3');assert.equal(out.records[1].changes[0].newAddress,'B3');
});
test('duplicate one side quarantines both; incomplete composite and blank lines',()=>{
  const a=src([['id','batch'],['A','1'],['A','1'],['B',''],[],[null,'x']]);
  const b=src([['id','batch'],['A','1'],['B','2']]);
  const out=L.reconcile(a,b,options(a,b,{keys:[{l:0,r:0},{l:1,r:1}]}));
  assert.equal(out.emptyLeft,1);assert.equal(out.issues.length,5);
  assert.equal(out.issues.filter(i=>i.why==='编号重复').length,2);
  assert(out.issues.some(i=>i.why==='对侧编号重复'));assert.equal(out.records.length,1);
});
test('blank identities never merge and key boundaries are unambiguous',()=>{
  const a=src([['id','key','v'],['a|b','c','a'],['a','b|c','b'],[' ',' ','needs id']]);
  const out=L.reconcile(a,a,options(a,a,{keys:[{l:0,r:0},{l:1,r:1}]}));
  assert.equal(out.records.length,2);assert(out.issues.every(x=>x.why==='编号为空'));
});
test('text keys retain zeroes and trims are opt in',()=>{
  const a=src([['id'],['001'],[' x']]),b=src([['id'],['1'],['x']]);
  assert.equal(L.reconcile(a,b,options(a,b)).records.length,4);
  assert.equal(L.reconcile(a,b,options(a,b,{keyTrim:true})).records.length,3);
});
test('known header suggestion only for unique columns, independent header row and sheet',()=>{
  const a=src([['标题'],['ID','字段','字段','   '],['A','1','2','z']]);
  const cols=L.headers(a,2);assert.equal(cols[0].label,'A · ID');
  const m=L.autoMap(cols,cols);assert.deepEqual(m.keys,[{l:0,r:0}]);assert(!m.pairs.some(p=>p.l===1&&p.r!==-1));
  assert(!m.pairs.some(p=>p.l===3&&p.r!==-1));
  assert.throws(()=>L.headers(a,9));assert.equal(L.letter(26),'AA');
});
test('manual field remapping tolerates renamed columns',()=>{
  const a=src([['id','旧数量','移除'],['A','1','x']]),b=src([['code','数量','增加'],['A','2','y']]);
  const cfg=options(a,b,{keys:[{l:0,r:0}],pairs:[{l:1,r:1,use:true},{l:2,r:-1,use:true},{l:-1,r:2,use:true}]});
  const c=L.reconcile(a,b,cfg).records[0].changes;assert.equal(c.length,3);
  assert.equal(c[0].left,'B · 旧数量');assert.equal(c[2].oldAddress,'');
  cfg.pairs[1].use=false;assert.equal(L.reconcile(a,b,cfg).records[0].changes.length,2);
});
test('ambiguous mappings rejected rather than partially applied',()=>{
  const a=src([['id','v'],['x','a']]);
  for(const keys of [[],[{l:-1,r:0}],[{l:2,r:0}],[{l:0,r:0},{l:0,r:1}]]){
    assert.throws(()=>L.reconcile(a,a,options(a,a,{keys})));
  }
  assert.throws(()=>L.reconcile(a,a,options(a,a,{pairs:[{l:0,r:0,use:true},{l:1,r:0,use:true}]})));
});
test('strict types and comparison normalization preserve originals',()=>{
  assert.equal(delta(str('Ａb '),str('ab')).status,'字段变化');
  assert.equal(delta(str('Ａb '),str('ab'),{trim:true,width:true,fold:true}).status,'一致');
  assert.equal(delta(str('1'),num(1)).status,'字段变化');assert.equal(delta(str('1'),num(1),{typed:false}).status,'一致');
  assert.equal(delta(['公式','=1'],str('=1'),{typed:false,numeric:true}).status,'字段变化');
  assert.equal(delta(null,str('')).status,'字段变化');assert.equal(delta(null,str(''),{empty:true}).status,'一致');
});
test('absolute tolerance precise beyond IEEE-754 including scientific notation',()=>{
  const a=str('9007199254740993000.100'),b=str('9007199254740993000.105');
  assert.equal(delta(a,b,{numeric:true,tolerance:'0.005'}).status,'一致');
  assert.equal(delta(a,b,{numeric:true,tolerance:'0.0049999999999999999'}).status,'字段变化');
  assert.equal(delta(str('1e-100'),str('0'),{numeric:true,tolerance:'1e-100'}).status,'一致');
  assert.throws(()=>delta(a,b,{numeric:true,tolerance:'-1'}));
  assert.throws(()=>delta(a,b,{numeric:true,tolerance:'Infinity'}));
});
test('single side rows and stable filter ordering across pages',()=>{
  const a=src([['id','v'],...Array.from({length:35},(_,i)=>['A'+i,'old']),['removed','x']]);
  const b=src([['id','v'],...Array.from({length:35},(_,i)=>['A'+i,'new'])]);
  const out=L.reconcile(a,b,options(a,b));assert.equal(out.counts['仅左侧'],1);
  const selected=L.selectRows(out,{q:'a',field:'V',status:'字段变化',sort:'old'});assert.equal(selected.length,35);
  const page=L.paginate(selected,9);assert.equal(page.items.length,10);assert.equal(page.page,2);
  assert.equal(L.paginate([],7).pages,1);
});
test('profile counts exclude blank records and separate types and missing values',()=>{
  const a=src([['id','v'],['1',num(1)],['2',str('1')],['3',str('1')],['4',null],[],['5',str(' 0 ')],['6',['公式','=SUM(1)']],['7',['错误','#N/A']]]);
  const p=L.profile(a,1)[1];
  assert.deepEqual([p.rows,p.filled,p.missing,p.unique,p.repeated,p.duplicates,p.spaces,p.numeric],[7,6,1,5,1,1,1,3]);
  assert.deepEqual(p.freq[0],{type:'文本',value:'1',count:2,first:3,last:4});assert.equal(p.types['公式'],1);assert.equal(p.types['错误'],1);
});
test('exact minima, zeros and Unicode code point length',()=>{
  const a=src([['id','值'],['a','-1e70'],['b','099999999999999999999'],['c','-0'],['d','🙂']]);
  const p=L.profile(a,1)[1];assert.equal(p.zeros,1);assert.equal(p.min,'-1e70');assert.equal(p.max,'099999999999999999999');
  assert.equal(L.profile(src([['x'],['🙂']]),1)[0].longest,1);
});
test('template header relocation rejects changed and ambiguous layout',()=>{
  const s=src([['说明',''],['编号','数量'],['A','1']]);assert.equal(L.locateHeader(s,['编号','数量'],1),2);
  assert.throws(()=>L.locateHeader(s,['数量','编号'],1));
  const twice=src([['x'],['id'],['id']]);assert.throws(()=>L.locateHeader(twice,['id'],1));assert.equal(L.locateHeader(twice,['id'],3),3);
});
test('CSV quotes, sign and linebreak handling',()=>{
  assert.equal(L.csv([['a','b'],['=cmd','含"引号,'],[-2,'两\n行']]),'\ufeff"a","b"\r\n"\'=cmd","含""引号,"\r\n"-2","两\n行"\r\n');
});
test('ignored original changes remain inspectable with original type and address',()=>{
  const a=src([['id','n'],['A',num(12)],['B',num(15)]]);
  const b=src([['id','n'],['A',str('12.001')],['B',str('44')]]);
  const out=L.reconcile(a,b,options(a,b,{typed:false,numeric:true,tolerance:'.001'}));
  const rows=L.selectRows(out,{onlySuppressed:true,differences:true});
  assert.equal(rows.length,1);assert.equal(rows[0].status,'一致');assert.equal(rows[0].changes.length,0);
  assert.deepEqual(rows[0].suppressed[0].before,num(12));assert.equal(rows[0].suppressed[0].newAddress,'B2');
});
test('field impact counts and drill-down by exact pair, row and type',()=>{
  const a=src([['id','n'],['A',num(1)],['B',num(3)]]),b=src([['id','n'],['A',str('2')],['C',num(4)]]);
  const report=L.reconcile(a,b,options(a,b));const stat=L.fieldTotals(report)[0];
  assert.deepEqual(stat,{left:'B · n',right:'B · n',count:3,added:1,removed:1,changed:1,retyped:1});
  assert.equal(L.selectRows(report,{fieldMatch:stat,leftRow:2,rightRow:2,cellType:'数值'}).length,1);
  assert.equal(L.selectRows(report,{fieldMatch:stat,rightRow:2,cellType:'公式'}).length,0);
});
