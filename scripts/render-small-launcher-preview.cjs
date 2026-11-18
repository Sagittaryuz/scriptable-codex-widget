const fs=require('fs');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function measure(n){const p=n?.props||{},f=p.frame||{},children=(n?.children||[]).filter(x=>x&&typeof x==='object'),sizes=children.map(measure),gap=p.spacing||0;let w=0,h=0;
 if(n?.type==='Text'){const t=(n.children||[]).join('');w=t.length*(p.font||10)*.54;h=(p.font||10)*1.2}
 else if(n?.type==='Image'||n?.type==='Circle'||n?.type==='Rectangle'||n?.type==='RoundedRectangle'){w=f.width||p.font*1.2||0;h=f.height||p.font*1.2||w}
 else if(n?.type==='HStack'){w=sizes.reduce((a,v)=>a+v[0],0)+Math.max(0,sizes.length-1)*gap;h=Math.max(0,...sizes.map(v=>v[1]))}
 else if(n?.type==='VStack'){w=Math.max(0,...sizes.map(v=>v[0]));h=sizes.reduce((a,v)=>a+v[1],0)+Math.max(0,sizes.length-1)*gap}
 else{w=Math.max(0,...sizes.map(v=>v[0]));h=Math.max(0,...sizes.map(v=>v[1]))}
 return [f.width??w,f.height??h];
}
let serial=0;
function render(n,x,y,forcedWidth){if(!n||typeof n!=='object')return '';const p=n.props||{},[naturalW,h]=measure(n),w=forcedWidth??naturalW,children=(n.children||[]).filter(v=>v&&typeof v==='object'),type=n.type;
 if(type==='Text'){let value=(n.children||[]).join('');const size=p.font||10,limit=Math.floor(w/Math.max(1,size*.54));if(p.lineLimit===1&&value.length>limit)value=value.slice(0,Math.max(1,limit-1))+'…';const align=p.frame?.alignment||'center',anchor=align==='leading'?'start':align==='trailing'?'end':'middle',tx=align==='leading'?x:align==='trailing'?x+w:x+w/2,ty=y+h/2;return `<text x="${tx}" y="${ty}" text-anchor="${anchor}" dominant-baseline="middle" fill="${esc(p.foregroundStyle||'white')}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${p.fontWeight==='semibold'?600:p.fontWeight==='bold'?700:400}">${esc(value)}</text>`}
 if(type==='Circle'){return `<ellipse cx="${x+w/2}" cy="${y+h/2}" rx="${w/2}" ry="${h/2}" fill="${esc(p.fill||'#66666d')}"/>`}
 if(type==='Rectangle'||type==='RoundedRectangle'){const rad=p.clipShape==='capsule'?h/2:p.cornerRadius||0;return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="${esc(p.fill||'white')}"/>`}
 if(type==='Canvas'){const points=p.previewPoints||[],sx=w/78,sy=h/5.5,bottom=y+h-.5*sy;if(!points.length)return '';let out='';if(points.length>1){for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1];out+=`<path d="M ${x+a.x*sx} ${y+a.y*sy} L ${x+b.x*sx} ${y+b.y*sy} L ${x+b.x*sx} ${bottom} L ${x+a.x*sx} ${bottom} Z" fill="#64D2FF" fill-opacity=".12"/>`}}const d=points.map((q,i)=>`${i?'L':'M'} ${x+q.x*sx} ${y+q.y*sy}`).join(' ');return d?out+`<path d="${d}" fill="none" stroke="#64D2FF" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/>`:''}
 if(type==='Image'&&p.image?.base64)return `<image x="${x}" y="${y}" width="${w}" height="${h}" href="data:image/png;base64,${p.image.base64}"/>`;
 if(type==='Image'){const symbol=p.systemName||'',label=({laptopcomputer:'▱',cloud:'☁','cloud.fill':'☁',checkmark:'✓','pause.fill':'Ⅱ',questionmark:'?',clock:'◷','clock.fill':'◷'})[symbol]||'•',size=p.font||Math.min(w,h)*.72;return `<text x="${x+w/2}" y="${y+h/2}" text-anchor="middle" dominant-baseline="middle" fill="${esc(p.foregroundStyle||'white')}" font-family="Arial, sans-serif" font-size="${size}">${label}</text>`}
 let out='';const sizes=children.map(measure),gap=p.spacing||0;let cursor=type==='HStack'&&p.frame?.alignment!=='leading'?Math.max(0,(w-sizes.reduce((a,v)=>a+v[0],0)-gap*Math.max(0,children.length-1))/2):0;
 for(let i=0;i<children.length;i++){const child=children[i],cp=child.props||{},[cw,ch]=sizes[i];let cx,cy,childWidth=cw;
  if(cp.position){cx=x+cp.position.x-cw/2;cy=y+cp.position.y-ch/2}
  else if(type==='HStack'){if(child.type==='Text')childWidth=Math.min(cw,Math.max(0,w-(sizes.reduce((a,v,j)=>a+(j===i?0:v[0]),0)+gap*Math.max(0,children.length-1))));cx=x+cursor;cy=y+(h-ch)/2;cursor+=childWidth+gap}
  else if(type==='VStack'){cx=x+(p.alignment==='leading'?0:(w-cw)/2);cy=y+cursor;cursor+=ch+gap}
  else{cx=x+(p.alignment==='topLeading'||p.alignment==='leading'?0:(w-cw)/2);cy=y+(p.alignment==='topLeading'?0:(h-ch)/2)}
  out+=render(child,cx,cy,childWidth)
 }
 return out;
}
const tree=JSON.parse(fs.readFileSync('validation/small-launcher-tree.json')).tree;fs.writeFileSync('validation/small-launcher-preview.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="632" height="632" viewBox="0 0 158 158">${render(tree,0,0)}</svg>`);