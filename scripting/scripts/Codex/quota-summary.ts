import { referenceLayout, shortcutLayout } from './content-layout'
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
export const HEADER_FRAME_STROKE=.6
// At146pt content width,15.5pt holds two readable lines plus centered vertical inset.
// The only adaptive movement is the point row when three equal gaps cannot fit that height.
export const CAPSULE_TEXT_METRICS={minHeight:15.5,valueFont:7.5,labelFont:4.5,dateFont:4.2,lineGap:.4}
export function quotaSummaryLayout(layout:ReturnType<typeof referenceLayout>){
 const pointHeight=layout.width*29/971,plan=shortcutLayout(layout.width,layout.header,layout.small,layout.large)
 // Stroke is centered on the icon-frame path: include its outer half in visual bounds.
 const iconBottom=plan.tileHeight+HEADER_FRAME_STROKE/2,dividerTop=layout.height/2-layout.dividerHeight/2
 const scale=Math.min(1,layout.width/146),referenceGap=layout.barY-pointHeight/2-iconBottom
 const minimumHeight=CAPSULE_TEXT_METRICS.minHeight*scale
 const gap=layout.small?Math.min(referenceGap,(dividerTop-iconBottom-pointHeight-minimumHeight)/3):referenceGap
 const pointY=layout.small?iconBottom+gap+pointHeight/2:layout.barY
 const top=pointY+pointHeight/2+gap,bottom=dividerTop-gap,capsuleHeight=bottom-top,columnWidth=(layout.width-6)/2,padding=3*scale
 const valueHeight=CAPSULE_TEXT_METRICS.valueFont*1.2*scale,dateHeight=CAPSULE_TEXT_METRICS.dateFont*1.2*scale,lineGap=CAPSULE_TEXT_METRICS.lineGap*scale
 return {top,bottom,scale,gap,referenceGap,pointY,iconBottom,dividerTop,minimumHeight,labelFont:CAPSULE_TEXT_METRICS.labelFont*scale,valueFont:CAPSULE_TEXT_METRICS.valueFont*scale,dateFont:CAPSULE_TEXT_METRICS.dateFont*scale,capsuleHeight,columnGap:6,columnWidth,padding,contentWidth:columnWidth-padding*2,
  valueHeight,dateHeight,lineGap,textHeight:valueHeight+dateHeight+lineGap,inlineGap:1.5*scale,capsuleY:top+capsuleHeight/2}
}
