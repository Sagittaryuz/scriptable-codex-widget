const os=require('node:os');
const {validateSnapshot}=require('../scripting/scripts/Codex/model.ts');
function windowsFromUsage(usage){
 const bucket=usage.rateLimitsByLimitId?.codex||usage.rateLimits;
 if(!bucket)throw Error('Limite Codex não disponível.');
 return [bucket.primary,bucket.secondary].filter(Boolean).map(w=>({usedPercent:w.usedPercent,remainingPercent:Math.max(0,Math.min(100,100-w.usedPercent)),windowDurationMins:w.windowDurationMins,resetsAt:w.resetsAt??null}));
}
function resetCreditsFromUsage(usage,observedAt){
 const summary=usage?.rateLimitResetCredits;
 if(!summary||typeof summary!=='object'||Array.isArray(summary)||!Number.isSafeInteger(summary.availableCount)||summary.availableCount<0)return;
 // The backend may cap/omit details. Its availableCount is authoritative, never credits.length.
 let expiresAt=null;
 if(summary.availableCount===1&&Array.isArray(summary.credits)&&summary.credits.length===1){
  const credit=summary.credits[0];
  if(credit?.status==='available'&&credit.resetType==='codexRateLimits'&&Number.isSafeInteger(credit.expiresAt)){
   const date=new Date(credit.expiresAt*1000);if(Number.isFinite(date.getTime()))expiresAt=date.toISOString();
  }
 }
 return {availableCount:summary.availableCount,observedAt,source:'Codex App Server account/rateLimits/read',expiresAt};
}
function safeHostLabel(value){return typeof value==='string'?value.replace(/[\x00-\x1f<>:"\/\\|?*]/g,'').trim().slice(0,40):''}
function threadOrigin(thread,localHost=os.hostname()){
 if(thread.kind==='chatgpt'||thread.originator==='ChatGPT')return {origin:'ChatGPT'};
 if(thread.hostId==='durable'||thread.source==='cloud'||thread.threadSource==='cloud')return {origin:'Cloud'};
 if(thread.hostId&&thread.hostId!=='local')return {origin:'Remoto',hostLabel:safeHostLabel(thread.hostLabel||thread.hostName)||'Máquina remota'};
 return {origin:'Local',hostLabel:safeHostLabel(localHost)||'Este computador'};
}
function taskFromThread(thread,turn,observedAt,localHost=os.hostname()){
 let state='unknown',detail='Estado não confirmado';
 if(thread.status?.type==='active'){
  const f=thread.status.activeFlags||[];
  state=f.includes('waitingOnApproval')?'approval':f.includes('waitingOnUserInput')?'input':'running';detail='Estado do App Server';
 }else if(thread.status?.type==='systemError'){state='error';detail='Erro do App Server';}
 else if(turn?.status==='failed'){state='error';detail='Último turno falhou';}
 else if(turn?.status==='completed'){state='ready';detail='Último turno concluído';}
 else if(turn?.status==='interrupted'){state='idle';detail='Último turno interrompido';}
 else if(turn?.status==='inProgress'){state='unknown';detail='Último registro: em execução';}
 else if(thread.status?.type==='idle'){state='idle';detail='Ociosa no App Server';}
 // A separate server does not own the desktop runtime. Do not invent approval/running states.
 return {id:thread.id,title:(typeof thread.name==='string'&&thread.name.trim()?thread.name:'Conversa sem título').slice(0,500),state,observedAt,...threadOrigin(thread,localHost),detail};
}
function makeSnapshot(usage,threads,turns,now=new Date(),localHost=os.hostname()){
 const observedAt=now.toISOString(),resetCredits=resetCreditsFromUsage(usage,observedAt);
 return validateSnapshot({schemaVersion:2,generatedAt:observedAt,usageObservedAt:observedAt,tasksObservedAt:observedAt,coverage:'Lista local completa · último turno; runtime do app separado',windows:windowsFromUsage(usage),tasks:threads.filter(t=>!t.parentThreadId).map(t=>taskFromThread(t,turns.get(t.id),observedAt,localHost)),...(resetCredits?{resetCredits}:{})});
}
module.exports={windowsFromUsage,resetCreditsFromUsage,threadOrigin,taskFromThread,makeSnapshot};
