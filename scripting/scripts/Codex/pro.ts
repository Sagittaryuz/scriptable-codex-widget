import { Snapshot, stale, taskPresentation, taskSourceLabel, resetLabel, windowLabel } from './model'
import { dashboardStatus } from './pro-common'
export function summary(snapshot:Snapshot){
  return {collectedAt:snapshot.generatedAt,coverage:snapshot.coverage,usageOld:stale(snapshot.usageObservedAt),
    limits:snapshot.windows.map(w=>({window:windowLabel(w),remaining:w.remainingPercent,reset:resetLabel(w)})),
    tasks:snapshot.tasks.map(t=>({title:t.title,source:taskSourceLabel(t),state:taskPresentation(t).label,detail:t.detail,observedAt:t.observedAt}))}
}
export function pendingTasks(snapshot:Snapshot){return snapshot.tasks.filter(t=>!stale(t.observedAt)&&['approval','input','error'].includes(t.state))}
export async function notifyChanges(snapshot:Snapshot){
  dashboardStatus('Codex',{at:Date.parse(snapshot.generatedAt),label:`${snapshot.tasks.length} tarefas · ${pendingTasks(snapshot).length} pendências observadas`})
  if(Storage.get('codex-alerts')!==true)return
  if(stale(snapshot.tasksObservedAt))return
  const previous=Storage.get<Record<string,string>>('codex-alert-baseline-v2')
  const current=Object.fromEntries(snapshot.tasks.filter(t=>!stale(t.observedAt)).map(t=>[t.id,t.state]))
  if(previous){
    for(const task of pendingTasks(snapshot))if(previous[task.id]!==task.state){
      await Notification.schedule({title:'Codex precisa de você',body:taskPresentation(task).label,
        threadIdentifier:'codex-pending',tapAction:{type:'runScript',scriptName:'Codex'}})
      previous[task.id]=task.state
      if(!Storage.set('codex-alert-baseline-v2',previous))throw Error('Falha ao guardar o alerta enviado.')
    }
  }
  if(!Storage.set('codex-alert-baseline-v2',{...previous,...current}))throw Error('Falha ao guardar o estado dos alertas.')
}
