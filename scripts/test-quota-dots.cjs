const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict'),{buildSync}=require('esbuild');
const {quotaDots,quotaDotGeometry}=require('../scripting/scripts/Codex/quota-dots.ts'),{referenceLayout}=require('../scripting/scripts/Codex/content-layout.ts');
const root=path.resolve(__dirname,'../scripting/scripts/Codex'),iso=new Date().toISOString(),old='2000-01-01T00:00:00Z';
function compile(file,contents){const m={exports:{}},options=contents?{stdin:{contents,loader:'tsx',resolveDir:root}}:{entryPoints:[path.join(root,file)]};const code=buildSync({...options,bundle:true,write:false,platform:'node',format:'cjs',external:['scripting'],jsxFactory:'createElement'}).outputFiles[0].text;
 const sdk=new Proxy({AppIntentManager:{register:d=>()=>({name:d.name})},AppIntentProtocol:{AppIntent:0}},{get:(o,k)=>o[k]??k});
 const createElement=(type,props,...children)=>typeof type==='function'?type({...props,children:children.flat(Infinity).filter(Boolean)}):({type,props:props||{},children:children.flat(Infinity).filter(Boolean)});
 vm.runInNewContext(code,{module:m,exports:m.exports,require:()=>sdk,Date,Set,Map,JSON,createElement,UIImage:{fromBase64String:()=>({syntheticImage:true})}});return m.exports;
}
const view=compile('view.tsx'),before=compile(null,cp.execFileSync('git',['show','04eb9c0:scripting/scripts/Codex/header.tsx'],{encoding:'utf8'}));
const snapshot=(values,observedAt=iso)=>({schemaVersion:2,generatedAt:iso,usageObservedAt:observedAt,tasksObservedAt:iso,coverage:'synthetic',windows:values.map((r,i)=>({remainingPercent:r,usedPercent:100-r,windowDurationMins:i?10080:300,resetsAt:null})),tasks:[{id:'synthetic-task',title:'Synthetic task',state:'input',origin:'Local',observedAt:iso,detail:'Synthetic explicit input'}]});
const plain=x=>JSON.parse(JSON.stringify(x)),nodes=(n,type)=>!n||typeof n!=='object'?[]:[...(n.type===type?[n]:[]),...(n.children||[]).flatMap(c=>nodes(c,type))];
for(const [remaining,active]of [[0,0],[1,1],[5,1],[10,2],[19,4],[20,5],[50,12],[69,16],[70,16],[86,20],[99,22],[100,23]]){const d=quotaDots(remaining);assert.equal(d.count,23);assert.equal(d.active,active)}
const palette=quotaDots(100).colors;assert.equal(palette[0],'#ff453a');assert.equal(palette[11],'#ffd60a');assert.equal(palette[22],'#30d158');assert.equal(new Set(palette).size,23);
for(const remaining of [100,86,50,20,10,1,0])assert.deepEqual(quotaDots(remaining).colors,palette,'Positions keep their colors as rightmost points go dark');
assert.equal(quotaDots(1).active,1);assert.equal(quotaDots(1).colors[0],'#ff453a','Final remaining point is intense red on the left');
for(const value of [undefined,null,NaN,Infinity,-1,101,'50']){assert.equal(quotaDots(value).active,null,'Invalid/absent is unknown, not 0');assert.equal(quotaDots(value).inactive,'#69696E')}
assert.equal(quotaDots(50,true).active,null);assert.equal(quotaDots(50,true).inactive,'#69696E');
let previous=0;for(let r=0;r<=100;r+=.25){const count=quotaDots(r).active;assert(count>=previous&&count<=23);if(r<100)assert(count<23);if(r>0)assert(count>0);previous=count}
const gallery=[];
for(const [family,width,height]of [['systemSmall',158,158],['systemSmall',158,170],['systemMedium',338,170],['systemLarge',338,360]]){
 const layout=referenceLayout(family,width,height),scenarios=[];
 for(const [name,values,at]of [['100%',[100]],['86%',[86]],['50%',[50]],['20%',[20]],['10%',[10]],['1%',[1]],['0%',[0]],['Indisponível',[]],['Antigo',[50],old],['Janelas 80% / 20%',[80,20]],['Janelas 20% / 80%',[20,80]]]){
  const snap=snapshot(values,at),tree=view.CodexView({snapshot:snap,family,width,height}),header=family==='systemSmall'?tree.children.find(n=>n.type==='VStack').children[0].children[0]:tree.children.find(n=>n.type==='VStack').children[0],baseline=before.ShortcutHeader({snapshot:snap,layout});
  if(layout.small)baseline.props.frame.height=header.props.frame.height;assert.deepEqual(plain(header.props),plain(baseline.props),'Header geometry except approved small summary extent unchanged');
  const priorIcons=plain(baseline.children[0]),currentIcons=plain(header.children[0]);
  const icon=row=>row.children[0].children[0].children[1].children[1].children[0],priorImage=icon(priorIcons),currentImage=icon(currentIcons),glyphScale=require('../scripting/scripts/Codex/header-icons.ts').CHATGPT_GLYPH_SCALE;
  assert.equal(currentImage.props.frame.width,priorImage.props.frame.width*glyphScale);assert.equal(currentImage.props.frame.height,priorImage.props.frame.height*glyphScale);
  priorImage.props.frame=currentImage.props.frame;
  assert.deepEqual(currentIcons,priorIcons,'Shortcut links/outer boxes/other icons/labels unchanged; approved transparent ChatGPT inner fit only');
  if(!layout.small)assert.deepEqual(plain(header.children[2]),plain(baseline.children[2]),'Percentage/reset/font/position unchanged in larger widgets');
  const line=header.children[1],summary=header.children[2],dots=line.children;
  const geometry=quotaDotGeometry(layout.width);
  assert.equal(line.type,'HStack');assert.equal(dots.length,23);assert.equal(line.props.frame.width,layout.width);assert.equal(line.props.frame.height,geometry.height);
  assert.deepEqual(plain(line.props.position),plain(baseline.children[1].props.position));
  assert(Math.abs(dots.length*geometry.width+22*line.props.spacing-layout.width)<1e-8,'Dots span the same approved boundaries');assert(line.props.spacing>0);
  assert(Math.abs(geometry.width/layout.width-31/971)<1e-8);assert(Math.abs(geometry.height/layout.width-29/971)<1e-8);
  assert(line.props.position.y-geometry.height/2>header.children[0].props.frame.height,'Expanded dots fit in existing upper gap');
  const firstText=layout.small?summary.children[0]:summary;assert(line.props.position.y+geometry.height/2<firstText.props.position.y-firstText.props.frame.height/2,'Dots reserve clear space above quota text');
  const expected=quotaDots(values.length?Math.min(...values):undefined,at===old),lit=dots.filter(d=>d.props.fill!==expected.inactive&&expected.active!=null).length;
  dots.forEach((dot,i)=>assert.equal(dot.props.fill,expected.active!=null&&i<expected.active?expected.colors[i]:expected.inactive,'Fixed red-left / green-right gradient; inactive dots remain at the right'));
  assert.equal(lit,expected.active??0);assert(dots.every(d=>d.type==='RoundedRectangle'&&d.props.frame.width===geometry.width&&d.props.frame.height===geometry.height&&d.props.cornerRadius===geometry.radius));
  const text=nodes(summary,'Text').map(n=>n.children.join('')).join(' ');if(!values.length){assert(text.includes(layout.small?'—':'Limite indisponível'));assert(!text.includes('0%'));assert(dots.every(d=>d.props.fill==='#69696E'))}if(at===old){assert(text.includes('Antigo'));assert(dots.every(d=>d.props.fill==='#69696E'))}
  assert(nodes(tree,'Text').some(n=>n.children.join('')==='Pergunta'),'Question capsule retained');
  scenarios.push({name,line:plain(line),summary:plain(summary)});
 }
 gallery.push({family,width,height,layout,scenarios});
}
if(process.argv.includes('--write-preview')){
 const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');let y=50;const shapes=[];
 for(const panel of gallery){shapes.push(`<text x="20" y="${y}" fill="white" font-size="14">${panel.family} ${panel.width}×${panel.height}</text>`);y+=30;
  for(const s of panel.scenarios){const x=190,g=quotaDotGeometry(panel.layout.width);shapes.push(`<text x="20" y="${y+4}" fill="#ccc" font-size="12">${escape(s.name)}</text>`);s.line.children.forEach((dot,i)=>shapes.push(`<rect x="${x+i*(g.width+s.line.props.spacing)}" y="${y-g.height/2}" width="${g.width}" height="${g.height}" rx="${g.radius}" fill="${dot.props.fill}"/>`));shapes.push(`<text x="${x+panel.layout.width/2}" y="${y+panel.layout.bar/2+panel.layout.belowBar+panel.layout.quota}" fill="white" text-anchor="middle" font-size="${panel.layout.quota}">${escape(s.summary.children.join(''))}</text>`);y+=38;}y+=20;
 }
 fs.writeFileSync(path.resolve(__dirname,'../validation/quota-dots-1.6.4.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="540" height="${y}" viewBox="0 0 540 ${y}"><rect width="540" height="${y}" fill="#1e1e1e"/><g font-family="Arial,sans-serif"><text x="20" y="22" fill="white" font-size="12">SIMULAÇÃO · linha real compilada · dados sintéticos · não iOS</text>${shapes.join('')}</g></svg>\n`);
 fs.writeFileSync(path.resolve(__dirname,'../validation/quota-dots-1.6.4.json'),JSON.stringify({version:'1.6.4',simulation:true,nativeIOS:false,description:'Actual compiled header line and summary, synthetic observations; SVG uses approximate Arial typography. All other header children unchanged against 1.6.1.',referenceStatus:'Official Library materialization failed on Windows os.setxattr; no final local reference file or own inspection. Latest explicit user correction: fixed positional intense red on the left, yellow in the middle, green on the right. Low balances retain the left red points. Geometry unchanged; original reference materialization remains unsupported in this executor.',gallery},null,2)+'\n');
}
console.log('PASS quota dots: fixed positional red-left/yellow-center/green-right gradient, 23 dots, 86%=20 lit/3 dark, 0/1/low/50/100%, monotonic buckets, absent/invalid/stale, independent windows, four dimensions, unchanged geometry/shortcuts/percent/reset and Pergunta. Synthetic corrected-color preview; physical iOS pending.');
