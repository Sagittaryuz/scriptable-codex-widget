export const TOKEN_GRAPH_WIDTH=78
export const TOKEN_GRAPH_HEIGHT=5.5
export const TOKEN_GRAPH_COLOR='#64D2FF'

export interface GraphPoint {x:number;y:number}
export interface TokenGraphUsage {totalTokens:number;observedAt:string;intervals:Array<{at:string;tokens:number}>}

export function tokenGraphPoints(usage:TokenGraphUsage|undefined,width=TOKEN_GRAPH_WIDTH,height=TOKEN_GRAPH_HEIGHT):GraphPoint[]{
 if(!usage||!usage.intervals.length||!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=1)return []
 const values=usage.intervals.slice(-24).map(sample=>sample.tokens),max=Math.max(...values,0),bottom=height-.5,top=.5
 if(values.length===1)return [{x:width/2,y:max===0?(top+bottom)/2:bottom-(values[0]/max)*(bottom-top)}]
 return values.map((value,index)=>({x:index*(width-1)/(values.length-1),y:max===0?(top+bottom)/2:bottom-(value/max)*(bottom-top)}))
}

export function tokenTotalLabel(totalTokens:number|undefined):string{
 if(totalTokens==null||!Number.isSafeInteger(totalTokens)||totalTokens<0)return '—'
 return totalTokens.toLocaleString('pt-BR')
}

export function tokenUsageDescription(usage:TokenGraphUsage|undefined):string{
 if(!usage)return 'Métricas de tokens indisponíveis; dados ausentes não significam zero.'
 return `Total acumulado de ${tokenTotalLabel(usage.totalTokens)} tokens observado em ${usage.observedAt}. ${usage.intervals.length?`Gráfico com ${usage.intervals.length} intervalos observados.`:'Histórico por intervalo indisponível.'}`
}

export function drawTokenGraph(ctx:any,size:{width:number;height:number},usage:TokenGraphUsage){
 const points=tokenGraphPoints(usage),sx=size.width/TOKEN_GRAPH_WIDTH,sy=size.height/TOKEN_GRAPH_HEIGHT
 if(!points.length||!Number.isFinite(sx)||!Number.isFinite(sy))return
 const bottom=(TOKEN_GRAPH_HEIGHT-.5)*sy
 if(points.length>1){
  for(let i=0;i<points.length-1;i++){
   const a=points[i],b=points[i+1];ctx.beginPath();ctx.moveTo(a.x*sx,a.y*sy);ctx.lineTo(b.x*sx,b.y*sy);ctx.lineTo(b.x*sx,bottom);ctx.lineTo(a.x*sx,bottom);ctx.closePath()
   ctx.fillStyle=`rgba(100,210,255,${.12*(1-i/Math.max(1,points.length-1))})`;ctx.fill()
  }
 }
 ctx.beginPath()
 if(points.length===1){const p=points[0];ctx.moveTo((p.x-1.5)*sx,p.y*sy);ctx.lineTo((p.x+1.5)*sx,p.y*sy)}
 else points.forEach((point,index)=>index?ctx.lineTo(point.x*sx,point.y*sy):ctx.moveTo(point.x*sx,point.y*sy))
 ctx.strokeStyle=TOKEN_GRAPH_COLOR;ctx.lineWidth=.7*sx;ctx.stroke()
}
