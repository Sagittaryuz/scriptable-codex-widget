import { Canvas, RoundedRectangle, ZStack } from 'scripting'
import { Snapshot, stale } from './model'

// Observation time is not fetch time. Keep history explicit without a stale badge.
export function quotaObservationTime(iso:string,now=Date.now()){
 const date=new Date(iso),today=new Date(now)
 if(!Number.isFinite(date.getTime())||date.getTime()>now)return ''
 const pad=(value:number)=>String(value).padStart(2,'0')
 const time=pad(date.getHours())+':'+pad(date.getMinutes())
 return date.toDateString()===today.toDateString()?time:pad(date.getDate())+'/'+pad(date.getMonth()+1)+' '+time
}
export function liquidQuota(snapshot:Snapshot,now=Date.now()){
 const observed=Date.parse(snapshot.usageObservedAt)
 const invalidTime=!Number.isFinite(observed)||observed>now
 const old=!invalidTime&&stale(snapshot.usageObservedAt,now)
 const values=snapshot.windows.map(window=>window.remainingPercent)
 const valid=values.length>0&&values.every(value=>typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=100)
 // A previous observation is still a real balance, not a fresh one. Keep it
 // visibly marked until a known reset passes; never carry it into a new window.
 const expired=old&&snapshot.windows.some(window=>window.resetsAt!=null&&Number.isFinite(window.resetsAt)&&window.resetsAt*1000<=now)
 const remaining=valid&&!invalidTime&&!expired?Math.min(...values):null
 const historical=remaining!=null&&old
 const observationTime=remaining==null?'':quotaObservationTime(snapshot.usageObservedAt,now)
 return {remaining,old,historical,observationTime,label:remaining==null?'Limite indisponível':`${historical?'Último limite observado: ':''}${Math.round(remaining)}% restante`}

}
// Battery color follows remaining quota; 100% is green. The depth gradient
// remains dark enough for the original shortcut artwork on top.
export function liquidColor(t:number,remaining=100){
 const red=[196,48,62],amber=[167,120,22],green=[61,212,22],r=Math.max(0,Math.min(100,remaining))
 const a=r<50?red:amber,b=r<50?amber:green,mix=r<50?r/50:(r-50)/50
 const shade=1-.65*Math.max(0,Math.min(1,t))
 return '#'+a.map((v,i)=>Math.round((v+(b[i]-v)*mix)*shade).toString(16).padStart(2,'0')).join('')
}
export function liquidSurface(width:number,height:number,remaining:number){
 const level=height*(1-remaining/100),amplitude=Math.min(2,level,height-level)
 // Two complete symmetric waves: the average surface stays at the exact quota.
 return Array.from({length:97},(_,i)=>({x:width*i/96,y:level+amplitude*Math.sin(i/96*Math.PI*4)}))
}
export function drawLiquid(ctx:any,size:{width:number;height:number},remaining:number|null){
 if(remaining==null||!Number.isFinite(remaining)||remaining<=0||remaining>100||!Number.isFinite(size.width)||!Number.isFinite(size.height)||size.width<=0||size.height<=0)return
 const level=size.height*(1-remaining/100),filled=size.height-level
 const surface=liquidSurface(size.width,size.height,remaining),bottomOfWave=Math.max(...surface.map(p=>p.y))
 // Paint the wave cap, then the vertical gradient below it. The filled area is
 // width*height*remaining/100, including at the exact 0% and 100% endpoints.
 ctx.beginPath();ctx.moveTo(surface[0].x,surface[0].y)
 for(const p of surface.slice(1))ctx.lineTo(p.x,p.y)
 ctx.lineTo(size.width,bottomOfWave);ctx.lineTo(0,bottomOfWave);ctx.closePath()
 ctx.fillStyle=liquidColor(0,remaining);ctx.fill()
 const body=size.height-bottomOfWave,strips=Math.max(1,Math.ceil(body)),step=body/strips
 for(let i=0;i<strips;i++){
  ctx.fillStyle=liquidColor((bottomOfWave-level+i*step)/filled,remaining)
  ctx.fillRect(0,bottomOfWave+i*step,size.width,Math.min(step+.5,size.height-(bottomOfWave+i*step)))
 }
 // Specular vertical reflection and shaded edges give the fluid cylindrical depth.
 // Each reflection column starts at its actual wave surface, never above the liquid.
 for(let i=0;i<96;i++){
  const x0=surface[i].x,x1=surface[i+1].x,y0=surface[i].y,y1=surface[i+1].y,p=(i+.5)/96
  const shine=.30*Math.exp(-Math.pow((p-.23)/.10,2))+.10*Math.exp(-Math.pow((p-.78)/.06,2))
  const edge=.28*Math.pow(Math.abs(p-.5)*2,5)
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.lineTo(x1,size.height);ctx.lineTo(x0,size.height);ctx.closePath()
  ctx.fillStyle=shine>edge?`rgba(224,255,214,${shine-edge})`:`rgba(0,0,0,${edge-shine})`;ctx.fill()
 }
 if(remaining<100){
  // A luminous underwater edge follows the same ripple, not a straight usage bar.
  for(const [offset,alpha,lineWidth]of [[2,.12,3],[1,.22,2],[.3,.65,.7]]){
   ctx.beginPath();ctx.moveTo(surface[0].x,Math.min(size.height,surface[0].y+offset))
   for(const p of surface.slice(1))ctx.lineTo(p.x,Math.min(size.height,p.y+offset))
   ctx.strokeStyle=`rgba(194,255,224,${alpha})`;ctx.lineWidth=lineWidth;ctx.stroke()
  }
 }
}
export function batteryGeometry(width:number,height:number){return {x:5,y:8,width:width-10,height:height-15,radius:14}}
function roundedOutline(ctx:any,x:number,y:number,w:number,h:number,r:number){
 ctx.beginPath()
 const centers=[[x+w-r,y+r],[x+w-r,y+h-r],[x+r,y+h-r],[x+r,y+r]]
 centers.forEach(([cx,cy],corner)=>{for(let i=0;i<=8;i++){const angle=(-90+corner*90+i*90/8)*Math.PI/180,px=cx+r*Math.cos(angle),py=cy+r*Math.sin(angle);if(corner===0&&i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)}})
 ctx.closePath()
}
export function drawBatteryFrame(ctx:any,size:{width:number;height:number}){
 const g=batteryGeometry(size.width,size.height)
 roundedOutline(ctx,g.x-1,g.y-1,g.width+2,g.height+2,g.radius+1);ctx.strokeStyle='#090a0a';ctx.lineWidth=4;ctx.stroke()
 roundedOutline(ctx,g.x-1,g.y-1,g.width+2,g.height+2,g.radius+1);ctx.strokeStyle='rgba(211,227,218,.55)';ctx.lineWidth=.8;ctx.stroke()
 roundedOutline(ctx,g.x+.7,g.y+.7,g.width-1.4,g.height-1.4,g.radius-.7);ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=.6;ctx.stroke()
 // Metallic terminal and base, inspired by the supplied battery references.
 for(let i=0;i<28;i++){
  const p=i/27,v=Math.round(65+185*Math.exp(-Math.pow((p-.28)/.26,2))+60*Math.exp(-Math.pow((p-.85)/.12,2)))
  ctx.fillStyle=`rgb(${v},${v},${v})`;ctx.fillRect(size.width/2-14+i,1,1.3,5)
 }
 for(let i=0;i<Math.ceil(g.width-28);i++){
  const p=i/(g.width-28),v=Math.round(65+145*Math.exp(-Math.pow((p-.25)/.20,2))+80*Math.exp(-Math.pow((p-.85)/.12,2)))
  ctx.fillStyle=`rgb(${v},${v},${v})`;ctx.fillRect(g.x+14+i,size.height-5,1.3,2)
 }
 // Slim highlights on the curved casing; no opaque panel over the shortcuts.
 for(const [x,alpha]of [[g.x+.6,.48],[g.x+g.width-.6,.28]]){
  ctx.beginPath();ctx.moveTo(x,g.y+g.radius);ctx.lineTo(x,g.y+g.height-g.radius);ctx.strokeStyle=`rgba(236,255,243,${alpha})`;ctx.lineWidth=.8;ctx.stroke()
 }
}
export function LiquidQuota({snapshot,width,height}:{snapshot:Snapshot;width:number;height:number}){
 const state=liquidQuota(snapshot),g=batteryGeometry(width,height)
 return <ZStack alignment="topLeading" frame={{width,height}}>
  <Canvas opaque={false} frame={{width:g.width,height:g.height}} position={{x:g.x+g.width/2,y:g.y+g.height/2}} mask={<RoundedRectangle cornerRadius={g.radius} fill="white" frame={{width:g.width,height:g.height}}/>} accessibilityLabel={`Limite do Codex. ${state.label}${state.old?'. Observação antiga ou inválida.':''}`} draw={(ctx,size)=>drawLiquid(ctx,size,state.remaining)}/>
  <Canvas opaque={false} frame={{width,height}} draw={drawBatteryFrame}/>
 </ZStack>
}
