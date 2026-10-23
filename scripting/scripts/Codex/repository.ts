import { fetch } from 'scripting';
import { Snapshot, validateSnapshot } from './model';
import seed from './seed.json';
export const REPO='Sagittaryuz/scriptable-codex-widget';
export const DATA_REF='widget-data';
export const DATA_URL=`https://raw.githubusercontent.com/${REPO}/${DATA_REF}/data/scripting.json`;
const CACHE='codex-widget-snapshot-v2';
export function lastSnapshot():Snapshot {
 const cached=Storage.get<unknown>(CACHE);
 try{if(cached)return validateSnapshot(cached)}catch{}
 return validateSnapshot(seed);
}
export async function refreshSnapshot():Promise<{snapshot:Snapshot;offline:boolean;reason:string}>{
 try{
  const response=await fetch(DATA_URL,{
   headers:{Accept:'application/json','Cache-Control':'no-cache'},timeout:8,
   handleRedirect:async()=>null
  });
  if(!response.ok)throw Error(`GitHub ${response.status}`);
  const text=await response.text();if(text.length>60000)throw Error('Snapshot excede o limite.');
  const snapshot=validateSnapshot(JSON.parse(text));
  const cached=lastSnapshot();
  if(Date.parse(snapshot.generatedAt)<Date.parse(cached.generatedAt))throw Error('Snapshot anterior ao cache.');
  if(Date.parse(snapshot.generatedAt)>Date.now()+60000)throw Error('Horário do snapshot inválido.');
  if(!Storage.set(CACHE,snapshot))throw Error('Não foi possível conservar o snapshot.');
  return {snapshot,offline:false,reason:''};
 }catch(error){
  // Never log request objects or private snapshot content.
  const message=error instanceof Error?error.message:'Falha na consulta';
  return {snapshot:lastSnapshot(),offline:true,reason:message.includes('GitHub')?message:'Sem rede · cache preservado'};
 }
}
