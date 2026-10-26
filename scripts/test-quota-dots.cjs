const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict'),{buildSync}=require('esbuild');
const {quotaDots}=require('../scripting/scripts/Codex/quota-dots.ts'),{referenceLayout}=require('../scripting/scripts/Codex/content-layout.ts');
const root=path.resolve(__dirname,'../scripting/scripts/Codex'),iso=new Date().toISOString(),old='2000-01-01T00:00:00Z';
function compile(file,contents){const m={exports:{}},options=contents?{stdin:{contents,loader:'tsx',resolveDir:root}}:{entryPoints:[path.join(root,file)]};const code=buildSync({...options,bundle:true,write:false,platform:'node',format:'cjs',external:['scripting'],jsxFactory:'createElement'}).outputFiles[0].text;
 const sdk=new Proxy({AppIntentManager:{register:d=>()=>({name:d.name})},AppIntentProtocol:{AppIntent:0}},{get:(o,k)=>o[k]??k});
 const createElement=(type,props,...children)=>typeof type==='function'?type({...props,children:children.flat(Infinity).filter(Boolean)}):({type,props:props||{},children:children.flat(Infinity).filter(Boolean)});
 vm.runInNewContext(code,{module:m,exports:m.exports,require:()=>sdk,Date,Set,Map,JSON,createElement,UIImage:{fromBase64String:()=>({syntheticImage:true})}});return m.exports;
}
const view=compile('view.tsx'),before=compile(null,cp.execFileSync('git',['show','04eb9c0:scripting/scripts/Codex/header.tsx'],{encoding:'utf8'}));
const snapshot=(values,observedAt=iso)=>({schemaVersion:2,generatedAt:iso,usageObservedAt:observedAt,tasksObservedAt:iso,coverage:'synthetic',windows:values.map((r,i)=>({remainingPercent:r,usedPercent:100-r,windowDurationMins:i?10080:300,resetsAt:null})),tasks:[{id:'synthetic-task',title:'Synthetic task',state:'input',origin:'Local',observedAt:iso,detail:'Synthetic explicit input'}]});
const plain=x=>JSON.parse(JSON.stringify(x)),nodes=(n,type)=>!n||typeof n!=='object'?[]:[...(n.type===type?[n]:[]),...(n.children||[]).flatMap(c=>nodes(c,type))];
for(const [remaining,active,color]of [[0,0,'#FF4B55'],[1,1,'#FF4B55'],[5,1,'#FF4B55'],[10,2,'#FF4B55'],[19,3,'#FF4B55'],[20,4,'#FFBD2E'],[50,10,'#FFBD2E'],[69,13,'#FFBD2E'],[70,14,'#30D158'],[99,19,'#30D158'],[100,20,'#30D158']]){const d=quotaDots(remaining);assert.equal(d.count,20);assert.equal(d.active,active);assert.equal(d.color,color)}
for(const value of [undefined,null,NaN,Infinity,-1,101,'50'])assert.equal(quotaDots(value).active,null,'Invalid/absent is unknown, not 0');
assert.equal(quotaDots(50,true).active,null);
let previous=0;for(let r=0;r<=100;r+=.25){const count=quotaDots(r).active;assert(count>=previous&&count<=20);if(r<100)assert(count<20);if(r>0)assert(count>0);previous=count}
const gallery=[];
for(const [family,width,height]of [['systemSmall',158,158],['systemSmall',158,170],['systemMedium',338,170],['systemLarge',338,360]]){
 const layout=referenceLayout(family,width,height),scenarios=[];
 for(const [name,values,at]of [['100%',[100]],['50%',[50]],['10%',[10]],['1%',[1]],['0%',[0]],['Indisponível',[]],['Antigo',[50],old],['Janelas 80% / 20%',[80,20]],['Janelas 20% / 80%',[20,80]]]){
  const snap=snapshot(values,at),tree=view.CodexView({snapshot:snap,family,width,height}),header=tree.children.find(n=>n.type==='VStack').children[0],baseline=before.ShortcutHeader({snapshot:snap,layout});
  assert.deepEqual(plain(header.props),plain(baseline.props),'Header geometry unchanged');
  assert.deepEqual(plain(header.children[0]),plain(baseline.children[0]),'Shortcut links/icons/labels unchanged');
  assert.deepEqual(plain(header.children[2]),plain(baseline.children[2]),'Percentage/reset/font/position unchanged');
  const line=header.children[1],summary=header.children[2],dots=line.children;
  assert.equal(line.type,'HStack');assert.equal(dots.length,20);assert.equal(line.props.frame.width,layout.width);assert.equal(line.props.frame.height,layout.bar);
  assert.deepEqual(plain(line.props.position),plain(baseline.children[1].props.position));
  assert(Math.abs(dots.length*layout.bar+19*line.props.spacing-layout.width)<1e-8,'Dots span the same approved boundaries');assert(line.props.spacing>0);
  const expected=quotaDots(values.length?Math.min(...values):undefined,at===old),lit=dots.filter(d=>d.props.fill===expected.color&&expected.active!=null).length;
  assert.equal(lit,expected.active??0);assert(dots.every(d=>d.type==='Circle'&&d.props.frame.width===layout.bar&&d.props.frame.height===layout.bar));
  const text=summary.children.join('');if(!values.length){assert(text.includes('Limite indisponível'));assert(!text.includes('0%'));assert(dots.every(d=>d.props.fill==='#69696E'))}if(at===old){assert(text.includes('Antigo'));assert(dots.every(d=>d.props.fill==='#69696E'))}
  assert(nodes(tree,'Text').some(n=>n.children.join('')==='Pergunta'),'Question capsule retained');
  scenarios.push({name,line:plain(line),summary:plain(summary)});
 }
 gallery.push({family,width,height,layout,scenarios});
}
if(process.argv.includes('--write-preview')){
 const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');let y=50;const shapes=[];
 for(const panel of gallery){shapes.push(`<text x="20" y="${y}" fill="white" font-size="14">${panel.family} ${panel.width}×${panel.height}</text>`);y+=30;
  for(const s of panel.scenarios){const x=190,diam=panel.layout.bar;shapes.push(`<text x="20" y="${y+4}" fill="#ccc" font-size="12">${escape(s.name)}</text>`);s.line.children.forEach((dot,i)=>shapes.push(`<circle cx="${x+diam/2+i*(diam+s.line.props.spacing)}" cy="${y}" r="${diam/2}" fill="${dot.props.fill}"/>`));shapes.push(`<text x="${x+panel.layout.width/2}" y="${y+diam/2+panel.layout.belowBar+panel.layout.quota}" fill="white" text-anchor="middle" font-size="${panel.layout.quota}">${escape(s.summary.children.join(''))}</text>`);y+=38;}y+=20;
 }
 fs.writeFileSync(path.resolve(__dirname,'../validation/quota-dots-1.6.2.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="540" height="${y}" viewBox="0 0 540 ${y}"><rect width="540" height="${y}" fill="#1e1e1e"/><g font-family="Arial,sans-serif"><text x="20" y="22" fill="white" font-size="12">SIMULAÇÃO · linha real compilada · dados sintéticos · não iOS</text>${shapes.join('')}</g></svg>\n`);
 fs.writeFileSync(path.resolve(__dirname,'../validation/quota-dots-1.6.2.json'),JSON.stringify({version:'1.6.2',simulation:true,nativeIOS:false,description:'Actual compiled header line and summary, synthetic observations; SVG uses approximate Arial typography. All other header children unchanged against 1.6.1.',gallery},null,2)+'\n');
}
console.log('PASS quota dots: 0/1/low/50/100%, monotonic 5% buckets, colors, absent/invalid/stale, independent windows without averaging, four dimensions, unchanged header geometry/shortcuts/percent/reset and Pergunta capsule. Synthetic preview; physical iOS pending.');
