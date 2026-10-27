// Rounded 31x29 units in a 971-unit line; fixed red-left / green-right gradient.
// One point is 100/23 (~4.35%) of the balance; retain the exact boundary fraction.
// Unknown/stale observations have no current balance, never a fabricated zero.
export const QUOTA_DOT_COUNT=23
function positionColor(position:number){
 const red=[0xff,0x45,0x3a],yellow=[0xff,0xd6,0x0a],green=[0x30,0xd1,0x58]
 const a=position<=50?red:yellow,b=position<=50?yellow:green,mix=position<=50?position/50:(position-50)/50
 return '#'+a.map((channel,index)=>Math.round(channel+(b[index]-channel)*mix).toString(16).padStart(2,'0')).join('')
}
const colors=Array.from({length:QUOTA_DOT_COUNT},(_,index)=>positionColor(index*100/(QUOTA_DOT_COUNT-1)))
const historicalColors=colors.map(color=>'#'+[0,1,2].map((_,index)=>Math.round(parseInt(color.slice(1+index*2,3+index*2),16)*.75+[0x69,0x69,0x6e][index]*.25).toString(16).padStart(2,'0')).join(''))
export function quotaDotGeometry(width:number){return {width:width*31/971,height:width*29/971,radius:width*10/971}}
export function quotaDots(remaining:number|null|undefined,old=false,showHistorical=false){
 const known=typeof remaining==='number'&&Number.isFinite(remaining)&&remaining>=0&&remaining<=100
 const current=known&&!old
 const historical=known&&old&&showHistorical,represented=current||historical,palette=historical?historicalColors:colors
 const raw=represented?QUOTA_DOT_COUNT*remaining/100:null,nearest=raw==null?0:Math.round(raw)
 // Correct floating-point noise only at nonzero integer boundaries; never snap tiny positive
 // balances to zero. This is numeric tolerance, not balance rounding.
 const filled=raw==null?null:nearest>0&&Math.abs(raw-nearest)<=Number.EPSILON*QUOTA_DOT_COUNT*4?nearest:raw
 const fractions=Array.from({length:QUOTA_DOT_COUNT},(_,index)=>filled==null?0:Math.max(0,Math.min(1,filled-index)))
 const active=filled==null?null:Math.ceil(filled)
 const inactive=represented?'#303033':'#69696E'
 // The balance label uses the actual final lit bucket; zero uses the red scale endpoint.
 return {count:QUOTA_DOT_COUNT,active,filled,fractions,colors:palette,inactive,current,historical,balanceColor:active==null?inactive:palette[Math.max(0,active-1)]}
}
