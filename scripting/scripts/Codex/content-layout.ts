// Same geometry contract as Popular draw.layout(): 146/304 wide, 146/201 tall.
export function contentBounds(family:string,width:number,height:number){
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=12||height<=8)throw Error('Dimensões inválidas')
  const small=family==='systemSmall',large=family==='systemLarge'
  const logicalWidth=small?146:304,logicalHeight=large?201:146
  const scale=Math.min(1,(width-12)/logicalWidth,(height-8)/logicalHeight)
  const contentWidth=logicalWidth*scale,contentHeight=logicalHeight*scale
  return {width:contentWidth,height:contentHeight,left:(width-contentWidth)/2,top:(height-contentHeight)/2,scale}
}
