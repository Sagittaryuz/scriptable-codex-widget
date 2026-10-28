// Passive official notifications only. No RPCs, model calls, chat items or credentials.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {MAX_TASKS,MAX_TOKEN_INTERVALS}=require('../scripting/scripts/Codex/model.ts');
const SOURCE='thread/tokenUsage/updated',MAX_SEEN=128;
const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const count=x=>Number.isSafeInteger(x)&&x>=0;
const iso=x=>typeof x==='string'&&Number.isFinite(Date.parse(x));
const key=x=>crypto.createHash('sha256').update(x).digest('hex');
const taskID=x=>typeof x==='string'&&/^[\w-]{1,100}$/.test(x);
const turnTime=x=>typeof x==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-7[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(x)?parseInt(x.replace(/-/g,'').slice(0,12),16):null;
function cleanEntry(e){
 if(!object(e)||!iso(e.observedAt)||!count(e.totalTokens)||!count(e.turnTime)||!/^[a-f0-9]{64}$/.test(e.turnKey)||typeof e.suppressed!=='boolean'||!Array.isArray(e.seen)||e.seen.length>MAX_SEEN||e.seen.some(x=>typeof x!=='string'||!/^[a-f0-9]{64}$/.test(x))||!Array.isArray(e.intervals)||e.intervals.length>MAX_TOKEN_INTERVALS)throw Error('Invalid private token ledger.');
 let previous=-Infinity;
 const intervals=e.intervals.map(s=>{
  if(!object(s)||!iso(s.at)||!count(s.tokens)||Date.parse(s.at)<=previous||Date.parse(s.at)>Date.parse(e.observedAt))throw Error('Invalid private token chronology.');
  previous=Date.parse(s.at);return {at:s.at,tokens:s.tokens};
 });
 return {observedAt:e.observedAt,totalTokens:e.totalTokens,intervals,turnTime:e.turnTime,turnKey:e.turnKey,suppressed:e.suppressed,seen:[...e.seen]};
}
class TokenUsageLedger{
 constructor({file,now=()=>new Date()}={}){
  this.file=file;this.now=now;this.entries=new Map();this.anchors=new Map();
  if(file&&fs.existsSync(file)){
   if(fs.statSync(file).size>16*1024*1024)throw Error('Private token ledger exceeds safety limit.');
   const data=JSON.parse(fs.readFileSync(file,'utf8'));
   if(data?.schemaVersion!==1||!Array.isArray(data.tasks)||data.tasks.length>MAX_TASKS)throw Error('Invalid private token ledger.');
   for(const t of data.tasks){if(!taskID(t.id)||this.entries.has(t.id))throw Error('Invalid private token identity.');this.entries.set(t.id,cleanEntry(t));}
  }
 }
 save(){
  if(!this.file)return;
  fs.mkdirSync(path.dirname(this.file),{recursive:true});
  const temp=this.file+'.'+process.pid+'.tmp';
  fs.writeFileSync(temp,JSON.stringify({schemaVersion:1,tasks:[...this.entries].map(([id,e])=>({id,...e}))})+'\n',{mode:0o600});
  fs.renameSync(temp,this.file);
 }
 accept(params){
  if(!object(params)||!taskID(params.threadId)||!object(params.tokenUsage)||!count(params.tokenUsage.total?.totalTokens)||!count(params.tokenUsage.last?.totalTokens))return false;
  const time=turnTime(params.turnId);if(time===null)return false;
  const id=params.threadId,total=params.tokenUsage.total.totalTokens,turnKey=key(params.turnId),fingerprint=key(params.turnId+':'+total);
  const instant=this.now(),at=instant instanceof Date?instant.toISOString():null;if(!at)return false;
  const old=this.entries.get(id),anchor=this.anchors.get(id);
  if(old){
   if(Date.parse(at)<Date.parse(old.observedAt)||time<old.turnTime)return false;
   // Same-millisecond distinct turn IDs have no provable order. Ignore rather than guess.
   if(time===old.turnTime&&turnKey!==old.turnKey)return false;
   if(old.seen.includes(fingerprint)){
    // A replay can anchor this connection only when it exactly matches the latest observation.
    if(!anchor&&total===old.totalTokens&&turnKey===old.turnKey)this.anchors.set(id,{total,at,turnKey,newSeries:true});
    return false;
   }
  }else if(this.entries.size>=MAX_TASKS)return false;
  const newTurn=!!old&&turnKey!==old.turnKey;
  const reset=!!old&&!newTurn&&total<old.totalTokens;
  const suppressed=reset||(!newTurn&&!!old?.suppressed);
  // A new connection/turn or any decrease starts a baseline; never bridge a gap or reset.
  let intervals=[];
  if(old&&anchor&&anchor.turnKey===turnKey&&!suppressed&&total>=anchor.total){
   intervals=anchor.newSeries?[]:old.intervals.map(s=>({...s}));
   const delta=total-anchor.total;
   if(Date.parse(at)>Date.parse(anchor.at))intervals.push({at,tokens:delta});
   else if(intervals.at(-1)?.at===at){const sum=intervals.at(-1).tokens+delta;if(count(sum))intervals.at(-1).tokens=sum;else intervals=[];}
   // Same-timestamp baseline updates have no measurable interval, so remain baseline-only.
  }
  const entry={observedAt:at,totalTokens:total,intervals:intervals.slice(-MAX_TOKEN_INTERVALS),turnTime:time,turnKey,suppressed,seen:[...(old?.seen||[]),fingerprint].slice(-MAX_SEEN)};
  this.entries.set(id,entry);this.anchors.set(id,{total,at,turnKey,newSeries:false});this.save();return true;
 }
 attach(snapshot){
  return {...snapshot,tasks:snapshot.tasks.map(task=>{
   const e=this.entries.get(task.id);
   if(!e||Date.parse(e.observedAt)>Date.parse(snapshot.generatedAt))return task;
   return {...task,tokenUsage:{source:SOURCE,observedAt:e.observedAt,totalTokens:e.totalTokens,intervals:e.intervals.map(s=>({...s}))}};
  })};
 }
}
module.exports={TokenUsageLedger,SOURCE};
