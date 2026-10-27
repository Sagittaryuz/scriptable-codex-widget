// Popular 0.2.13, Sagittaryuz/popular-scripting@765dc094: draw.js GEOMETRY and
// view.tsx name/unit labels. Copy reference metrics, without importing its data engine.
export const POPULAR_SMALL_METRICS=Object.freeze({column:146,row:36,gap:2/3,icon:26,detail:30,title:10,titleHeight:17,titleMin:8,meta:6,metaY:28,metaHeight:8,metaMin:5,metaColor:'#96969C'})
// Full widget height; shared 8pt outer vertical margins and Popular horizontal fit.
export function referenceLayout(family:string,width:number,height:number,fullHeight=height){
 if(!Number.isFinite(width)||!Number.isFinite(height)||!Number.isFinite(fullHeight)||width<120||height<110)throw Error('Dimensões inválidas')
 const small=family==='systemSmall',large=family==='systemLarge'
 const logicalWidth=small?146:304,logicalHeight=large?201:146
 const scale=Math.min(1,(width-12)/logicalWidth,(height-16)/logicalHeight)
 const contentWidth=logicalWidth*scale,side=(width-contentWidth)/2,top=8,contentHeight=height-top*2
 const plan=shortcutLayout(contentWidth,contentHeight,small,large)
 const bar=large?4:3,quota=large?8.5:6,aboveBar=small?5:8,belowBar=small?3:5,afterSummary=small?5:8
 const barY=plan.tileHeight+aboveBar+bar/2,summaryHeight=quota*1.2
 const header=barY+bar/2+belowBar+summaryHeight+afterSummary,row=(contentHeight-header)/3
 const rowTextGap=row<26?0:3,baseTitle=small?9.5:large?15.5:11.5,baseMeta=small?6.5:large?11.5:7.5
 const textScale=Math.min(1,(row-4-rowTextGap)/(1.2*(baseTitle+baseMeta)))
 const base={small,large,left:side,top,width:contentWidth,height:contentHeight,header,row,bar,quota,barY,summaryHeight,rowTextGap,aboveBar,belowBar,afterSummary,
  icon:Math.min(large?40:small?22:25,row-4),rowGap:row<26?3:large?12:8,
  rowInset:0,title:baseTitle*textScale,meta:baseMeta*textScale,
  badgeWidth:small?33:large?56:54,badgeHeight:Math.min(small?14:large?26:19,row-4),badgeFont:Math.min(small?7:large?11.5:9,(row-4)/1.2),
  chevron:0}
 const p=POPULAR_SMALL_METRICS,scaleY=contentHeight/p.column
 return {...base,taskCount:small?2:3,taskTop:small?2*(p.row+p.gap)*scaleY:header,
  taskAdvance:small?(p.row+p.gap)*scaleY:row,dividerHeight:small?p.gap*scaleY:.6,
  textX:p.detail*scale,titleHeight:p.titleHeight*scaleY,metaY:p.metaY*scaleY,metaHeight:p.metaHeight*scaleY,
  iconY:p.row/2*scaleY,metaColor:p.metaColor,
  ...(small?{row:p.row*scaleY,icon:p.icon*scale,rowGap:(p.detail-p.icon)*scale,title:p.title*scale,meta:p.meta*scale}:{}),
 }
}

export function shortcutLayout(width:number,height:number,small=false,large=false){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<100||height<40)throw Error('Cabeçalho inválido.')
 const gap=small?3:large?6:5,cell=(width-gap*3)/4
 const iconBoxHeight=small?cell:large?Math.min(78,cell):44,labelFont=small?6:large?9:7
 const tileHeight=iconBoxHeight+labelFont*1.2+2
 // Calendar common radius: 52 base units, vertical scale 510/484, logical canvas width 1092.
 const radius=Math.min(tileHeight/2,52*(510/484)*((width+(small?16:20))/1092))
 return {gap,cell,tileHeight,radius,glyph:Math.min(72,iconBoxHeight-10,cell-10),labelFont,height}
}
