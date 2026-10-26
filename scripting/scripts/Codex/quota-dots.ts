// Twenty buckets of 5%; retain one lit dot for a positive final partial bucket.
// Unknown/stale observations have no current balance, never a fabricated zero.
export const QUOTA_DOT_COUNT=20
export function quotaDots(remaining:number|null|undefined,old=false){
 const known=typeof remaining==='number'&&Number.isFinite(remaining)&&remaining>=0&&remaining<=100
 const current=known&&!old
 const active=current?(remaining===0?0:Math.max(1,Math.floor(remaining/5))):null
 const color=!current?'#69696E':remaining>=70?'#30D158':remaining>=20?'#FFBD2E':'#FF4B55'
 return {count:QUOTA_DOT_COUNT,active,color,inactive:current?'#303033':'#69696E'}
}
