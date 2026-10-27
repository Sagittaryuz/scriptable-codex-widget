import { lastSnapshot, refreshSnapshot } from './repository'
type Result=Awaited<ReturnType<typeof refreshSnapshot>>
export const TAP_REFRESH_TIMEOUT_MS=1500
export const TAP_CACHE_MS=5000
const KEY='codex-tap-refresh-v1'
let pending:Promise<Result>|null=null
function prepared():Result|null {
 const value=Storage.get<{at:number;generatedAt:string;offline:boolean}>(KEY),now=Date.now()
 if(!value||typeof value.at!=='number'||!Number.isFinite(value.at)||now<value.at||now-value.at>TAP_CACHE_MS||typeof value.offline!=='boolean')return null
 const snapshot=lastSnapshot()
 return snapshot.generatedAt===value.generatedAt?{snapshot,offline:value.offline,reason:value.offline?'Cache preservado após o toque.':''}:null
}
export function snapshotForWidget():Promise<Result>{
 return Promise.resolve(prepared()??refreshSnapshot())
}
export function refreshForTap():Promise<Result>{
 if(pending)return pending
 pending=(async()=>{
  const recent=prepared();if(recent)return recent
  let timer:ReturnType<typeof setTimeout>|undefined
  let result:Result
  try{
   result=await Promise.race([refreshSnapshot({timeoutMs:TAP_REFRESH_TIMEOUT_MS}),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(Error('tap-timeout')),TAP_REFRESH_TIMEOUT_MS)})])
  }catch{result={snapshot:lastSnapshot(),offline:true,reason:'Tempo de consulta limitado; cache preservado.'}}
  finally{if(timer!==undefined)clearTimeout(timer)}
  // Retrieval time is separate from the original observation dates. The provider can reuse this
  // prepared cache briefly, without a second download after the external app opens.
  Storage.set(KEY,{at:Date.now(),generatedAt:result.snapshot.generatedAt,offline:result.offline})
  return result
 })().finally(()=>{pending=null})
 return pending
}
