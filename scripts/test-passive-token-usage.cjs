// Explicitly synthetic fixtures. No network, real runtime, production ledger or publication.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),vm=require('node:vm');
const {EventEmitter}=require('node:events'),{PassThrough}=require('node:stream');
const {TokenUsageLedger}=require('./scripting-token-usage.cjs');
const {validateSnapshot}=require('../scripting/scripts/Codex/model.ts');
const {publicSnapshot}=require('./collect-scripting.cjs');
const {execFileSync}=require('node:child_process');
fs.mkdirSync(path.join(__dirname,'../work'),{recursive:true});
const start=Date.parse('2030-01-01T00:00:00Z');let clock=start;
const turn=n=>`${(0x123456780000+n).toString(16).slice(0,8)}-${(0x123456780000+n).toString(16).slice(8)}-7000-8000-000000000001`;
const event=(total,n=1,extra={})=>({threadId:'synthetic-task',turnId:turn(n),tokenUsage:{total:{totalTokens:total},last:{totalTokens:1}},...extra});
const fixture=()=>({schemaVersion:2,generatedAt:new Date(clock).toISOString(),usageObservedAt:new Date(clock).toISOString(),tasksObservedAt:new Date(clock).toISOString(),windows:[],coverage:'Synthetic',tasks:[{id:'synthetic-task',title:'Synthetic private title',state:'idle',origin:'Local',detail:'',observedAt:new Date(clock).toISOString()}]});
const metric=ledger=>ledger.attach(fixture()).tasks[0].tokenUsage;
let passed=0;function test(name,run){run();passed++;console.log('PASS '+name)}
test('absence stays absent; first real-shaped synthetic event is baseline, not consumption',()=>{
 const l=new TokenUsageLedger({now:()=>new Date(clock)});assert.equal(metric(l),undefined);assert(l.accept(event(100)));assert.deepEqual(metric(l).intervals,[]);assert.equal(metric(l).totalTokens,100);assert.equal(validateSnapshot(l.attach(fixture())).tasks[0].tokenUsage.totalTokens,100);
});
test('deduplicate totals regardless of last breakdown; never sum last and total',()=>{
 const l=new TokenUsageLedger({now:()=>new Date(clock)});l.accept(event(100));clock+=1000;l.accept(event(105));assert.deepEqual(metric(l).intervals.map(s=>s.tokens),[5]);const saved=JSON.stringify(metric(l));clock+=1000;assert.equal(l.accept({...event(105),tokenUsage:{total:{totalTokens:105},last:{totalTokens:999}}}),false);assert.equal(JSON.stringify(metric(l)),saved);assert.equal(l.accept(event(100)),false);
});
test('unknown decrease breaks series and suppresses uncertain same-turn deltas; new turn recovers',()=>{
 const l=new TokenUsageLedger({now:()=>new Date(clock)});l.accept(event(100));clock+=1000;l.accept(event(110));clock+=1000;l.accept(event(7));assert.equal(metric(l).totalTokens,7);assert.deepEqual(metric(l).intervals,[]);clock+=1000;l.accept(event(9));assert.deepEqual(metric(l).intervals,[]);assert.equal(l.accept(event(110)),false);clock+=1000;l.accept(event(12,2));clock+=1000;l.accept(event(17,2));assert.deepEqual(metric(l).intervals.map(s=>s.tokens),[5]);assert.equal(l.accept(event(500,1)),false);
});
test('new turn does not bridge its missing baseline or reuse prior intervals',()=>{
 const l=new TokenUsageLedger({now:()=>new Date(clock)});l.accept(event(100));clock+=1000;l.accept(event(110));clock+=1000;l.accept(event(130,2));assert.deepEqual(metric(l).intervals,[]);clock+=1000;l.accept(event(135,2));assert.deepEqual(metric(l).intervals.map(s=>s.tokens),[5]);
});
test('same timestamp never invents time; existing interval merges without double counting',()=>{
 const l=new TokenUsageLedger({now:()=>new Date(clock)});l.accept(event(100));l.accept(event(105));assert.deepEqual(metric(l).intervals,[]);clock+=1000;l.accept(event(110));l.accept(event(112));assert.deepEqual(metric(l).intervals.map(s=>s.tokens),[7]);assert.equal(validateSnapshot(l.attach(fixture())).tasks[0].tokenUsage.intervals.length,1);
});
test('bounds, unsafe counts, invalid identities and backward wall time are rejected',()=>{
 const l=new TokenUsageLedger({now:()=>new Date(clock)});for(const e of [event(-1),event(1.5),event(Infinity),event(Number.MAX_SAFE_INTEGER+1),event(1,1,{threadId:'bad/path'}),event(1,1,{turnId:'not-uuid-v7'}),{threadId:'synthetic-task'}])assert.equal(l.accept(e),false);l.accept(event(0));for(let i=1;i<=35;i++){clock+=1000;l.accept(event(i));}assert.equal(metric(l).intervals.length,24);assert.equal(metric(l).totalTokens,35);clock-=1;assert.equal(l.accept(event(36)),false);clock+=1;
});
test('durability, reconnect gap, missing observations, minimal fields and public privacy',()=>{
 const dir=fs.mkdtempSync(path.join(__dirname,'../work/synthetic-codex-token-test-')),file=path.join(dir,'synthetic-ledger.json');
 const l=new TokenUsageLedger({file,now:()=>new Date(clock)});l.accept(event(100,1,{chat:'SYNTHETIC_CHAT_MUST_NOT_PERSIST'}));clock+=1000;l.accept(event(110));const previous=metric(l);const persisted=fs.readFileSync(file,'utf8');assert(!persisted.includes('SYNTHETIC_CHAT'));assert(!persisted.includes(turn(1)));assert(!persisted.includes('title'));assert(!persisted.includes('last'));
 const reopened=new TokenUsageLedger({file,now:()=>new Date(clock)});clock+=60000;assert.deepEqual(metric(reopened),previous);assert.equal(reopened.accept(event(110)),false);assert.deepEqual(metric(reopened),previous);clock+=1000;reopened.accept(event(115));assert.deepEqual(metric(reopened).intervals.map(s=>s.tokens),[5]);const again=new TokenUsageLedger({file,now:()=>new Date(clock)});clock+=60000;again.accept(event(130));assert.deepEqual(metric(again).intervals,[]);
 assert(!JSON.stringify(publicSnapshot(again.attach(fixture()))).includes('tokenUsage'));assert(!JSON.stringify(publicSnapshot(again.attach(fixture()))).includes('synthetic-task'));assert(fs.existsSync(file));
 // Only test-owned temp files are removed, individually; production paths are never used.
 fs.unlinkSync(file);fs.rmdirSync(dir);
});
test('malformed persisted file fails closed instead of replacing the prior snapshot',()=>{
 const dir=fs.mkdtempSync(path.join(__dirname,'../work/synthetic-codex-token-test-')),file=path.join(dir,'synthetic-invalid.json');fs.writeFileSync(file,'{"schemaVersion":99}');assert.throws(()=>new TokenUsageLedger({file}),/Invalid/);assert.equal(fs.readFileSync(file,'utf8'),'{"schemaVersion":99}');fs.unlinkSync(file);fs.rmdirSync(dir);
});
test('reader dispatches exactly the official notification; requests remain unchanged',()=>{
 const child=new EventEmitter();child.stdout=new PassThrough();child.stderr=new PassThrough();child.stdin=new PassThrough();let received=0,spawnArgs;
 const module={exports:{}};const source=fs.readFileSync(require.resolve('./scripting-rpc.cjs'),'utf8');
 vm.runInNewContext(source,{require:n=>n==='node:child_process'?{spawn:(...args)=>{spawnArgs=args;return child}}:require(n),module,Buffer,setTimeout,clearTimeout,console});
 const reader=new module.exports.CodexReader({onTokenUsage:p=>{assert.equal(p.tokenUsage.total.totalTokens,10);received++}});
 child.stdout.write(JSON.stringify({method:'item/agentMessage/delta',params:{delta:'SYNTHETIC_CHAT'}})+'\n');child.stdout.write(JSON.stringify({method:'thread/tokenUsage/updated',params:event(10)})+'\n');child.stdout.write(JSON.stringify({id:999,method:'thread/tokenUsage/updated',params:event(10)})+'\n');assert.equal(received,1);assert.throws(()=>reader.request('thread/resume'),/escopo/);assert.throws(()=>reader.request('account/usage/read'),/escopo/);assert.deepEqual(Array.from(spawnArgs[1]),['app-server','proxy']);child.stdout.end();
});
test('publication, transport resolution, watcher and RPC allowlist remain byte-identical',()=>{
 const base='4251f4e289e3d951dcc6554ced2b296ba01ff824',read=f=>fs.readFileSync(path.join(__dirname,f),'utf8').replace(/\r\n/g,'\n'),before=f=>execFileSync('git',['show',base+':scripts/'+f],{encoding:'utf8'});
 const current=read('collect-scripting.cjs'),original=before('collect-scripting.cjs');
 assert.equal(current.slice(current.indexOf('function publishFile')),original.slice(original.indexOf('function publishFile')));
 for(const f of ['watch-scripting.cjs','resolve-executable.cjs','scripting-model.cjs'])assert.equal(read(f),before(f));
 const section=s=>s.slice(s.indexOf('  request(method'),s.indexOf('  async initialize'));
 assert.equal(section(read('scripting-rpc.cjs')),section(before('scripting-rpc.cjs')));
});
(async()=>{
 // Exercise the real collect integration with a fake read-only RPC and an in-memory ledger.
 const source=fs.readFileSync(require.resolve('./collect-scripting.cjs'),'utf8'),module={exports:{}};let ledger;
 const methods=[];
 class FakeReader{constructor(options){this.options=options}async initialize(){this.options.onTokenUsage(event(100));clock+=1000;this.options.onTokenUsage(event(105))}async request(method){methods.push(method);if(method==='account/rateLimits/read')return {rateLimits:{primary:{usedPercent:20,windowDurationMins:300}}};if(method==='thread/list')return {data:[{id:'synthetic-task',name:'Synthetic private title',status:{type:'idle'}}],nextCursor:null};if(method==='thread/turns/list')return {data:[]};throw Error('Unexpected RPC')}close(){}}
 vm.runInNewContext(source,{module,require:n=>n==='./scripting-model.cjs'?{makeSnapshot:(usage,threads,turns)=>require('./scripting-model.cjs').makeSnapshot(usage,threads,turns,new Date(clock),'Synthetic')}:n==='./scripting-rpc.cjs'?{CodexReader:FakeReader}:n==='./scripting-token-usage.cjs'?{TokenUsageLedger:class extends TokenUsageLedger{constructor(){super({now:()=>new Date(clock)});ledger=this}}}:n==='node:fs'?{existsSync:()=>false}:require(n),__dirname:__dirname,process:{argv:[]},console});
 const snapshot=await module.exports.collect();assert.equal(snapshot.tasks[0].tokenUsage.totalTokens,105);assert.deepEqual(snapshot.tasks[0].tokenUsage.intervals.map(s=>s.tokens),[5]);assert.deepEqual(methods.sort(),['account/rateLimits/read','thread/list','thread/turns/list'].sort());assert(ledger);passed++;console.log('PASS synthetic collect integration, no new RPC/publication');console.log(`${passed} passive-token tests passed. Synthetic-only; zero production events or publications.`);
})().catch(e=>{console.error(e);process.exitCode=1});
