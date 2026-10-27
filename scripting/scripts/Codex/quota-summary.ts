import { referenceLayout } from './content-layout'
import { Snapshot, Window, resetCreditsPresentation } from './model'
// Date uses the widget's local timezone, like the existing quota formatter; never UTC slicing.
export function localCapsuleDate(value:number|string|null|undefined,now=Date.now()){
 if(value==null)return null
 const date=new Date(typeof value==='number'?value*1000:value)
 if(!Number.isFinite(date.getTime()))return null
 const day=date.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',...(date.getFullYear()!==new Date(now).getFullYear()?{year:'2-digit' as const}:{})})
 return `${day} ${date.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`
}
export function quotaCapsuleDates(snapshot:Snapshot,window:Window|undefined,old:boolean,now=Date.now()){
 const renewal=localCapsuleDate(window?.resetsAt,now),credits=resetCreditsPresentation(snapshot,now)
 // The 1.6.11 producer only proves an individual expiry for a single available credit.
 const expiry=credits.count===1?localCapsuleDate(snapshot.resetCredits?.expiresAt,now):null
 // Staleness is shown once by the small widget's history notice, not repeated in each capsule.
 return {renewal:renewal?`Renova ${renewal}`:'Data não informada',expiry:expiry?`Até ${expiry}`:'Validade não informada'}
}
// Equal capsules with two centered lines, wholly inside the existing reserve.
export function quotaSummaryLayout(layout:ReturnType<typeof referenceLayout>){
 const pointHeight=layout.width*29/971,top=layout.barY+pointHeight/2+.9
 const bottom=layout.height/2-layout.dividerHeight/2-.7,available=bottom-top
 const scale=Math.min(1,available/22),capsuleHeight=22*scale,columnWidth=(layout.width-6)/2,padding=3*scale
 const valueHeight=13.8*scale,dateHeight=6.48*scale,lineGap=.6*scale
 return {top,bottom,scale,labelFont:5.5*scale,valueFont:11.5*scale,dateFont:5.4*scale,capsuleHeight,columnGap:6,columnWidth,padding,contentWidth:columnWidth-padding*2,
  valueHeight,dateHeight,lineGap,textHeight:valueHeight+dateHeight+lineGap,inlineGap:1.5*scale,capsuleY:top+capsuleHeight/2}
}
