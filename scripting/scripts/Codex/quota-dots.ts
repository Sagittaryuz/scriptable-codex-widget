// Fixed positional gradient: consuming quota turns off the rightmost dots.
// Round 23 buckets (~4.35% each), preserving a partial final dot for 0<r<100.
// Unknown/stale observations have no current balance, never a fabricated zero.
export const QUOTA_DOT_COUNT=23
const stops=[[0,0x30,0xd1,0x58],[.45,0xff,0xd6,0x0a],[.7,0xff,0x9f,0x0a],[1,0xff,0x45,0x3a]]
export const QUOTA_DOT_COLORS=Array.from({length:QUOTA_DOT_COUNT},(_,index)=>{
 const t=index/(QUOTA_DOT_COUNT-1),right=stops.findIndex(s=>s[0]>=t),b=stops[Math.max(1,right)],a=stops[Math.max(1,right)-1],mix=(t-a[0])/(b[0]-a[0])
 return '#'+[1,2,3].map(channel=>Math.round(a[channel]+(b[channel]-a[channel])*mix).toString(16).padStart(2,'0')).join('')
})
export function quotaDots(remaining:number|null|undefined,old=false){
 const known=typeof remaining==='number'&&Number.isFinite(remaining)&&remaining>=0&&remaining<=100
 const current=known&&!old
 const active=current?(remaining===0?0:remaining===100?QUOTA_DOT_COUNT:Math.max(1,Math.min(QUOTA_DOT_COUNT-1,Math.round(QUOTA_DOT_COUNT*remaining/100)))):null
 return {count:QUOTA_DOT_COUNT,active,colors:QUOTA_DOT_COLORS,inactive:current?'#303033':'#69696E'}
}
