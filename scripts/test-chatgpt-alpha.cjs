const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto'),cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict'),{buildSync}=require('esbuild');
const asset=fs.readFileSync(path.resolve(__dirname,'../assets/header-chatgpt.png')),evidence=require('../validation/header-icons-1.6.5.json');
const {HEADER_ICONS,CHATGPT_GLYPH_SCALE}=require('../scripting/scripts/Codex/header-icons.ts');
assert.equal(crypto.createHash('sha256').update(asset).digest('hex'),evidence.assets.chatgpt.sha256);assert(Buffer.from(HEADER_ICONS.chatgpt,'base64').equals(asset));
assert.equal(asset.readUInt32BE(16),256);assert.equal(asset.readUInt32BE(20),256);assert.equal(asset[24],8);assert.equal(asset[25],6);
function rgba(png){
 let offset=8;const chunks=[];while(offset<png.length){const n=png.readUInt32BE(offset),type=png.toString('ascii',offset+4,offset+8);if(type==='IDAT')chunks.push(png.subarray(offset+8,offset+8+n));offset+=n+12}
 const raw=zlib.inflateSync(Buffer.concat(chunks)),out=Buffer.alloc(256*256*4),stride=256*4;
 function paeth(a,b,c){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c}
 for(let y=0;y<256;y++){const filter=raw[y*(stride+1)];assert(filter<=4);for(let x=0;x<stride;x++){const i=y*stride+x,a=x>=4?out[i-4]:0,b=y?out[i-stride]:0,c=y&&x>=4?out[i-stride-4]:0,v=raw[y*(stride+1)+1+x];out[i]=(v+(filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):filter===4?paeth(a,b,c):0))&255}}
 return out;
}
const pixels=rgba(asset);let transparent=0,partial=0,visible=0,minX=256,minY=256,maxX=-1,maxY=-1;
for(let y=0;y<256;y++)for(let x=0;x<256;x++){const i=(y*256+x)*4,a=pixels[i+3];if(x===0||y===0||x===255||y===255)assert.equal(a,0,'Every outer edge/corner is transparent');if(a===0)transparent++;else{visible++;if(a<255)partial++;assert.equal(pixels[i],255);assert.equal(pixels[i+1],255);assert.equal(pixels[i+2],255,'Every nontransparent pixel is straight white: no dark matte/halo');minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y)}}
assert(transparent>30000);assert(partial>0);assert(visible>0);assert.deepEqual([minX,minY,maxX+1,maxY+1],[1,2,255,254]);
assert(Math.abs(254*CHATGPT_GLYPH_SCALE-210)<1e-9,'Preserve prior 210px-wide white mark footprint');assert(Math.abs(252*CHATGPT_GLYPH_SCALE-209)<1,'Vertical footprint differs by less than one source pixel');
for(const name of ['codex','voice','dots']){const bytes=fs.readFileSync(path.resolve(__dirname,'../assets/header-'+name+'.png'));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),require('../validation/header-icons-1.4.1.json').assets[name].sha256)}
const source='C:/Program Files/WindowsApps/OpenAI.Codex_26.1021.3705.0_x64__2p2nqsd0c76g0/app/resources/chatgpt-app-dark.ico';
if(fs.existsSync(source)){const ico=fs.readFileSync(source);assert.equal(crypto.createHash('sha256').update(ico).digest('hex'),evidence.chatgptSource.icoSha256);let matched=false;for(let i=0;i<ico.readUInt16LE(4);i++){const p=6+i*16;if((ico[p]||256)===256&&(ico[p+1]||256)===256){const n=ico.readUInt32LE(p+8),o=ico.readUInt32LE(p+12);matched=ico.subarray(o,o+n).equals(asset)}}assert(matched,'PNG is copied byte-for-byte from the official ICO; no raster background editing')}
const root=path.resolve(__dirname,'../scripting/scripts/Codex');
function compile(contents){const code=buildSync({stdin:{contents,loader:'tsx',resolveDir:root},bundle:true,write:false,platform:'node',format:'cjs',external:['scripting'],jsxFactory:'createElement'}).outputFiles[0].text,m={exports:{}};const createElement=(type,props,...children)=>typeof type==='function'?type({...props,children:children.flat(Infinity).filter(Boolean)}):({type,props:props||{},children:children.flat(Infinity).filter(Boolean)});vm.runInNewContext(code,{module:m,exports:m.exports,require:()=>new Proxy({},{get:(o,k)=>k}),Date,Set,JSON,createElement,UIImage:{fromBase64String:data=>({data})}});return m.exports}
const before=compile(cp.execFileSync('git',['show','4086ab9:scripting/scripts/Codex/header.tsx'],{encoding:'utf8'})),after=compile(fs.readFileSync(path.join(root,'header.tsx'),'utf8'));
const {referenceLayout}=require('../scripting/scripts/Codex/content-layout.ts'),iso=new Date().toISOString(),snapshot={schemaVersion:2,generatedAt:iso,usageObservedAt:iso,tasksObservedAt:iso,coverage:'Synthetic alpha test',windows:[{remainingPercent:86,usedPercent:14,windowDurationMins:300,resetsAt:null}],tasks:[]};
const plain=x=>JSON.parse(JSON.stringify(x));
for(const [family,w,h]of [['systemSmall',158,158],['systemSmall',158,170],['systemMedium',338,170],['systemLarge',338,360]]){
 const layout=referenceLayout(family,w,h),a=plain(before.ShortcutHeader({snapshot,layout})),b=plain(after.ShortcutHeader({snapshot,layout}));
 const firstImage=n=>n.children[0].children[0].children[0].children[1].children[1].children[0];
 const oldImage=firstImage(a),newImage=firstImage(b);assert.equal(newImage.props.frame.width,oldImage.props.frame.width*CHATGPT_GLYPH_SCALE);assert.equal(newImage.props.frame.height,oldImage.props.frame.height*CHATGPT_GLYPH_SCALE);
 oldImage.props.frame=newImage.props.frame;
 assert.deepEqual(a,b,'Approved transparent ChatGPT fit only; outer box, padding, badges, other icons, quota points and summary identical');
}
if(process.argv.includes('--write-evidence'))fs.writeFileSync(path.resolve(__dirname,'../validation/chatgpt-alpha-1.6.5.json'),JSON.stringify({version:'1.6.5',nativeIOS:false,resolution:[256,256],alphaRange:[0,255],transparentPixels:transparent,partialAlphaPixels:partial,visiblePixels:visible,allVisiblePixelsRGB:[255,255,255],alphaBounds:[minX,minY,maxX+1,maxY+1],allEdgesAndCornersTransparent:true,pngBytesUnmodifiedFromOfficialICO:true,scale:CHATGPT_GLYPH_SCALE,priorWhiteWidthPixels:210,currentWhiteWidthPixels:254*CHATGPT_GLYPH_SCALE,currentWhiteHeightPixels:252*CHATGPT_GLYPH_SCALE,otherAssetsUnchanged:true,headerGeometryAndOtherElementsUnchanged:true},null,2)+'\n');
console.log('PASS ChatGPT alpha: official PNG byte copy, 256px, transparent borders/corners/holes, straight white antialias without black matte, prior glyph footprint, embedded bytes and other three icons/geometry/links/quota unchanged in four dimensions. Native iOS pending.');
