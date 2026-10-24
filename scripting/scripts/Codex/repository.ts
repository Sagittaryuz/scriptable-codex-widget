import { fetch } from 'scripting';
import { Snapshot, validateSnapshot } from './model';
import seed from './seed.json';
import { mergeSources } from './sources';
export const REPO='Sagittaryuz/scriptable-codex-widget';
export const DATA_REF='widget-data';
export const DATA_URL=`https://raw.githubusercontent.com/${REPO}/${DATA_REF}/data/scripting.json`;
export const PRIVATE_REPO='codex-widget-private-data';
const CACHE='codex-widget-snapshot-v2';
async function bounded<T>(promise:Promise<T>,ms:number):Promise<T>{
 let timer:ReturnType<typeof setTimeout>|undefined;
 try{return await Promise.race([promise,new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(Error('Tempo de consulta excedido.')),ms)})])}
 finally{if(timer!==undefined)clearTimeout(timer)}
}
export function lastSnapshot():Snapshot {
 const cached=Storage.get<unknown>(CACHE);
 try{if(cached)return validateSnapshot(cached)}catch{}
 return validateSnapshot(seed);
}
type Result={snapshot:Snapshot;offline:boolean;reason:string};
let pending:Promise<Result>|null=null;
export function refreshSnapshot():Promise<Result>{
 if(pending)return pending;
 pending=readSnapshot().finally(()=>{pending=null});return pending;
}
async function readSnapshot():Promise<Result>{
 let privateRequested=false;
 try{
  const usePrivate=Storage.get('codex-private-data')!==false&&typeof GitHub!=='undefined'&&GitHub.isAvailable();
  if(!usePrivate&&Storage.get('codex-private-data')!==false){
   const cached=lastSnapshot();
   if(cached.tasks.length)return {snapshot:cached,offline:true,reason:'GitHub privado indisponível · último registro preservado.'};
  }
  let text:string;
  if(usePrivate){
   privateRequested=true;
   const names=['local','cloud'] as const;
   const previous=lastSnapshot();
   const results=await Promise.allSettled(names.map(async name=>{
    const file=await bounded(GitHub.getTextContent({owner:'Sagittaryuz',repo:PRIVATE_REPO,path:name==='local'?'data/scripting.json':'data/cloud.json'}),6000);
    if(typeof file.text!=='string'||file.text.length>900000)throw Error('Resposta excessiva.');
    const value=validateSnapshot(JSON.parse(file.text)),key=CACHE+':'+name,cached=Storage.get<Snapshot>(key);
    if(Date.parse(value.generatedAt)>Date.now()+60000||cached&&Date.parse(value.generatedAt)<Date.parse(cached.generatedAt))throw Error('Observação inválida.');
    if(name==='cloud'&&value.tasks.some(t=>t.origin!=='Cloud'))throw Error('Origem inválida.');
    Storage.set(key,value);return value;
   }));
   const values=results.map((result,i)=>{
    if(result.status==='fulfilled')return result.value;
    try{const cached=Storage.get<Snapshot>(CACHE+':'+names[i]);if(cached)return validateSnapshot(cached)}catch{}
    const tasks=previous.tasks.filter(t=>i===0?t.origin!=='Cloud':t.origin==='Cloud');
    return tasks.length?{...previous,tasks}:null;
   });
   const snapshot=mergeSources(values[0],values[1]);
   if(!Storage.set(CACHE,snapshot))throw Error('Falha no cache.');
   return {snapshot,offline:results.every(r=>r.status==='rejected'),reason:results.some(r=>r.status==='rejected')?'Cobertura parcial · fonte indisponível conserva o último registro.':''};
  }else{
   text=await bounded((async()=>{const response=await fetch(DATA_URL,{
   headers:{Accept:'application/json','Cache-Control':'no-cache'},timeout:8,
   handleRedirect:async()=>null
  });
  if(!response.ok)throw Error(`GitHub ${response.status}`);
   return response.text();})(),8000);
  }
  if(typeof text!=='string'||text.length>900000)throw Error('Snapshot excede o limite.');
  const snapshot=validateSnapshot(JSON.parse(text));
  const cached=lastSnapshot();
  if(Date.parse(snapshot.generatedAt)<Date.parse(cached.generatedAt))throw Error('Snapshot anterior ao cache.');
  if(Date.parse(snapshot.generatedAt)>Date.now()+60000)throw Error('Horário do snapshot inválido.');
  if(!Storage.set(CACHE,snapshot))throw Error('Não foi possível conservar o snapshot.');
  return {snapshot,offline:false,reason:''};
 }catch(error){
  // Never log request objects or private snapshot content.
  const message=error instanceof Error?error.message:'Falha na consulta';
  return {snapshot:lastSnapshot(),offline:true,reason:privateRequested?'Dados privados indisponíveis · abra Codex no Scripting e conecte o GitHub. Cache preservado.':message.includes('GitHub')?message:'Sem rede · cache preservado'};
 }
}
