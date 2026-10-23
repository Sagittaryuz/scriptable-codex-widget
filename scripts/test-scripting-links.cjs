const assert=require('node:assert/strict'),vm=require('node:vm'),path=require('node:path');
const {buildSync}=require('esbuild');
const {taskURL,validateSnapshot}=require('../scripting/scripts/Codex/model.ts');
const {CODEX_SYMBOL}=require('../scripting/scripts/Codex/codex-symbol.ts');
const seed=require('../scripting/scripts/Codex/seed.json');
const id='01a16427-5b79-74c3-b764-d0209a89a000';
assert.equal(taskURL({id,origin:'Local'}),`https://chatgpt.com/codex/tasks/${id}`);
assert.equal(taskURL({id,origin:'Remoto'}),`https://chatgpt.com/codex/tasks/${id}`);
assert.equal(taskURL({id,origin:'Cloud'}),`https://chatgpt.com/codex/cloud/tasks/${id}`);
assert.equal(taskURL({id,origin:'ChatGPT'}),`https://chatgpt.com/c/${id}`);
assert.equal(taskURL({id:'unknown',origin:'Other',url:'https://evil.test/'}),'https://chatgpt.com/');
for(const url of ['javascript:alert(1)',`https://chatgpt.com.evil.test/codex/tasks/${id}`,`https://chatgpt.com/codex/tasks/${id}?token=secret`,`https://chatgpt.com/local/${id}`]){
 const s=validateSnapshot({...seed,tasks:[{...seed.tasks[0],url}]});assert.equal(s.tasks[0].url,undefined);
}
const code=buildSync({entryPoints:[path.resolve(__dirname,'../scripting/scripts/Codex/view.tsx')],bundle:true,write:false,format:'cjs',platform:'node',external:['scripting'],jsxFactory:'createElement'}).outputFiles[0].text;
const moduleObject={exports:{}};
const createElement=(type,props,...children)=>typeof type==='function'?type({...props,children}):({type,props:props||{},children:children.flat(Infinity).filter(Boolean)});
const scripting=new Proxy({},{get:(_,name)=>name});
const UIImage={fromBase64String:value=>({kind:'ui-image',value})};
vm.runInNewContext(code,{module:moduleObject,exports:moduleObject.exports,require:()=>scripting,createElement,UIImage,Date,Set,JSON,Error});
function links(node){if(!node||typeof node!=='object')return [];return [...(node.type==='Link'?[node.props.url]:[]),...(node.children||[]).flatMap(links)];}
function nodes(node,type){if(!node||typeof node!=='object')return [];return [...(node.type===type?[node]:[]),...(node.children||[]).flatMap(child=>nodes(child,type))];}
function content(node){if(typeof node==='string')return node;if(!node||typeof node!=='object')return '';return (node.children||[]).map(content).join('');}
for(const [family,width,height]of [['systemSmall',158,170],['systemMedium',338,170],['systemLarge',338,360]]){
 const now=new Date().toISOString(),snapshot={...seed,generatedAt:now,usageObservedAt:now,tasksObservedAt:now,tasks:seed.tasks.map(t=>({...t,observedAt:now}))};
 const tree=moduleObject.exports.CodexView({snapshot,family,width,height});
 const urls=links(tree);
 assert.equal(urls.length,4);assert.equal(urls[0],'chatgpt://');
 assert.ok(urls.slice(1).every(u=>/^https:\/\/chatgpt\.com\/codex\/tasks\/[\w-]+$/.test(u)));
 assert.equal(new Set(urls.slice(1)).size,3);
 assert.equal(tree.type,'ZStack');assert.equal(tree.props.widgetBackground,'#1E1E1E');
 assert.equal(tree.children[0].type,'Image');assert.equal(tree.children[0].props.image.kind,'ui-image');
 assert.ok(nodes(tree,'Image').some(node=>node.props.image?.value===CODEX_SYMBOL));
 assert.ok(!content(tree).includes('Hist. local'));assert.ok(!content(tree).includes('agora'));
}
console.log('Links: cabeçalho no app e tarefas nas rotas universais oficiais do Codex aprovados; toque nativo pendente.');
