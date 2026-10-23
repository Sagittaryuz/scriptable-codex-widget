const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const {stale,taskURL}=require('../scripting/scripts/Codex/model.ts');
const stateFile=path.resolve(__dirname,'../work/push-state-v2.json');
function transitions(snapshot,previous){
 if(stale(snapshot.tasksObservedAt))return [];
 if(!previous)return [];
 return snapshot.tasks.filter(t=>!stale(t.observedAt)&&['approval','input','error'].includes(t.state)&&previous[t.id]!==t.state);
}
function readKey(){
 const r=cp.spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',path.join(__dirname,'configure-push.ps1'),'-Read'],{encoding:'utf8',windowsHide:true,timeout:10000});
 if(r.status!==0)throw Error('Chave do push indisponível.');return r.stdout.trim();
}
function save(state,file=stateFile){fs.mkdirSync(path.dirname(file),{recursive:true});const temp=file+'.tmp';fs.writeFileSync(temp,JSON.stringify(state));fs.renameSync(temp,file)}
async function notify(snapshot,{key,fetcher=fetch,file=stateFile}={}){
 key??=readKey();if(!key)return {configured:false,sent:0};
 let previous=null;try{previous=JSON.parse(fs.readFileSync(file,'utf8'))}catch(error){if(error.code!=='ENOENT')throw Error('Estado do push inválido; envio suspenso.')}
 if(stale(snapshot.tasksObservedAt))return {configured:true,sent:0,stale:true};
 const current={...(previous||{})};let sent=0;
 for(const task of transitions(snapshot,previous)){
  const label={approval:'Uma tarefa aguarda sua aprovação.',input:'Uma tarefa aguarda sua resposta.',error:'Uma tarefa registrou erro.'}[task.state];
  // Generic text keeps task titles out of the push provider and lock screen.
  const response=await fetcher('https://push.scripting.fun/push',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},
   body:JSON.stringify({title:'Codex',body:label,action:taskURL(task),threadId:'codex-pending',icon:'terminal'}),signal:AbortSignal.timeout(10000)});
  const result=await response.json();
  const deliveries=result.data?.results;
  if(!response.ok||result.ok!==true||!Array.isArray(deliveries)||!deliveries.some(d=>d.status==='sent'))throw Error('Entrega do push não confirmada.');
  current[task.id]=task.state;save(current,file);sent++;
 }
 for(const t of snapshot.tasks)if(!stale(t.observedAt))current[t.id]=t.state;
 save(current,file);return {configured:true,sent};
}
module.exports={transitions,notify};
