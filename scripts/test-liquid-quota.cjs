const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),{buildSync}=require('esbuild');
const root=path.resolve(__dirname,'../scripting/scripts/Codex'),m={exports:{}},code=buildSync({entryPoints:[path.join(root,'liquid-quota.tsx')],bundle:true,write:false,platform:'node',format:'cjs',external:['scripting'],jsxFactory:'createElement'}).outputFiles[0].text;
vm.runInNewContext(code,{module:m,exports:m.exports,require:()=>({Canvas:'Canvas'}),Date,Set,Map,JSON});
const {liquidQuota,drawLiquid,liquidColor,liquidSurface}=m.exports,now=Date.now(),snapshot={usageObservedAt:new Date(now).toISOString(),windows:[{remainingPercent:86}]};
assert.equal(liquidQuota(snapshot,now).remaining,86);assert.equal(liquidQuota({...snapshot,windows:[{remainingPercent:86},{remainingPercent:24}]},now).remaining,24);
for(const windows of [[],[{remainingPercent:null}],[{remainingPercent:NaN}],[{remainingPercent:-1}],[{remainingPercent:101}]])assert.equal(liquidQuota({...snapshot,windows},now).remaining,null);
for(const usageObservedAt of ['invalid',new Date(now+60000).toISOString()])assert.equal(liquidQuota({...snapshot,usageObservedAt},now).remaining,null);
const historical=liquidQuota({...snapshot,usageObservedAt:new Date(now-3600000).toISOString()},now);assert.equal(historical.remaining,86);assert.equal(historical.historical,true);assert(!historical.label.includes('antigo'));assert(historical.observationTime.match(/\d{2}:\d{2}/));assert(historical.label.includes('Último limite observado'));
assert.equal(liquidQuota({...snapshot,usageObservedAt:new Date(now-3600000).toISOString(),windows:[{remainingPercent:86,resetsAt:Math.floor(now/1000)-1}]},now).remaining,null);
let tested=0;const previews=[];
for(const width of [150,158,170])for(const remaining of [null,0,.01,8,25,50,86,100]){
 const rects=[],paths=[],ops=[],ctx={createLinearGradient(x0,y0,x1,y1){return {x0,y0,x1,y1,stops:[],addColorStop(at,color){this.stops.push({at,color})}}},fillRect(x,y,w,h){rects.push({x,y,w,h,fill:this.fillStyle});ops.push({kind:"rect",x,y,w,h,fill:this.fillStyle})},beginPath(){this.points=[];this.closed=false},moveTo(x,y){this.points.push([x,y])},lineTo(x,y){this.points.push([x,y])},closePath(){this.closed=true},fill(){paths.push({points:this.points,closed:this.closed,fill:this.fillStyle});ops.push({kind:"path",points:this.points,closed:this.closed,fill:this.fillStyle})},stroke(){paths.push({points:this.points,closed:this.closed,stroke:this.strokeStyle,lineWidth:this.lineWidth});ops.push({kind:"path",points:this.points,closed:this.closed,stroke:this.strokeStyle,lineWidth:this.lineWidth})}};const g={width,height:width};drawLiquid(ctx,{width:g.width,height:g.height},remaining);
 if(remaining==null||remaining===0)assert.equal(rects.length,0);else{const top=g.height*(1-remaining/100);const surface=liquidSurface(g.width,g.height,remaining);let area=0;for(let i=1;i<surface.length;i++)area+=(surface[i].x-surface[i-1].x)*(g.height-(surface[i].y+surface[i-1].y)/2);assert(Math.abs(area-g.width*g.height*remaining/100)<1e-7);assert.equal(surface[0].y,top);if(remaining<100)assert(surface.some(p=>p.y!==top));for(const r of rects){assert(r.y>=top-1e-9);assert(r.y+r.h<=g.height+1e-9);assert.equal(r.w,g.width)}assert(Math.abs(Math.max(...rects.map(r=>r.y+r.h))-g.height)<1e-9)}
 if(width===158)previews.push({remaining,rects,paths,ops});tested++;
}
assert.notEqual(liquidColor(0),liquidColor(1));assert.equal(liquidColor(0,100),'#3dd416');fs.writeFileSync(path.resolve(__dirname,'../validation/liquid-quota-draw.json'),JSON.stringify({synthetic:true,nativeIOS:false,previews}));console.log(`PASS liquid: ${tested} levels/sizes, exact top/bottom geometry, gradient, missing/invalid/future unavailable; historical marked, expired reset unavailable.`);
// Integration preview records the same full scene callback used by Canvas.
fs.mkdirSync(path.resolve(__dirname,'../work'),{recursive:true});
const scenes=[];
for(const historical of [false,true])for(const remaining of [null,0,8,25,50,86,100]){
 const ops=[],ctx={globalAlpha:1,createLinearGradient(x0,y0,x1,y1){return {x0,y0,x1,y1,stops:[],addColorStop(at,color){this.stops.push({at,color})}}},fillRect(x,y,w,h){ops.push({kind:'rect',x,y,w,h,fill:this.fillStyle,alpha:this.globalAlpha})},beginPath(){this.points=[];this.commands=[];this.closed=false},moveTo(x,y){this.points.push([x,y]);this.commands.push('M'+x+' '+y)},lineTo(x,y){this.points.push([x,y]);this.commands.push('L'+x+' '+y)},closePath(){this.closed=true;this.commands.push('Z')},fill(){ops.push({kind:'path',points:this.points,commands:this.commands,closed:this.closed,fill:this.fillStyle,alpha:this.globalAlpha})},stroke(){ops.push({kind:'path',points:this.points,commands:this.commands,closed:this.closed,stroke:this.strokeStyle,lineWidth:this.lineWidth,alpha:this.globalAlpha})},strokeText(text,x,y){ops.push({kind:'text',text,x,y,font:this.font,stroke:this.strokeStyle,lineWidth:this.lineWidth,alpha:this.globalAlpha})}};
 m.exports.drawQuotaScene(ctx,{width:158,height:158},remaining,historical);
 const outlines=ops.filter(o=>o.kind==='path'&&o.stroke&&!o.fill&&o.alpha===1);
 assert.equal(outlines.length,1,'Only a flat stroke, without stacked 3D extrusion');
 assert(outlines[0].commands.length>=5);
 const ys=outlines[0].points.map(p=>p[1]),xs=outlines[0].points.map(p=>p[0]);
 assert(Math.min(...xs)>=4&&Math.max(...xs)<=154);
 if(remaining!==null)assert(Math.max(...ys)-Math.min(...ys)>89,'Actual contour occupies more than 56% widget height');
 assert.equal(ctx.globalAlpha,1);
 if(remaining===50){const lens=ops.filter(o=>o.kind==='path'&&o.fill&&o.points.some(p=>p[1]<158/2-3));assert(lens.length>=1,'Perspective surface has depth above the level, not just a line');}
 assert(outlines[0].lineWidth>=2,'Firm outline');
 if(remaining>0){assert.equal(ops[0].kind,'path');assert(ops.find(o=>o.kind==='rect').alpha<1)}
 else assert(!ops.some(o=>o.kind==='rect'));
 assert(!JSON.stringify(ops).match(/rgba\([^)]*e-\d/),'No scientific-notation alpha in native paint');
 if(remaining>0)assert.equal(ops.filter(o=>o.kind==='rect').length,1,'Continuous body, no overlapping scanline strips');
 scenes.push({remaining,historical,ops});
}
fs.writeFileSync(path.resolve(__dirname,'../work/wordart-scenes.json'),JSON.stringify({synthetic:true,nativeIOS:false,scenes}));
console.log('PASS 14 full scenes: fixed outline type, no filled text, lettering behind translucent liquid, unknown/0/100 and history.');

const geo={exports:{}};
vm.runInNewContext(buildSync({entryPoints:[path.join(root,'launcher-geometry.ts')],bundle:true,write:false,platform:'node',format:'cjs'}).outputFiles[0].text,{module:geo,exports:geo.exports});
const lens=geo.exports.launcherGeometry(158,158);
function refracted(x,y){const result=geo.exports.refractPoint(x,y,lens);return [result.x,result.y]}
assert.deepEqual(refracted(79,40),[79,40],'Center gutter never refracts');
assert.deepEqual(refracted(36,36),[36,36],'Clear lens centers preserve the baseline contour');
const lp=refracted(73,40),rp=refracted(85,40);
assert(lp[0]>73&&rp[0]<85&&Math.abs(lp[0]+rp[0]-158)<1e-8,'Mirrored rounded edges distort the same background contour');
for(const value of [8,25,50,86]){const wave=liquidSurface(148,143,value);wave.forEach((p,i)=>assert(Math.abs(p.y-wave[96-i].y)<1e-8));}
console.log('PASS refraction confined to four glass rims; no extrusion; water wave still centered.');
