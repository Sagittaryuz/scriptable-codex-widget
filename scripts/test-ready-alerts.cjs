const assert=require('node:assert/strict'),path=require('path'),vm=require('vm'),{buildSync}=require('esbuild');
const code=buildSync({entryPoints:[path.resolve(__dirname,'../scripting/scripts/Codex/pro.ts')],bundle:true,write:false,platform:'node',format:'cjs',external:['scripting']}).outputFiles[0].text;
const values=new Map(),m={exports:{}},sent=[];let fail=false;
vm.runInNewContext(code,{module:m,exports:m.exports,require:()=>({Widget:{}}),Date,Set,Storage:{get:k=>values.get(k),set:(k,v)=>{values.set(k,structuredClone(v));return true}},Notification:{schedule:async n=>{if(fail)throw Error('denied');sent.push(n)}}});
const now=new Date().toISOString(),snapshot=state=>({generatedAt:now,usageObservedAt:now,tasksObservedAt:now,windows:[],tasks:[{id:'private-id',title:'Private fixture',state,observedAt:now,origin:'Cloud',detail:''}]});
(async()=>{
 await m.exports.notifyChanges(snapshot('running'));assert.equal(sent.length,0,'Initial baseline quiet');
 await m.exports.notifyChanges(snapshot('ready'));assert.equal(sent.length,1,'Ready alerts enabled by default');assert.equal(sent[0].threadIdentifier,'codex-ready');assert(!JSON.stringify(sent).includes('Private fixture'),'Generic notification preserves task title privacy');
 await m.exports.notifyChanges(snapshot('ready'));assert.equal(sent.length,1,'No duplicate');
 await m.exports.notifyChanges(snapshot('running'));fail=true;await assert.rejects(m.exports.notifyChanges(snapshot('ready')));fail=false;await m.exports.notifyChanges(snapshot('ready'));assert.equal(sent.length,2,'Denied delivery retried without marking sent');
 await m.exports.notifyChanges(snapshot('running'));await m.exports.notifyChanges({...snapshot('ready'),tasksObservedAt:'2000-01-01T00:00:00Z'});assert.equal(sent.length,2,'Old snapshots ignored');
 values.set('codex-ready-alerts',false);await m.exports.notifyChanges(snapshot('ready'));assert.equal(sent.length,2,'Opt out respected');
 console.log('PASS ready alerts: default enabled, quiet baseline, fresh transition, dedup, retry, stale rejection, opt-out, private payload. iOS permission and delivery pending.');
})().catch(e=>{console.error(e);process.exitCode=1});
