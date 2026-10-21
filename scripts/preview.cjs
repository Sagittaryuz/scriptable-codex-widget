// Simulação visual em canvas. Não substitui UIKit/Scriptable no iPhone.
const fs=require('node:fs');
const {createCanvas,loadImage}=require(process.env.CANVAS_MODULE||'@napi-rs/canvas');
function collect(n){return [n,...(n.children||[]).flatMap(collect)];}
async function main(){
 const canvas=createCanvas(1150,1190),ctx=canvas.getContext('2d');ctx.fillStyle='#18191b';ctx.fillRect(0,0,1150,1190);
 ctx.fillStyle='#eeeeee';ctx.font='24px Segoe UI';ctx.fillText('Codex · Scriptable',35,40);ctx.font='15px Segoe UI';ctx.fillStyle='#aaa';ctx.fillText('Simulação — fonte do Windows; validação nativa no iPhone pendente',35,67);
 const bg=await loadImage('assets/popular-background.png');
 const layouts=[['small',155,155,35,125,2],['medium',329,155,400,125,2],['large',329,329,400,480,2]];
 function symbol(name,x,y,size){ctx.save();ctx.translate(x,y);ctx.scale(size/16,size/16);ctx.strokeStyle='#c6c6cb';ctx.lineWidth=1.2;ctx.beginPath();
 if(name==='cloud'){ctx.moveTo(4,13);ctx.bezierCurveTo(-1,13,0,7,4,7);ctx.bezierCurveTo(3,1,11,1,12,6);ctx.bezierCurveTo(17,5,18,13,12,13);ctx.closePath();}
 else if(name==='terminal'){ctx.roundRect(1,1,14,14,2);ctx.moveTo(4,5);ctx.lineTo(7,8);ctx.lineTo(4,11);ctx.moveTo(9,11);ctx.lineTo(12,11);}
 else if(name==='refresh'){ctx.arc(8,8,5,-.5,5);ctx.moveTo(13,3);ctx.lineTo(13,7);ctx.lineTo(9,7);}
 else {ctx.rect(2,2,12,9);ctx.moveTo(0,14);ctx.lineTo(16,14);ctx.moveTo(2,11);ctx.lineTo(0,14);ctx.moveTo(14,11);ctx.lineTo(16,14);}
 ctx.stroke();ctx.restore();}
 function label(value,size,color,x,y,maxWidth){ctx.font=size+'px Segoe UI';ctx.fillStyle=color;let v=value;if(maxWidth&&ctx.measureText(v).width>maxWidth){while(v.length&&ctx.measureText(v+'…').width>maxWidth)v=v.slice(0,-1);v+='…';}ctx.fillText(v,x,y);}
 for(const [family,w,h,x,y,scale] of layouts){
  const tree=JSON.parse(fs.readFileSync('validation/'+family+'.json','utf8')),pad=tree.padding[0];
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.beginPath();ctx.roundRect(0,0,w,h,22);ctx.clip();ctx.drawImage(bg,0,0,w,h);
  const header=tree.children[0],headerText=header.children.find(n=>n.type==='text');
  symbol('terminal',pad,pad+1,headerText.font.size);label('Codex',headerText.font.size,'#eee',pad+20,pad+headerText.font.size);
  let cy=pad+headerText.font.size*1.2+(family==='small'?4:3);
  const rows=tree.children.filter(n=>n.type==='stack'&&n.vertical);
  for(const row of rows){const t=collect(row).filter(n=>n.type==='text'),title=t[0],meta=t[1];
   label(title.value,title.font.size,'#f2f2f2',pad,cy+title.font.size,w-pad*2-10);
   const origin=collect(row).some(n=>n.value==='cloud')?'cloud':'laptop';
   symbol(origin,pad,cy+title.font.size*1.2+1,meta.font.size);
   if(collect(row).some(n=>n.value==='arrow.triangle.2.circlepath'))symbol('refresh',w-pad-9,cy+1,8);
   label(meta.value,meta.font.size,'#c6c6cb',pad+13,cy+title.font.size*1.2+1+meta.font.size,w-pad*2-13);
   cy+=title.font.size*1.2+1+meta.font.size*1.2+(family==='medium'?2:3);
  }
  const foot=tree.children.at(-1),f=foot.children.find(n=>n.type==='text');label(f.value,7.5,'#afafb5',pad,h-pad-1);symbol('refresh',w-pad-9,h-pad-9,8);
  if(cy>h-pad-9)throw Error('Estimativa de altura excedeu o widget '+family);
  ctx.restore();label(family==='small'?'2×2 · 4 tarefas':family==='medium'?'4×2 · 4 tarefas':'4×4 · 8 tarefas',16,'#ccc',x,y-15);
 }
 fs.writeFileSync('validation/preview.png',canvas.toBuffer('image/png'));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
