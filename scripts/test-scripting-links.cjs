const assert=require('node:assert/strict'),vm=require('node:vm'),path=require('node:path');
const {buildSync}=require('esbuild');
const {taskURL,validateSnapshot,dimensions}=require('../scripting/scripts/Codex/model.ts');
const {CODEX_SYMBOL}=require('../scripting/scripts/Codex/codex-symbol.ts');
const seed={...require('../scripting/scripts/Codex/seed.json'),windows:[{usedPercent:24,remainingPercent:76,windowDurationMins:300,resetsAt:Date.now()/1000+3600}],tasks:[1,2,3].map(n=>({id:'00000000-0000-4000-8000-'+String(n).padStart(12,'0'),title:'Synthetic task '+n,state:'unknown',origin:'Local',detail:'Fixture',observedAt:'2026-10-23T12:00:00Z'}))};
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
const native={AppIntentManager:{register:definition=>()=>({name:definition.name})},AppIntentProtocol:{AppIntent:0}};
const scripting=new Proxy(native,{get:(target,name)=>target[name]??name});
const UIImage={fromBase64String:value=>({kind:'ui-image',value})};
vm.runInNewContext(code,{module:moduleObject,exports:moduleObject.exports,require:()=>scripting,createElement,UIImage,Date,Set,JSON,Error});
function links(node){if(!node||typeof node!=='object')return [];return [...(node.type==='Link'?[node.props.url]:[]),...(node.children||[]).flatMap(links)];}
function nodes(node,type){if(!node||typeof node!=='object')return [];return [...(node.type===type?[node]:[]),...(node.children||[]).flatMap(child=>nodes(child,type))];}
function taskNodes(tree,type){const box=tree.children.find(n=>n.type==='VStack');return box.children.slice(1).flatMap(n=>nodes(n,type));}
function content(node){if(typeof node==='string')return node;if(!node||typeof node!=='object')return '';return (node.children||[]).map(content).join('');}
for(const [family,width,height]of [['systemSmall',158,158],['systemSmall',158,170],['systemMedium',338,170],['systemLarge',338,360]]){
 const now=new Date().toISOString(),snapshot={...seed,generatedAt:now,usageObservedAt:now,tasksObservedAt:now,tasks:seed.tasks.map(t=>({...t,observedAt:now}))};
 const tree=moduleObject.exports.CodexView({snapshot,family,width,height});
 const refresh=nodes(tree,'Button');assert.equal(refresh.length,1);assert.equal(refresh[0].props.intent.name,'RefreshCodex');assert.equal(refresh[0].props.position.x,width/2);assert(refresh[0].props.position.x+refresh[0].props.frame.width/2<=width&&refresh[0].props.position.y+refresh[0].props.frame.height/2<=height);
 const contentBox=tree.children.find(n=>n.type==='VStack');assert(contentBox.props.position.y+contentBox.props.frame.height/2<=refresh[0].props.position.y-refresh[0].props.frame.height/2-2,'Data rows finish above refresh footer');
 const topMargin=contentBox.props.position.y-contentBox.props.frame.height/2,bottomMargin=(height-17)-(contentBox.props.position.y+contentBox.props.frame.height/2);assert(Math.abs(topMargin-bottomMargin)<1e-8,'Equal top and bottom margins above painted footer');
 const expectedSide=family==='systemSmall'?8:10;
 assert.equal((width-contentBox.props.frame.width)/2,expectedSide,'Reference side margins');
 assert.equal(topMargin,family==='systemLarge'?16:8,'Reference top margin');
 assert.equal(nodes(tree,'Rectangle').filter(n=>n.props.fill==='rgba(255,255,255,0.13)').length,3,'Header divider plus two between tasks, none below last task');
 assert.equal(nodes(tree,'Rectangle').filter(n=>n.props.clipShape==='capsule').length,5,'Three status pills and two progress layers');

 const urls=links(tree);
 assert.equal(urls.length,6);assert.deepEqual(urls.slice(0,3),['https://chatgpt.com/app/codex','https://chatgpt.com/voice','https://chatgpt.com/dots']);
 assert.ok(urls.slice(3).every(u=>/^https:\/\/chatgpt\.com\/codex\/tasks\/[\w-]+$/.test(u)));
 assert.equal(new Set(urls.slice(3)).size,3);
 assert.equal(tree.type,'ZStack');assert.equal(tree.props.widgetBackground,'#1E1E1E');
 assert.equal(tree.children[0].type,'Image');assert.equal(tree.children[0].props.image.kind,'ui-image');assert.equal(taskNodes(tree,'Circle').length,3,'Every task gets an explicit native Circle layer');assert(taskNodes(tree,'Circle').every(n=>n.props.fill&&n.props.frame.width===n.props.frame.height));
 assert.ok(nodes(tree,'Image').some(node=>node.props.image?.value===CODEX_SYMBOL));
 assert.ok(!content(tree).includes('Hist. local'));assert.ok(!content(tree).includes('Semanal'));assert.ok(content(tree).includes('%')&&(family==='systemSmall'||content(tree).includes('% restante')));assert.ok(content(tree).includes('Codex · Este computador'));assert.ok(!content(tree).includes('agora'));
}
const colored={...seed,generatedAt:new Date().toISOString(),usageObservedAt:new Date().toISOString(),tasks:['ready','idle','error'].map((state,i)=>({...seed.tasks[i],state,observedAt:new Date().toISOString()}))};
const coloredView=moduleObject.exports.CodexView({snapshot:colored,family:'systemLarge',width:338,height:360});
assert.deepEqual(taskNodes(coloredView,'Circle').map(n=>n.props.fill.toUpperCase()).sort(),['#0A84FF','#2B2B2D','#FF4B55'].sort(),'Ready blue, idle gray, error red use filled native circles');
assert(taskNodes(coloredView,'Image').filter(n=>n.props.systemName&&n.props.systemName!=='chevron.right'&&n.props.systemName!=='arrow.clockwise').every(n=>n.props.foregroundStyle==='white'&&!n.props.background),'Symbols sit above circles, without relying on Image background modifiers');
const stateStyle=moduleObject.exports.referenceStateStyle;
const current=new Date().toISOString();
assert.equal(stateStyle({...seed.tasks[0],state:'ready',observedAt:current}).short,'Pronta');
assert.equal(stateStyle({...seed.tasks[0],state:'idle',observedAt:current}).short,'Ociosa');
assert.equal(stateStyle({...seed.tasks[0],state:'ready',observedAt:'2000-01-01T00:00:00Z'}).short,'Antigo','Stale status never looks ready');
console.log('Links, limite colorido e origem visível sob as três tarefas aprovados; toque nativo pendente.');
