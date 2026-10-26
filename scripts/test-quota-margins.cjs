const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{buildSync}=require('esbuild');
const root=path.resolve('scripting/scripts/Codex'),m={exports:{}};
const code=buildSync({entryPoints:[path.join(root,'view.tsx')],bundle:true,write:false,platform:'node',format:'cjs',external:['scripting'],jsxFactory:'createElement'}).outputFiles[0].text;
const sdk=new Proxy({AppIntentManager:{register:d=>()=>({name:d.name})},AppIntentProtocol:{AppIntent:0}},{get:(o,k)=>o[k]??k});
const createElement=(type,props,...children)=>typeof type==='function'?type({...props,children:children.flat(Infinity).filter(Boolean)}):({type,props:props||{},children:children.flat(Infinity).filter(Boolean)});
vm.runInNewContext(code,{module:m,exports:m.exports,require:()=>sdk,Date,Set,Map,JSON,createElement,UIImage:{fromBase64String:()=>({syntheticImage:true})}});
const iso=new Date().toISOString(),snapshot={schemaVersion:2,generatedAt:iso,usageObservedAt:iso,tasksObservedAt:iso,coverage:'Synthetic margin audit',windows:[{remainingPercent:86,usedPercent:14,windowDurationMins:300,resetsAt:null}],tasks:['input','running','ready'].map((state,i)=>({id:'synthetic-'+i,title:'Synthetic margin task',state,origin:'Local',observedAt:iso,detail:'Synthetic'}))};
const close=(a,b)=>assert(Math.abs(a-b)<1e-9,`${a} differs from ${b}`),hasPadding=n=>n&&typeof n==='object'&&(Object.keys(n.props||{}).some(k=>/padding/i.test(k))||(n.children||[]).some(hasPadding));
const results=[];
for(const [family,width,height]of [['systemSmall',158,158],['systemSmall',158,170],['systemMedium',338,170],['systemLarge',338,360]]){
 const tree=m.exports.CodexView({snapshot,family,width,height}),content=tree.children.find(n=>n.type==='VStack'),header=content.children[0],icons=header.children[0],dots=header.children[1];
 const contentLeft=content.props.position.x-content.props.frame.width/2,contentRight=contentLeft+content.props.frame.width;
 const dotLeft=contentLeft+dots.props.position.x-dots.props.frame.width/2,dotWidths=dots.children.map(n=>n.props.frame.width),gap=dots.props.spacing;
 assert.equal(dots.children.length,23);assert(dots.children.every(n=>n.type==='RoundedRectangle'));
 const totalDots=dotWidths.reduce((a,b)=>a+b,0)+22*gap,dotRight=dotLeft+totalDots;
 const iconLeft=contentLeft+icons.props.position.x-icons.props.frame.width/2,iconWidths=icons.children.map(n=>n.children[0].children[0].props.frame.width),iconGap=icons.props.spacing;
 const iconRight=iconLeft+iconWidths.reduce((a,b)=>a+b,0)+3*iconGap;
 const dividers=content.children.slice(1).flatMap(button=>button.children[0].children.filter(n=>n.type==='Rectangle')).map(n=>({left:contentLeft+n.props.position.x-n.props.frame.width/2,right:contentLeft+n.props.position.x+n.props.frame.width/2}));
 assert.equal(dividers.length,2);for(const pair of [{left:dotLeft,right:dotRight},{left:iconLeft,right:iconRight},...dividers]){close(pair.left,contentLeft);close(pair.right,contentRight)}
 assert(!hasPadding(content),'Actual JSX ancestry contains no padding modifiers');
 const radius=dots.children[0].props.cornerRadius,dotHeight=dots.children[0].props.frame.height;
 assert(radius<=Math.min(dotWidths[0],dotHeight)/2,'Rounding stays inside the rectangular frame');
 const raster=[2,3].map(scale=>{const boundaries=[dotLeft,dotRight,iconLeft,iconRight,...dividers.flatMap(d=>[d.left,d.right])].map(x=>Math.round(x*scale));for(let i=2;i<boundaries.length;i+=2){assert.equal(boundaries[i],boundaries[0]);assert.equal(boundaries[i+1],boundaries[1])}return {scale,leftPixels:boundaries[0],rightEdgePixels:boundaries[1],widthPixels:boundaries[1]-boundaries[0],deltaPixels:0}});
 results.push({family,width,height,contentLeft,contentRight,contentWidth:content.props.frame.width,leftMargin:contentLeft,rightMargin:width-contentRight,dots:{left:dotLeft,right:dotRight,width:totalDots,count:23,pointWidth:dotWidths[0],pointHeight:dotHeight,radius,gap,hstackFrameWidth:dots.props.frame.width,padding:0,deltaLeft:dotLeft-contentLeft,deltaRight:dotRight-contentRight,colors:dots.children.map(d=>d.props.fill)},icons:{left:iconLeft,right:iconRight,width:iconRight-iconLeft,cellWidth:iconWidths[0],gap:iconGap,padding:0},dividers,raster});
}
const report={baseCommit:'41b1b8cede5ef308d68be8125ee6da39cff9e03f',version:'1.6.4',simulation:true,nativeIOS:false,source:'Compiled actual view.tsx; external filled bounds, not centers. Geometry is identical to published 1.6.3.',formula:'23 * pointWidth + 22 * gap = contentWidth. HStack frame/position centers at contentWidth/2; no padding. Corner radius stays inside filled frames.',strokeCaveat:'Icon tile frames and fills align. Existing 0.6pt decorative outline may antialias differently in iOS; no physical raster verification. Dots have no stroke.',rounding:'2x/3x rounded external edge coordinates coincide. Interior rounded point widths/gaps may vary by subpixel; no independently rounded widths are accumulated.',results};
if(process.argv.includes('--write-preview'))fs.writeFileSync('validation/quota-margins-1.6.4.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS quota margins: 158x158 L8/R150/W142; 158x170 L6/R152/W146; 338x170 and 338x360 L17/R321/W304. Actual outer point/shortcut/divider bounds match; no padding, no accumulated rounding drift, 0px delta at 2x/3x. Native raster pending.');
