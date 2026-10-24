// Responsive interpretation of the supplied header + three task rows reference.
export function referenceLayout(family:string,width:number,height:number){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<120||height<110)throw Error('Dimensões inválidas')
 const small=family==='systemSmall',large=family==='systemLarge'
 const side=small?8:10,top=large?16:8,contentWidth=width-side*2,contentHeight=height-top*2
 const header=small?52:large?72:56,row=(contentHeight-header)/3
 return {small,large,left:side,top,width:contentWidth,height:contentHeight,header,row,
  logo:small?28:large?48:38,headerGap:small?8:large?22:12,
  headerTitle:small?15.5:large?24:20.5,quota:small?8.5:large?16:13,
  bar:small?5:large?9:6,reset:small?8:large?12:9.5,
  icon:Math.min(large?38:small?22:25,row-4),rowGap:small?5:large?12:8,
  rowInset:small?0:large?8:4,title:small?9.5:large?13.5:11.5,meta:small?6.5:large?10.5:7.5,
  badgeWidth:small?33:large?56:54,badgeHeight:small?14:large?26:19,badgeFont:small?7:large?11.5:9,
  chevron:small?4:large?9:6}
}
