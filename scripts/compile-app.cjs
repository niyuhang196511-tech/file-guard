const fs = require('node:fs');
const path = require('node:path');
const {stripTypeScriptTypes} = require('node:module');
const root = path.resolve(__dirname,'..');
const source = fs.readFileSync(path.join(root,'frontend/app.ts'),'utf8');
const javascript = stripTypeScriptTypes(source,{mode:'strip'});
fs.writeFileSync(path.join(root,'web/app.js'),'// 从 frontend/app.ts 生成。\n'+javascript);
