const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict'),cp=require('child_process'),{buildSync}=require('esbuild');
const root=path.resolve(__dirname,'../scripting/scripts/Codex'),baseline='fdedd9fc';
const sdk=new Proxy({AppIntentManager:{register:d=>()=>({name:d.name})},AppIntentProtocol:{AppIntent:0}},{get:(o,k)=>o[k]??k});
const createElement=(type,props,...children)=>typeof type==='function'?type({...props,children:children.flat(Infinity).filter(Boolean)}):({type,props:props||{},children:children.flat(Infinity).filter(Boolean)});
function load(old=false){const m={exports:{}},code=buildSync({stdin:{contents:old?cp.execFileSync('git',['show',baseline+':scripting/scripts/Codex/view.tsx'],{encoding:'utf8'}):fs.readFileSync(path.join(root,'view.tsx'),'utf8'),resolveDir:root,loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',external:['scripting'],jsxFactory:'createElement' }).outputFiles[0].text;vm.runInNewContext(code,{module:m,exports:m.exports,require:()=>sdk,createElement,Date,Set,Map,JSON,UIImage:{fromBase64String:base64=>({base64})}});return m.exports.CodexView}
const nodes=(n,t)=>!n||typeof n!=='object'?[]:[...(n.type===t?[n]:[]),...(n.children||[]).flatMap(c=>nodes(c,t))];
const view=load(),oldView=load(true),now=new Date().toISOString(),snap={schemaVersion:2,generatedAt:now,usageObservedAt:now,tasksObservedAt:now,coverage:'Synthetic only',windows:[{remainingPercent:86,usedPercent:14,windowDurationMins:300,resetsAt:1795100000}],tasks:[{id:'fixture',title:'Task must not appear',state:'ready',origin:'Local',observedAt:now}]};
for(const [family,width,height]of [['systemMedium',338,158],['systemLarge',338,354]])assert.deepEqual(JSON.parse(JSON.stringify(view({snapshot:snap,family,width,height}))),JSON.parse(JSON.stringify(oldView({snapshot:snap,family,width,height}))),'Larger family must remain byte-for-byte equivalent tree');
let count=0;
for(const [width,height]of [[158,158],[158,170],[170,170],[150,150]])for(const balance of [0,8,50,86,100,null])for(const stale of [false,true]){
 const snapshot={...snap,usageObservedAt:stale?'2020-01-01T00:00:00Z':now,windows:balance==null?[]:[{...snap.windows[0],remainingPercent:balance,usedPercent:100-balance}]};
 const tree=view({snapshot,family:'systemSmall',width,height}),links=nodes(tree,'Link'),texts=nodes(tree,'Text').map(n=>n.children.join(''));
 assert.equal(links.length,4);assert.equal(nodes(tree,'Button').length,0);assert.equal(texts.length,1);assert.equal(texts[0],(balance==null?'—':balance+'%')+(stale?' †':''));
 assert.deepEqual(links.map(n=>n.props.url),['https://chatgpt.com/dots','https://chatgpt.com/app/codex','https://chatgpt.com/voice','https://chatgpt.com/#native']);
 const container=tree.children[1].children[0],w=container.props.frame.width,h=container.props.frame.height;
 links.forEach((n,i)=>{const f=n.children[0].props.frame,p=n.props.position;assert(p.x-f.width/2>=0);assert(p.x+f.width/2<=w+.001);assert(p.y-f.height/2>=0);assert(p.y+f.height/2<=h+.001);assert.equal(p.x,w*(i%2?.75:.25))});
 assert.equal(nodes(tree,'HStack').length,1);assert.equal(nodes(tree,'HStack')[0].children.length,23);assert(!JSON.stringify(tree).includes('Task must not appear'));assert(!JSON.stringify(tree).includes('Redefine'));
 if(width===158&&height===158&&balance===86&&!stale)fs.writeFileSync(path.resolve(__dirname,'../validation/small-launcher-tree.json'),JSON.stringify({simulation:true,nativeIOS:false,tree}));count++;
}
console.log(`PASS ${count} small launcher states/sizes + unchanged medium/large trees; 4 original icons/links, centered quota with partial points, no task/reset UI.`);
