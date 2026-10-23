const assert=require('node:assert/strict'),vm=require('node:vm'),path=require('node:path');
const {buildSync}=require('esbuild');
const {taskURL,validateSnapshot}=require('../scripting/scripts/Codex/model.ts');
const seed=require('../scripting/scripts/Codex/seed.json');
const id='01a16427-5b79-74c3-b764-d0209a89a000';
assert.equal(taskURL({id,origin:'Cloud'}),`https://chatgpt.com/local/${id}`);
assert.equal(taskURL({id,origin:'ChatGPT'}),`https://chatgpt.com/c/${id}`);
assert.equal(taskURL({id:'unknown',origin:'Other',url:'https://evil.test/'}),'https://chatgpt.com/');
for(const url of ['javascript:alert(1)',`https://chatgpt.com.evil.test/local/${id}`,`https://chatgpt.com/local/${id}?token=secret`]){
 const s=validateSnapshot({...seed,tasks:[{...seed.tasks[0],url}]});assert.equal(s.tasks[0].url,undefined);
}
const code=buildSync({entryPoints:[path.resolve(__dirname,'../scripting/scripts/Codex/view.tsx')],bundle:true,write:false,format:'cjs',platform:'node',external:['scripting'],jsxFactory:'createElement'}).outputFiles[0].text;
const moduleObject={exports:{}};
const createElement=(type,props,...children)=>typeof type==='function'?type({...props,children}):({type,props:props||{},children:children.flat(Infinity).filter(Boolean)});
const scripting=new Proxy({},{get:(_,name)=>name});
const UIImage={fromBase64String:value=>({kind:'ui-image',value})};
vm.runInNewContext(code,{module:moduleObject,exports:moduleObject.exports,require:()=>scripting,createElement,UIImage,Date,Set,JSON,Error});
function links(node){if(!node||typeof node!=='object')return [];return [...(node.type==='Link'?[node.props.url]:[]),...(node.children||[]).flatMap(links)];}
for(const [family,count,width]of [['systemSmall',2,158],['systemMedium',4,338],['systemLarge',8,338]]){
 const now=new Date().toISOString(),snapshot={...seed,generatedAt:now,usageObservedAt:now,tasksObservedAt:now,tasks:seed.tasks.map(t=>({...t,observedAt:now}))};
 const tree=moduleObject.exports.CodexView({snapshot,family,width,height:count===8?360:170});
 const urls=links(tree);
 assert.equal(urls.length,count+1);assert.equal(urls[0],'chatgpt://');
 assert.ok(urls.slice(1).every(u=>/^https:\/\/chatgpt\.com\/local\/[\w-]+$/.test(u)));
 assert.equal(tree.type,'ZStack');assert.equal(tree.props.widgetBackground,'#1E1E1E');
 assert.equal(tree.children[0].type,'Image');assert.equal(tree.children[0].props.image.kind,'ui-image');
}
console.log('Links: cabeçalho no app, destinos de tarefas, fundo e árvore 2/4/8 aprovados; toque nativo pendente.');
