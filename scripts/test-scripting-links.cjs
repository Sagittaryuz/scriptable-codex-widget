const assert=require('node:assert/strict'),vm=require('node:vm'),path=require('node:path');
const {buildSync}=require('esbuild');
const {taskURL,validateSnapshot,dimensions}=require('../scripting/scripts/Codex/model.ts');
const {HEADER_ICONS}=require('../scripting/scripts/Codex/header-icons.ts');
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
 const refresh=nodes(tree,'Button');assert.equal(refresh.length,family==='systemSmall'?2:3);assert(refresh.every(n=>n.props.intent.name==='RefreshCodex'),'Tasks only refresh');
 const contentBox=tree.children.find(n=>n.type==='VStack');
 const topMargin=contentBox.props.position.y-contentBox.props.frame.height/2,bottomMargin=height-(contentBox.props.position.y+contentBox.props.frame.height/2);assert.equal(topMargin,8);assert.equal(bottomMargin,8);
 const logicalWidth=family==='systemSmall'?146:304,logicalHeight=family==='systemLarge'?201:146,scale=Math.min(1,(width-12)/logicalWidth,(height-16)/logicalHeight);assert.equal(contentBox.props.frame.width,logicalWidth*scale,'Same outer horizontal margins as Popular');
 assert.equal(nodes(tree,'Rectangle').filter(n=>n.props.fill==='rgba(255,255,255,0.13)').length,2,'Only two dividers between tasks, none after usage bar or below last task');
 assert.equal(nodes(tree,'Rectangle').filter(n=>n.props.clipShape==='capsule').length,family==='systemSmall'?2:3,'Supported task status pills; usage is now separate dots');
 assert.equal((family==='systemSmall'?contentBox.children[0].children[0]:contentBox.children[0]).children[1].children.length,23,'Twenty-three usage dots preserve the limit line');

 const urls=links(tree);
 assert.equal(urls.length,4);assert.deepEqual(urls.slice(0,4),['https://chatgpt.com/#native','https://chatgpt.com/app/codex','https://chatgpt.com/voice','https://chatgpt.com/dots']);

 assert.equal(tree.type,'ZStack');assert.equal(tree.props.widgetBackground,'#1E1E1E');
 assert.equal(tree.children[0].type,'Image');assert.equal(tree.children[0].props.image.kind,'ui-image');assert.equal(taskNodes(tree,'Circle').length,family==='systemSmall'?2:3,'Every task gets an explicit native Circle layer');assert(taskNodes(tree,'Circle').every(n=>n.props.fill&&n.props.frame.width===n.props.frame.height));
 for(const icon of Object.values(HEADER_ICONS))assert.ok(nodes(tree,'Image').some(node=>node.props.image?.value===icon));
 assert.ok(!content(tree).includes('Hist. local'));assert.ok(!content(tree).includes('Semanal'));assert.ok(content(tree).includes('%')&&(family==='systemSmall'||content(tree).includes('% restante')));assert.ok(content(tree).includes('Codex · Este computador'));assert.ok(!content(tree).includes('agora'));
}
const colored={...seed,generatedAt:new Date().toISOString(),usageObservedAt:new Date().toISOString(),tasks:['ready','idle','error'].map((state,i)=>({...seed.tasks[i],state,observedAt:new Date().toISOString()}))};
const coloredView=moduleObject.exports.CodexView({snapshot:colored,family:'systemLarge',width:338,height:360});
assert.deepEqual(taskNodes(coloredView,'Circle').map(n=>n.props.fill.toUpperCase()).sort(),['#0A84FF','#2B2B2D','#FF4B55'].sort(),'Ready blue, idle gray, error red use filled native circles');
assert(taskNodes(coloredView,'Image').filter(n=>n.props.systemName&&['checkmark','pause.fill','exclamationmark'].includes(n.props.systemName)).every(n=>n.props.foregroundStyle==='white'&&!n.props.background),'Symbols sit above circles, without relying on Image background modifiers');
const stateStyle=moduleObject.exports.referenceStateStyle;
const current=new Date().toISOString();
assert.equal(stateStyle({...seed.tasks[0],state:'ready',observedAt:current}).short,'Pronta');
assert.equal(stateStyle({...seed.tasks[0],state:'idle',observedAt:current}).short,'Ociosa');
assert.equal(stateStyle({...seed.tasks[0],state:'ready',observedAt:'2000-01-01T00:00:00Z'}).short,'Antigo','Stale status never looks ready');
console.log('Links, limite colorido e origem visível sob as três tarefas aprovados; toque nativo pendente.');
