import { Canvas } from 'scripting'
import { Snapshot, stale } from './model'
import { QUOTA_GLYPHS } from './quota-glyphs'

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
 return Array.from({length:97},(_,i)=>({x:width*i/96,y:level+amplitude*.5*(Math.cos(i/96*Math.PI*4)-Math.cos(i/96*Math.PI*2))}))
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
 const gradient=ctx.createLinearGradient(0,level,0,size.height)
 gradient.addColorStop(0,liquidColor(0,remaining));gradient.addColorStop(.55,liquidColor(.45,remaining));gradient.addColorStop(1,liquidColor(1,remaining))
 ctx.fillStyle=gradient
 ctx.fillRect(0,bottomOfWave,size.width,size.height-bottomOfWave)
 // One continuous gradient, no overlapping strips or per-column alpha strings.
 // Tiny computed rgba alphas formerly serialized as e-7, invalid for native parser.
 const volume=ctx.createLinearGradient(0,0,size.width,0)
 volume.addColorStop(0,'rgba(0,15,10,0.28)')
 volume.addColorStop(.5,'rgba(224,255,238,0.05)')
 volume.addColorStop(1,'rgba(0,15,10,0.28)')
 ctx.beginPath();surface.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y))
 ctx.lineTo(size.width,size.height);ctx.lineTo(0,size.height);ctx.closePath();ctx.fillStyle=volume;ctx.fill()
 if(remaining<100){
  // Perspective lens: organic back/front arcs share the existing ripple.
  // Depth compresses near empty/full so the surface never escapes the cavity.
  const radius=Math.min(10,size.height*.075,level*.8,filled*.8)
  const back=surface.map((p,i)=>({...p,y:p.y-radius*Math.sqrt(Math.max(0,1-Math.pow(i/48-1,2)))*(.85+.06*Math.cos((i-48)/9))}))
  const front=surface.map((p,i)=>({...p,y:p.y+radius*Math.sqrt(Math.max(0,1-Math.pow(i/48-1,2)))*(1+.06*Math.cos((i-48)/11))}))
  // Clear water: a single transparent lens, without milky/striped surface layers.
  ctx.beginPath();back.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y))
  for(const p of [...front].reverse())ctx.lineTo(p.x,p.y)
  ctx.closePath();ctx.fillStyle='rgba(190,255,219,0.035)';ctx.fill()
  for(const [curve,color,width]of [[back,'rgba(225,255,240,.18)',.6],[front,'rgba(5,41,24,.18)',.7]] as const){
   ctx.beginPath();curve.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y))
   ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()
  }
  // Broad soft highlight across the centered rear portion of the surface.
  for(let band=0;band<2;band++){
   ctx.beginPath()
   for(let i=18;i<=78;i++){const p=back[i],t=.18+band*.045,y=p.y+(front[i].y-p.y)*t;i===18?ctx.moveTo(p.x,y):ctx.lineTo(p.x,y)}
   ctx.strokeStyle=`rgba(245,255,244,${(.025+band*.01).toFixed(3)})`;ctx.lineWidth=1.5;ctx.stroke()
  }
 }
}
// Fixed type size across 0–100, outline only: no opaque glyph fill.
export const QUOTA_FONT_SIZE=44
// Frontal perspective: homothety about the optical center, no translation/skew.
export function projectQuotaDepth(x:number,y:number,cx:number,cy:number,depth:number){
 const scale=1-depth*.016
 return {x:cx+(x-cx)*scale,y:cy+(y-cy)*scale}
}
export function drawQuotaOutline(ctx:any,size:{width:number;height:number},remaining:number|null,historical=false){
 const text=remaining==null?'—':Math.round(remaining)+'%'
 const glyphs=[...text].map(char=>QUOTA_GLYPHS[char])
 const width=glyphs.reduce((sum,g)=>sum+g.advance,0),x=(size.width-width)/2,y=size.height/2+17
 ctx.lineJoin='round'
 function outline(depth:number){
  let cursor=x
  ctx.beginPath()
  for(const glyph of glyphs){
   for(const contour of glyph.contours){
    contour.forEach(([px,py],i)=>{const p=projectQuotaDepth(cursor+px,y+py,size.width/2,size.height/2+2,depth);i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)})
    ctx.closePath()
   }
   cursor+=glyph.advance
  }
  ctx.stroke()
 }
 for(let depth=6;depth>=1;depth--){
  ctx.lineWidth=2.8;ctx.strokeStyle=historical?'rgba(100,112,114,.65)':depth>3?'rgba(33,63,57,.95)':'rgba(107,147,132,.95)'
  outline(depth)
 }
 ctx.lineWidth=2.6;ctx.strokeStyle=historical?'rgba(197,209,211,.58)':'rgba(231,255,247,.95)';outline(0)
 ctx.lineWidth=.7;ctx.strokeStyle=historical?'rgba(255,255,255,.32)':'rgba(255,255,255,.92)';outline(0)
}
export function drawQuotaScene(ctx:any,size:{width:number;height:number},remaining:number|null,historical=false){
 // Draw lettering first. Transparent fluid tints/attenuates the submerged contour.
 drawQuotaOutline(ctx,size,remaining,historical)
 ctx.globalAlpha=historical?.22:.30
 drawLiquid(ctx,size,remaining)
 ctx.globalAlpha=1
}
export function LiquidQuota({snapshot,width,height}:{snapshot:Snapshot;width:number;height:number}){
 const state=liquidQuota(snapshot)
 // Paint to the widget edges and let the native widget clip its outer corners.
 return <Canvas opaque={false} frame={{width,height}} accessibilityLabel={`Limite do Codex. ${state.label}${state.old?'. Observação histórica, não sincronizada.':''}`} draw={(ctx,size)=>drawQuotaScene(ctx,size,state.remaining,state.historical)}/>
}
