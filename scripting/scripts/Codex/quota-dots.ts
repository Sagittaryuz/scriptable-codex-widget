// Rounded 31x29 units in a 971-unit line; all lit dots show the remaining balance.
// Round 23 buckets (~4.35% each), preserving a partial final dot for 0<r<100.
// Unknown/stale observations have no current balance, never a fabricated zero.
export const QUOTA_DOT_COUNT=23
function balanceColor(remaining:number){
 const red=[0xff,0x45,0x3a],yellow=[0xff,0xd6,0x0a],green=[0x30,0xd1,0x58]
 const a=remaining<=50?red:yellow,b=remaining<=50?yellow:green,mix=remaining<=50?remaining/50:(remaining-50)/50
 return '#'+a.map((channel,index)=>Math.round(channel+(b[index]-channel)*mix).toString(16).padStart(2,'0')).join('')
}
export function quotaDotGeometry(width:number){return {width:width*31/971,height:width*29/971,radius:width*10/971}}
export function quotaDots(remaining:number|null|undefined,old=false){
 const known=typeof remaining==='number'&&Number.isFinite(remaining)&&remaining>=0&&remaining<=100
 const current=known&&!old
 const active=current?(remaining===0?0:remaining===100?QUOTA_DOT_COUNT:Math.max(1,Math.min(QUOTA_DOT_COUNT-1,Math.round(QUOTA_DOT_COUNT*remaining/100)))):null
 const color=current?balanceColor(remaining):'#69696E'
 return {count:QUOTA_DOT_COUNT,active,color,colors:Array.from({length:active??0},()=>color),inactive:current?'#303033':'#69696E'}
}
