// One geometry for the tappable glass and the percentage seen through it.
export function launcherGeometry(width:number,height:number){
 const gap=2,margin=7
 const w=(width-2*margin-gap)/2,h=(height-2*margin-gap)/2,radius=Math.min(19,Math.min(w,h)*.27)
 const centers=Array.from({length:4},(_,i)=>({x:margin+w/2+(i%2)*(w+gap),y:margin+h/2+Math.floor(i/2)*(h+gap)}))
 return {w,h,radius,centers}
}
type Lens=ReturnType<typeof launcherGeometry>
export function refractPoint(x:number,y:number,lens:Lens){
 for(const c of lens.centers){
  const dx=x-c.x,dy=y-c.y,a=Math.abs(dx)-(lens.w/2-lens.radius),b=Math.abs(dy)-(lens.h/2-lens.radius)
  // Signed distance into the rounded bezel, exact on the straight sides.
  const t=lens.radius-Math.hypot(Math.max(0,a),Math.max(0,b))-Math.min(0,Math.max(a,b))
  if(t<=0||t>=11)continue
  const mag=2.1*Math.sin(Math.PI*t/11)
  return {x:x+dx/(lens.w/2)*mag,y:y+dy/(lens.h/2)*mag}
 }
 return {x,y}
}
