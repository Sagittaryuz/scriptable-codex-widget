const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),os=require('node:os');
const {buildSync}=require('esbuild');
const dir=path.resolve(__dirname,'../scripting/scripts/Codex');
function load(name,globals={}){
 const code=buildSync({entryPoints:[path.join(dir,name)],bundle:true,write:false,platform:'node',format:'cjs',external:['scripting']}).outputFiles[0].text;
 const values=new Map(),module={exports:{}};
 vm.runInNewContext(code,{module,exports:module.exports,require:()=>({Widget:{}}),Storage:{get:k=>values.get(k)??null,set:(k,v)=>{values.set(k,structuredClone(v));return true}},Date,URL,Set,setTimeout,clearTimeout,console,...globals});
 return {api:module.exports,values};
}
const now=new Date().toISOString(),task=(id,state)=>({id,title:'Private fixture '+id,state,observedAt:now,origin:'Local',detail:'Explicit status'});
const snapshot={schemaVersion:2,generatedAt:now,usageObservedAt:now,tasksObservedAt:now,windows:[],coverage:'fixture',tasks:[task('a','running'),task('b','idle')]};
(async()=>{
 const seed=require('../scripting/scripts/Codex/seed.json');assert.equal(seed.tasks.length,0,'Public seed has no personal tasks');
 let sends=0,fail=false;
 const x=load('pro.ts',{Notification:{schedule:async()=>{sends++;if(fail&&sends===2)throw Error('delivery failed')}}});
 x.values.set('codex-alerts',true);await x.api.notifyChanges(snapshot);assert.equal(sends,0,'First observation is baseline');
 const changed={...snapshot,tasks:[task('a','approval'),task('b','error')]};fail=true;
 await assert.rejects(x.api.notifyChanges(changed));assert.equal(x.values.get('codex-alert-baseline').a,'approval');
 fail=false;await x.api.notifyChanges(changed);assert.equal(sends,3,'Retry only unsent transition');
 await x.api.notifyChanges(changed);assert.equal(sends,3,'No repeated alert');
 await x.api.notifyChanges({...changed,tasksObservedAt:'2000-01-01T00:00:00Z'});assert.equal(sends,3);
 const privateReply=JSON.stringify(snapshot);
 let calls=0;
 const repo=load('repository.ts',{GitHub:{isAvailable:()=>true,getTextContent:async opts=>{calls++;assert.equal(opts.repo,'codex-widget-private-data');return {text:privateReply}}}});
 const result=await repo.api.refreshSnapshot();assert.equal(result.offline,false);assert.equal(result.snapshot.tasks.length,2);assert.equal(calls,1);
 const old=repo.values.get('codex-widget-snapshot-v2');
 const failRepo=load('repository.ts',{GitHub:{isAvailable:()=>true,getTextContent:async()=>{throw Error('permission denied')}}});
 failRepo.values.set('codex-widget-snapshot-v2',old);const failed=await failRepo.api.refreshSnapshot();assert.equal(failed.offline,true);assert.equal(failed.snapshot.tasks.length,2,'Private failure preserves private cache without public downgrade');
 const {publicSnapshot}=require('./collect-scripting.cjs');assert.equal(publicSnapshot(snapshot).tasks.length,0);assert(!JSON.stringify(publicSnapshot(snapshot)).includes('Private fixture'));
 const {notify,transitions}=require('./scripting-push.cjs');assert.equal(transitions(snapshot,null).length,0);assert.equal(transitions(changed,{a:'running',b:'idle'}).length,2);
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'codex-push-')),file=path.join(tmp,'state.json');
 const sent=[];const fetcher=async(url,opts)=>{sent.push(JSON.parse(opts.body));assert(!opts.body.includes('Private fixture'));return {ok:true,json:async()=>({ok:true,data:{results:[{status:'sent'}]}})}};
 await notify(snapshot,{key:'test-key',fetcher,file});assert.equal(sent.length,0);
 await notify(changed,{key:'test-key',fetcher,file});assert.equal(sent.length,2);
 await notify(changed,{key:'test-key',fetcher,file});assert.equal(sent.length,2);
 fs.unlinkSync(file);fs.rmdirSync(tmp);
 console.log('PASS Pro: public privacy, private API/cache, stale state, alert baseline/crossing/retry/deduplication, push transport and generic payload. Native delivery remains untested.');
})().catch(e=>{console.error(e);process.exitCode=1});
