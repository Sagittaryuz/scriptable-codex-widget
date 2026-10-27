const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict'),{buildSync}=require('esbuild');
const root=path.resolve(__dirname,'../scripting/scripts/Codex');
const source=fs.readFileSync(path.join(root,'header.tsx'),'utf8');
assert.equal(source,cp.execFileSync('git',['show','5e1330c:scripting/scripts/Codex/header.tsx'],{encoding:'utf8'}),'Restore the exact 1.6.5 header, not a new route approximation');
const bundle=buildSync({entryPoints:[path.join(root,'header.tsx')],bundle:true,write:false,platform:'node',format:'cjs',jsxFactory:'createElement',external:['scripting']}).outputFiles[0].text;
const urls=['https://chatgpt.com/#native','https://chatgpt.com/app/codex','https://chatgpt.com/voice','https://chatgpt.com/dots'];
const {referenceLayout}=require('../scripting/scripts/Codex/content-layout.ts');
const nodes=(n,type)=>n&&typeof n==='object'?[...(n.type===type?[n]:[]),...(n.children||[]).flatMap(c=>nodes(c,type))]:[];
for(const state of ['cold','already-open','network-hanging','network-rejected']){
 const forbidden=()=>{throw Error('Direct Link must not call navigation, refresh, timers or native Script APIs: '+state)};
 const sdk=new Proxy({},{get:(_,key)=>{if(['Script','Safari','Widget','fetch'].includes(key))return new Proxy(forbidden,{get:forbidden,apply:forbidden});return key}});
 const m={exports:{}};const createElement=(type,props,...children)=>typeof type==='function'?type({...props,children:children.flat(Infinity).filter(Boolean)}):({type,props:props||{},children:children.flat(Infinity).filter(Boolean)});
 vm.runInNewContext(bundle,{module:m,exports:m.exports,require:()=>sdk,Date,JSON,Set,Map,createElement,UIImage:{fromBase64String:()=>({syntheticImage:true})},Storage:{get:forbidden,set:forbidden},setTimeout:forbidden});
 const now=new Date().toISOString(),snapshot={schemaVersion:2,generatedAt:now,usageObservedAt:now,tasksObservedAt:now,coverage:'Synthetic direct link regression',windows:[],tasks:[]};
 for(const [family,w,h]of [['systemSmall',158,158],['systemSmall',158,170],['systemMedium',338,170],['systemLarge',338,360]]){
  const tree=m.exports.ShortcutHeader({snapshot,layout:referenceLayout(family,w,h)}),links=nodes(tree,'Link');assert.equal(links.length,4);assert.deepEqual(links.map(n=>n.props.url),urls);
  for(const [i,link]of links.entries()){const parsed=new URL(link.props.url);assert.equal(parsed.protocol,'https:');assert.equal(parsed.hostname,'chatgpt.com');assert.equal(parsed.href,urls[i]);assert.equal(parsed.searchParams.has('codexWidgetTap'),false);assert.equal(link.props.action,undefined);assert.equal(link.props.intent,undefined)}
 }
}
console.log('PASS direct shortcut hotfix: exact 1.6.5 header, four exact HTTPS tokens parsed by Node URL, four dimensions and no dependency on cold/live Script state, network, timers or reload. Native iOS parser and handoff are NOT tested.');
