import { Task, stale } from './model'
// Ativos0.2.21 timePresentation: São Paulo civil day, HH:mm today, DD/MM otherwise,
// dagger for cached/historical metadata. Never use observedAt as a task-update fallback.
export function taskUpdatePresentation(task:Task,now=Date.now()){
 const at=typeof task.updatedAt==='string'?Date.parse(task.updatedAt):NaN
 if(!Number.isFinite(at)||at<=0||at>now||at>Date.parse(task.observedAt))return {text:'—',accessibility:'Atualização da tarefa não informada.',known:false}
 const date=new Date(at),today=new Date(now).toLocaleDateString('sv-SE',{timeZone:'America/Sao_Paulo'}),day=date.toLocaleDateString('sv-SE',{timeZone:'America/Sao_Paulo'})
 const value=day===today?date.toLocaleTimeString('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit'}):day.slice(8)+'/'+day.slice(5,7)
 const historical=stale(task.observedAt,now)||now-at>86400000
 return {text:value+(historical?'†':''),known:true,accessibility:`Atualização da tarefa: ${task.updatedAt}.${historical?' Registro histórico.':''}`}
}
