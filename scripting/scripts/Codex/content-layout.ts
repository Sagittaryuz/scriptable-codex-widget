// height is the content area above the unchanged 17pt footer; fullHeight is physical widget height.
export function referenceLayout(family:string,width:number,height:number,fullHeight=height+17){
 if(!Number.isFinite(width)||!Number.isFinite(height)||!Number.isFinite(fullHeight)||width<120||height<110)throw Error('Dimensões inválidas')
 const small=family==='systemSmall',large=family==='systemLarge'
 const side=small?8:10,top=large?16:8,contentWidth=width-side*2,contentHeight=height-top*2
 const bar=large?4:3,quota=large?8.5:6,barY=fullHeight/2-top,summaryHeight=quota*1.2
 const header=barY+bar/2+2+summaryHeight+3,row=(contentHeight-header)/3
 const rowTextGap=row<26?0:3,baseTitle=small?9.5:large?13.5:11.5,baseMeta=small?6.5:large?10.5:7.5
 const textScale=Math.min(1,(row-4-rowTextGap)/(1.2*(baseTitle+baseMeta)))
 return {small,large,left:side,top,width:contentWidth,height:contentHeight,header,row,bar,quota,barY,summaryHeight,rowTextGap,
  icon:Math.min(large?38:small?22:25,row-4),rowGap:row<26?3:large?12:8,
  rowInset:small?0:large?8:4,title:baseTitle*textScale,meta:baseMeta*textScale,
  badgeWidth:small?33:large?56:54,badgeHeight:Math.min(small?14:large?26:19,row-4),badgeFont:Math.min(small?7:large?11.5:9,(row-4)/1.2),
  chevron:small?4:large?9:6}
}
