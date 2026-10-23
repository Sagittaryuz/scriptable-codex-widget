const {validateSnapshot}=require('../scripting/scripts/Codex/model.ts');
function windowsFromUsage(usage){
 const bucket=usage.rateLimitsByLimitId?.codex||usage.rateLimits;
 if(!bucket)throw Error('Limite Codex não disponível.');
 return [bucket.primary,bucket.secondary].filter(Boolean).map(w=>({usedPercent:w.usedPercent,remainingPercent:Math.max(0,Math.min(100,100-w.usedPercent)),windowDurationMins:w.windowDurationMins,resetsAt:w.resetsAt??null}));
}
function taskFromThread(thread,turn,observedAt){
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
 return {id:thread.id,title:(thread.name||'Tarefa sem título').slice(0,500),state,observedAt,origin:'Local',detail};
}
function makeSnapshot(usage,threads,turns,now=new Date()){
 const observedAt=now.toISOString();
 return validateSnapshot({schemaVersion:2,generatedAt:observedAt,usageObservedAt:observedAt,tasksObservedAt:observedAt,coverage:'Histórico local · último turno; runtime do app separado',windows:windowsFromUsage(usage),tasks:threads.filter(t=>!t.parentThreadId&&t.name).slice(0,20).map(t=>taskFromThread(t,turns.get(t.id),observedAt))});
}
module.exports={windowsFromUsage,taskFromThread,makeSnapshot};
