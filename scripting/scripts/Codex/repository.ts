import { Keychain, fetch } from 'scripting';
import { Snapshot, validateSnapshot } from './model';
import seed from './seed.json';
export const REPO='Sagittaryuz/scriptable-codex-widget';
export const DATA_REF='widget-data';
const TOKEN='codex-widget-github-readonly';
const CACHE='codex-widget-snapshot-v2';
export const readToken=()=>Keychain.get(TOKEN);
export function saveToken(token:string){if(!token.trim()||!Keychain.set(TOKEN,token.trim()))throw Error('Não foi possível guardar o acesso no Keychain.');}
export function lastSnapshot():Snapshot {
 const cached=Storage.get<unknown>(CACHE);
 try{if(cached)return validateSnapshot(cached)}catch{}
 return validateSnapshot(seed);
}
export async function refreshSnapshot():Promise<{snapshot:Snapshot;offline:boolean;reason:string}>{
 const token=readToken();
 if(!token)return {snapshot:lastSnapshot(),offline:true,reason:'Sem acesso GitHub · snapshot de instalação'};
 try{
  const response=await fetch(`https://api.github.com/repos/${REPO}/contents/data/scripting.json?ref=${DATA_REF}`,{
   headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github.raw+json','X-GitHub-Api-Version':'2022-11-28'},timeout:8,
   handleRedirect:async()=>null
  });
  if(!response.ok)throw Error(response.status===401||response.status===403?'Reveja o acesso GitHub':`GitHub ${response.status}`);
  const text=await response.text();if(text.length>60000)throw Error('Snapshot excede o limite.');
  const snapshot=validateSnapshot(JSON.parse(text));
  const cached=lastSnapshot();
  if(Date.parse(snapshot.generatedAt)<Date.parse(cached.generatedAt))throw Error('Snapshot anterior ao cache.');
  if(Date.parse(snapshot.generatedAt)>Date.now()+60000)throw Error('Horário do snapshot inválido.');
  if(!Storage.set(CACHE,snapshot))throw Error('Não foi possível conservar o snapshot.');
  return {snapshot,offline:false,reason:''};
 }catch(error){
  // Never log request objects or credentials.
  const message=error instanceof Error?error.message:'Falha na consulta';
  return {snapshot:lastSnapshot(),offline:true,reason:message.includes('GitHub')?message:'Sem rede · cache preservado'};
 }
}
