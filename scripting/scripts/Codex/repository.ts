import { fetch } from 'scripting';
import { Snapshot, validateSnapshot } from './model';
import seed from './seed.json';
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
export async function refreshSnapshot():Promise<{snapshot:Snapshot;offline:boolean;reason:string}>{
 let privateRequested=false;
 try{
  const usePrivate=Storage.get('codex-private-data')!==false&&typeof GitHub!=='undefined'&&GitHub.isAvailable();
  let text:string;
  if(usePrivate){
   privateRequested=true;
   const file=await bounded(GitHub.getTextContent({owner:'Sagittaryuz',repo:PRIVATE_REPO,path:'data/scripting.json'}),6000);
   text=file.text;
  }else{
   const response=await fetch(DATA_URL,{
   headers:{Accept:'application/json','Cache-Control':'no-cache'},timeout:8,
   handleRedirect:async()=>null
  });
  if(!response.ok)throw Error(`GitHub ${response.status}`);
   text=await response.text();
  }
  if(typeof text!=='string'||text.length>60000)throw Error('Snapshot excede o limite.');
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
