// height is the content area above the unchanged 17pt footer; fullHeight is physical widget height.
export function referenceLayout(family:string,width:number,height:number,fullHeight=height+17){
 if(!Number.isFinite(width)||!Number.isFinite(height)||!Number.isFinite(fullHeight)||width<120||height<110)throw Error('Dimensões inválidas')
 const small=family==='systemSmall',large=family==='systemLarge'
 const side=small?8:10,top=large?16:8,contentWidth=width-side*2,contentHeight=height-top*2
 const plan=shortcutLayout(contentWidth,contentHeight,small,large)
 const bar=large?4:3,quota=large?8.5:6,aboveBar=small?5:8,belowBar=small?3:5,afterSummary=small?5:8
 const barY=plan.tileHeight+aboveBar+bar/2,summaryHeight=quota*1.2
 const header=barY+bar/2+belowBar+summaryHeight+afterSummary,row=(contentHeight-header)/3
 const rowTextGap=row<26?0:3,baseTitle=small?9.5:large?15.5:11.5,baseMeta=small?6.5:large?11.5:7.5
 const textScale=Math.min(1,(row-4-rowTextGap)/(1.2*(baseTitle+baseMeta)))
 return {small,large,left:side,top,width:contentWidth,height:contentHeight,header,row,bar,quota,barY,summaryHeight,rowTextGap,aboveBar,belowBar,afterSummary,
  icon:Math.min(large?40:small?22:25,row-4),rowGap:row<26?3:large?12:8,
  rowInset:small?0:large?8:4,title:baseTitle*textScale,meta:baseMeta*textScale,
  badgeWidth:small?33:large?56:54,badgeHeight:Math.min(small?14:large?26:19,row-4),badgeFont:Math.min(small?7:large?11.5:9,(row-4)/1.2),
  chevron:small?4:large?9:6}
}

export function shortcutLayout(width:number,height:number,small=false,large=false){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<100||height<40)throw Error('Cabeçalho inválido.')
 const gap=small?3:large?6:5,cell=(width-gap*3)/4
 const tileHeight=small?cell:large?Math.min(78,cell):44
 // Calendar common radius: 52 base units, vertical scale 510/484, logical canvas width 1092.
 const radius=Math.min(tileHeight/2,52*(510/484)*((width+(small?16:20))/1092))
 return {gap,cell,tileHeight,radius,glyph:Math.min(72,tileHeight-10,cell-10),height}
}
