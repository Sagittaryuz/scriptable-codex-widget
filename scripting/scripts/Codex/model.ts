export type TaskState = 'running'|'approval'|'input'|'error'|'ready'|'idle'|'unknown';
export const MAX_TASKS=1000;
export interface Task {id:string;title:string;state:TaskState;observedAt:string;origin:string;hostLabel?:string;detail:string;url?:string}
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
 if(raw.tasks.length>MAX_TASKS)throw Error('Lista excede o limite de segurança; nenhuma tarefa foi cortada.');
 const tasks:Task[]=raw.tasks.map(t=>{
  if(!record(t)||typeof t.id!=='string'||!/^[\w-]{1,100}$/.test(t.id)||seen.has(t.id)||typeof t.title!=='string'||!t.title.trim()||typeof t.state!=='string'||!Object.prototype.hasOwnProperty.call(STATES,t.state)||!date(t.observedAt))throw Error('Tarefa inválida.');
  seen.add(t.id);
  const hostLabel=typeof t.hostLabel==='string'?t.hostLabel.replace(/[\x00-\x1f<>:"\/\\|?*]/g,'').trim().slice(0,40):'';
  return {id:t.id,title:t.title.replace(/[\x00-\x1f]/g,' ').trim().slice(0,500),state:t.state as TaskState,observedAt:t.observedAt as string,origin:typeof t.origin==='string'?t.origin.slice(0,30):'Codex',...(hostLabel?{hostLabel}:{}),detail:typeof t.detail==='string'?t.detail.slice(0,160):'',...(safeTaskURL(t.url)?{url:t.url as string}:{})};
 });
 return {schemaVersion:2,generatedAt:raw.generatedAt as string,usageObservedAt:raw.usageObservedAt as string,tasksObservedAt:raw.tasksObservedAt as string,coverage:typeof raw.coverage==='string'?raw.coverage.slice(0,100):'Não confirmada',windows,tasks};
}
export function windowLabel(window:Window){const m=window.windowDurationMins;return m===10080?'Semanal':m===300?'5 horas':m%1440===0?`${m/1440} dias`:m%60===0?`${m/60} horas`:`${m} min`}
export function quotaColor(remaining:number|null|undefined,isStale=false){
 if(isStale||remaining==null)return '#96969C';
 if(remaining>=70)return '#30D158';
 if(remaining>=40)return '#4BAEFF';
 if(remaining>=20)return '#FFBD2E';
 return '#FF4B55';
}
export const CHATGPT_URL='chatgpt://';
export const CHATGPT_WEB_URL='https://chatgpt.com/';
export function safeTaskURL(value:unknown):value is string {
 return typeof value==='string'&&/^https:\/\/chatgpt\.com\/(?:c|codex\/tasks|codex\/cloud\/tasks)\/(?:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}|task_[a-z]_[a-f0-9]{32})$/i.test(value);
}
export function taskURL(task:Task):string {
 if(safeTaskURL(task.url))return task.url;
 if(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(task.id)){
  if(task.origin==='Cloud')return `${CHATGPT_WEB_URL}codex/cloud/tasks/${task.id}`;
  if(['Local','Remoto','Codex'].includes(task.origin))return `${CHATGPT_WEB_URL}codex/tasks/${task.id}`;
  if(task.origin==='ChatGPT')return `${CHATGPT_WEB_URL}c/${task.id}`;
 }
 return CHATGPT_WEB_URL;
}
export function taskSourceLabel(task:Task){
 if(task.origin==='ChatGPT')return 'ChatGPT';
 if(task.origin==='Cloud')return 'Codex · Nuvem';
 if(task.origin==='Remoto')return `Codex · ${task.hostLabel||'Máquina remota'}`;
 if(task.origin==='Local')return `Codex · ${task.hostLabel||'Este computador'}`;
 return task.hostLabel?`Codex · ${task.hostLabel}`:'Codex';
}
export function ageLabel(iso:string,now=Date.now()){
 const min=Math.max(0,Math.floor((now-Date.parse(iso))/60000));
 return min<1?'agora':min<60?`há ${min} min`:min<1440?`há ${Math.floor(min/60)} h`:`há ${Math.floor(min/1440)} d`;
}
export function resetLabel(window:Window,now=Date.now()){
 if(window.resetsAt==null)return 'Reinício indisponível';
 const minutes=Math.ceil((window.resetsAt*1000-now)/60000);
 if(minutes<=0)return 'Reinício pendente';
 if(minutes<60)return `Reinicia em ${minutes} min`;
 if(minutes<1440){const hours=Math.ceil(minutes/60);return `Reinicia em ${hours} ${hours===1?'hora':'horas'}`;}
 const days=Math.ceil(minutes/1440);return `Reinicia em ${days} ${days===1?'dia':'dias'}`;
}
export function stale(iso:string,now=Date.now()){return now-Date.parse(iso)>15*60000||Date.parse(iso)>now+60000}
export function taskPresentation(task:Task,now=Date.now()){
 if(stale(task.observedAt,now))return {...STATES.unknown,label:'Estado antigo',short:'Antigo'};
 return STATES[task.state];
}
export function matchesFilter(task:Task,filter:string,now=Date.now()){
 if(filter==='Todas')return true;
 if(stale(task.observedAt,now))return false;
 return filter==='Pendências'?['approval','input','error'].includes(task.state):filter==='Execução'&&task.state==='running';
}
export function dimensions(family:string,height:number){
 const small=family==='systemSmall',large=family==='systemLarge';
 const count=3;
 const safeHeight=Number.isFinite(height)&&height>100?height:large?360:170;
 const header=large?58:44,footer=0,row=Math.max(24,Math.min(large?94:40,(safeHeight-header)/count));
 return {small,large,count,header,footer,row,title:large?14:10.5,meta:large?9:7,icon:large?36:28,status:large?12:10.5,headerTitle:large?17:14,quota:large?16:12.5,reset:large?9:7.5,codexIcon:large?28:22};
}

