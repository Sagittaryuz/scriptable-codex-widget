export type TaskState = 'running'|'approval'|'input'|'error'|'ready'|'idle'|'unknown';
export interface Task {id:string;title:string;state:TaskState;observedAt:string;origin:string;detail:string}
export interface Window {usedPercent:number;remainingPercent:number;windowDurationMins:number;resetsAt:number|null}
export interface Snapshot {schemaVersion:2;generatedAt:string;usageObservedAt:string;tasksObservedAt:string;coverage:string;windows:Window[];tasks:Task[]}
export const STATES:Record<TaskState,{label:string;short:string;symbol:string;color:string}>={
 running:{label:'Em execução',short:'Executando',symbol:'play.fill',color:'#2698ff'},
 approval:{label:'Sua aprovação',short:'Aprovação',symbol:'hand.raised.fill',color:'#ffbd2e'},
 input:{label:'Sua resposta',short:'Resposta',symbol:'text.bubble.fill',color:'#ffbd2e'},
 error:{label:'Erro',short:'Erro',symbol:'exclamationmark',color:'#ff4b55'},
 ready:{label:'Resposta pronta',short:'Pronta',symbol:'checkmark',color:'#21d986'},
 idle:{label:'Ociosa',short:'Ociosa',symbol:'pause.fill',color:'#a1a1a8'},
 unknown:{label:'Não confirmado',short:'Sem estado',symbol:'questionmark',color:'#a1a1a8'}
};
const record=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const date=(x:unknown)=>typeof x==='string'&&Number.isFinite(Date.parse(x));
const percent=(x:unknown):x is number=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=100;
export function validateSnapshot(raw:unknown):Snapshot {
 if(!record(raw)||raw.schemaVersion!==2||!date(raw.generatedAt)||!date(raw.usageObservedAt)||!date(raw.tasksObservedAt)||!Array.isArray(raw.windows)||!Array.isArray(raw.tasks))throw Error('Snapshot inválido.');
 const windows:Window[]=raw.windows.map(w=>{
  if(!record(w)||!percent(w.usedPercent)||!percent(w.remainingPercent)||Math.abs(w.usedPercent+w.remainingPercent-100)>.01||typeof w.windowDurationMins!=='number'||!Number.isFinite(w.windowDurationMins)||w.windowDurationMins<=0||(w.resetsAt!==null&&(typeof w.resetsAt!=='number'||!Number.isFinite(w.resetsAt))))throw Error('Limite inválido.');
  return {usedPercent:w.usedPercent,remainingPercent:w.remainingPercent,windowDurationMins:w.windowDurationMins,resetsAt:w.resetsAt as number|null};
 });
 const seen=new Set<string>();
 const tasks:Task[]=raw.tasks.slice(0,20).map(t=>{
  if(!record(t)||typeof t.id!=='string'||!/^[\w-]{1,100}$/.test(t.id)||seen.has(t.id)||typeof t.title!=='string'||!t.title.trim()||typeof t.state!=='string'||!Object.prototype.hasOwnProperty.call(STATES,t.state)||!date(t.observedAt))throw Error('Tarefa inválida.');
  seen.add(t.id);
  return {id:t.id,title:t.title.replace(/[\x00-\x1f]/g,' ').trim().slice(0,500),state:t.state as TaskState,observedAt:t.observedAt as string,origin:typeof t.origin==='string'?t.origin.slice(0,30):'Codex',detail:typeof t.detail==='string'?t.detail.slice(0,160):''};
 });
 return {schemaVersion:2,generatedAt:raw.generatedAt as string,usageObservedAt:raw.usageObservedAt as string,tasksObservedAt:raw.tasksObservedAt as string,coverage:typeof raw.coverage==='string'?raw.coverage.slice(0,100):'Não confirmada',windows,tasks};
}
export function windowLabel(window:Window){return window.windowDurationMins===10080?'Semanal':window.windowDurationMins===300?'5 horas':window.windowDurationMins%1440===0?`${window.windowDurationMins/1440} dias`:`${Math.round(window.windowDurationMins/60)} horas`}
export function ageLabel(iso:string,now=Date.now()){
 const min=Math.max(0,Math.floor((now-Date.parse(iso))/60000));
 return min<1?'agora':min<60?`há ${min} min`:min<1440?`há ${Math.floor(min/60)} h`:`há ${Math.floor(min/1440)} d`;
}
export function stale(iso:string,now=Date.now()){return now-Date.parse(iso)>15*60000||Date.parse(iso)>now+60000}
export function taskPresentation(task:Task,now=Date.now()){
 if(stale(task.observedAt,now))return {...STATES.unknown,label:'Estado antigo',short:'Antigo'};
 return STATES[task.state];
}
export function dimensions(family:string,height:number){
 const small=family==='systemSmall',large=family==='systemLarge';
 const count=small?2:large?8:4;
 const safeHeight=Number.isFinite(height)&&height>100?height:large?360:170;
 // WidgetKit already supplies content margins; do not subtract them twice.
 const header=small?43:42,footer=12;
 const row=Math.max(19,Math.floor((safeHeight-header-footer-8)/count));
 return {small,large,count,header,footer,row,title:small?11.5:large?13:12,meta:small?8:large?9:8,icon:small?22:large?27:22};
}
