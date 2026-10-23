// Data refresh without model calls; no source-code updates here.
const {collect,publish}=require('./collect-scripting.cjs');
const fs=require('node:fs'),path=require('node:path');
const {notify}=require('./scripting-push.cjs');
const interval=60000;
const statusFile=path.resolve(__dirname,'../work/scripting-collector-status.json');
let stopped=false;
async function once(){
 try{
  const snapshot=await collect();const commit=publish(snapshot);
  let push;try{push=await notify(snapshot)}catch{push={configured:true,deliveryConfirmed:false}}
  fs.mkdirSync(path.dirname(statusFile),{recursive:true});
  fs.writeFileSync(statusFile,JSON.stringify({success:true,collectedAt:snapshot.generatedAt,commit,tasks:snapshot.tasks.length,push},null,2));
  console.log(`Snapshots privado e público sem tarefas conferidos: ${snapshot.generatedAt}`);
 }catch{
  fs.mkdirSync(path.dirname(statusFile),{recursive:true});
  fs.writeFileSync(statusFile,JSON.stringify({success:false,attemptedAt:new Date().toISOString(),previousSnapshotPreserved:true},null,2));
  console.error('Falha de coleta; preservado o último snapshot.');
 }
 if(!stopped)setTimeout(once,interval);
}
process.on('SIGINT',()=>{stopped=true;process.exit(0)});process.on('SIGTERM',()=>{stopped=true;process.exit(0)});
once();
