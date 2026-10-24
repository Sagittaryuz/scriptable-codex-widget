const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {transformSync,buildSync}=require('esbuild');
const dir=path.resolve(__dirname,'../scripting/scripts/Codex');
function load(name,deps,values=new Map()){
 const code=transformSync(fs.readFileSync(path.join(dir,name),'utf8'),{loader:name.endsWith('tsx')?'tsx':'ts',format:'cjs',jsxFactory:'createElement'}).code;
 const module={exports:{}};vm.runInNewContext(code,{module,exports:module.exports,require:name=>deps[name],Date,Storage:{get:k=>values.get(k),set:(k,v)=>{values.set(k,v);return true}}});return module.exports;
}
(async()=>{
 for(const fail of [false,true]){
  const values=new Map(),events=[],definitions={};
  const sdk={AppIntentManager:{register:d=>{definitions[d.name]=d;return ()=>({name:d.name})}},AppIntentProtocol:{AppIntent:0},Widget:{reloadAll:()=>events.push('reload')},ControlWidget:{reloadButtons:()=>events.push('control')}};
  const deps={scripting:sdk,'./selection':{}};
  deps['./repository']={refreshSnapshot:async()=>{events.push('query');return {snapshot:{generatedAt:'2026-10-24T11:38:33Z'},offline:fail}}};
  deps['./pro-common']={reloadWidgets:async()=>events.push('reload')};
  load('app_intents.tsx',deps,values);
  await definitions['RefreshCodex'].perform();
  assert(events.includes('reload'),'Refresh failure must still request redraw');
  assert.equal(events[0],'query');assert.equal(values.get('manual-refresh').state,fail?'offline-cache-preserved':'downloaded');
 }
 const values=new Map(),definitions={},now=new Date().toISOString();let networkFails=false,reloads=0;
 const snapshot={schemaVersion:2,generatedAt:now,usageObservedAt:now,tasksObservedAt:now,windows:[],tasks:[],coverage:'fixture'};
 const native={AppIntentManager:{register:d=>{definitions[d.name]=d;return ()=>({})}},AppIntentProtocol:{AppIntent:0},Widget:{reloadUserWidgets:async()=>{reloads++}},ControlWidget:{reloadButtons:()=>{}}};
 const code=buildSync({entryPoints:[path.join(dir,'app_intents.tsx')],bundle:true,write:false,platform:'node',format:'cjs',external:['scripting']}).outputFiles[0].text;
 const module={exports:{}};
 vm.runInNewContext(code,{module,exports:module.exports,require:()=>native,Date,URL,Set,setTimeout,clearTimeout,Storage:{get:k=>values.get(k),set:(k,v)=>{values.set(k,v);return true}},GitHub:{isAvailable:()=>true,getTextContent:async()=>{if(networkFails)throw Error('offline');return {text:JSON.stringify(snapshot)}}}});
 await definitions.RefreshCodex.perform();assert.equal(values.get('codex-widget-snapshot-v2').generatedAt,now);assert.equal(values.get('manual-refresh').observedAt,now);assert.equal(reloads,1);
 networkFails=true;await definitions.RefreshCodex.perform();assert.equal(values.get('codex-widget-snapshot-v2').generatedAt,now);assert.equal(values.get('manual-refresh').state,'offline-cache-preserved');assert.equal(reloads,2);
 console.log('PASS manual refresh: actual intent requests current data, preserves offline status and reloads on success/failure. Native tap pending.');
})().catch(e=>{console.error(e);process.exitCode=1});
