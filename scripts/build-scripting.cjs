const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{buildSync,transformSync}=require('esbuild');
const root=path.resolve(__dirname,'../scripting/scripts/Codex');
let checked=0;
for(const file of fs.readdirSync(root).filter(n=>/\.tsx?$/.test(n))){
 const source=fs.readFileSync(path.join(root,file),'utf8');
 transformSync(source,{loader:file.endsWith('tsx')?'tsx':'ts',target:'es2022',jsx:'transform',jsxFactory:'createElement',jsxFragment:'Fragment'});
 if(file.endsWith('.tsx'))buildSync({entryPoints:[path.join(root,file)],bundle:true,write:false,format:'cjs',platform:'neutral',external:['scripting'],target:'es2022',jsx:'transform',jsxFactory:'createElement',jsxFragment:'Fragment'});
 checked++;
}
const descriptor=JSON.parse(fs.readFileSync(path.join(root,'script.json'),'utf8'));
for(const key of ['name','icon','color','version'])if(!descriptor[key])throw Error('Descritor incompleto: '+key);
if(descriptor.name!=='Codex')throw Error('Nome do projeto diferente da pasta.');
const backgroundSource=fs.readFileSync(path.join(root,'background.ts'),'utf8');
const backgroundMatch=backgroundSource.match(/POPULAR_BACKGROUND\s*=\s*'([^']+)'/);
if(!backgroundMatch)throw Error('Fundo Popular não encontrado.');
const embedded=Buffer.from(backgroundMatch[1],'base64');
const reference=fs.readFileSync(path.resolve(root,'../../../assets/popular-background.png'));
const backgroundSha256=crypto.createHash('sha256').update(embedded).digest('hex');
if(!embedded.equals(reference)||backgroundSha256!=='5d0fc7f05533af6534525cf8f86484028614a01587b717fa7d99836b9c00c094')throw Error('Fundo diverge da referência Popular.');
const iconSource=fs.readFileSync(path.join(root,'codex-symbol.ts'),'utf8');
const iconMatch=iconSource.match(/CODEX_SYMBOL\s*=\s*'([^']+)'/);
if(!iconMatch)throw Error('Símbolo Codex não encontrado.');
const icon=Buffer.from(iconMatch[1],'base64'),iconReference=fs.readFileSync(path.resolve(root,'../../../assets/codex-symbol-white.png'));
const iconSha256=crypto.createHash('sha256').update(icon).digest('hex');
if(!icon.equals(iconReference)||iconSha256!=='283d9f0164bf6526f1d390fd88cb787d9a936fc390fc7c2f68d6cb988e15f732')throw Error('Símbolo Codex diverge da referência aprovada.');
console.log(JSON.stringify({syntaxPassed:true,files:checked,version:descriptor.version,backgroundSha256,iconSha256,nativeTypeCheck:fs.existsSync(path.resolve(root,'../../dts/scripting.d.ts'))?'available':'pending-device-connection'}));

const headerIcons=require('../scripting/scripts/Codex/header-icons.ts').HEADER_ICONS;
const headerEvidence=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../validation/header-icons-1.4.0.json'),'utf8'));
for(const [name,data]of Object.entries(headerIcons)){
 const bytes=Buffer.from(data,'base64'),asset=fs.readFileSync(path.resolve(__dirname,'../assets/header-'+name+'.png'));
 if(!bytes.equals(asset)||crypto.createHash('sha256').update(bytes).digest('hex')!==headerEvidence.assets[name].sha256)throw Error('Ícone incorporado diverge: '+name);
 if(bytes.readUInt32BE(16)!==96||bytes.readUInt32BE(20)!==96)throw Error('Ícone deve ter 96px: '+name);
}
