// 从可读中文模板生成网页与 WebView 共用的渲染函数。
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../web');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const start='<div id="app" v-cloak>';
const template=html.slice(html.indexOf(start)+start.length,html.indexOf('</div><script src="vue.js">'));
let code='';
const decode=s=>s.replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&');
const context={console,document:{createElement(){return {set innerHTML(value){this.textContent=decode(value);this.children=[{getAttribute:()=>decode(value.slice(value.indexOf('="')+2,value.lastIndexOf('"')))}]}}}}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'vue.js'),'utf8'),context);
context.Function=function(body){code=body;return ()=>function(){}};
context.Vue.compile(template,{onError(error){throw error}});
if(!code.includes('function render('))throw Error('模板编译未生成渲染函数');
fs.writeFileSync(path.join(root,'view.js'),'// 由 scripts/compile-view.cjs 从中文模板生成。\nwindow.FG_VIEW=(function(){'+code+'\n})();\nwindow.FG_VIEW._rc=true;\n');

