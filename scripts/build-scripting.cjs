const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{buildSync,transformSync}=require('esbuild');
const root=path.resolve(__dirname,'../scripting/scripts/Codex');
let checked=0;
for(const file of fs.readdirSync(root).filter(n=>/\.tsx?$/.test(n))){
 const source=fs.readFileSync(path.join(root,file),'utf8');
 transformSync(source,{loader:file.endsWith('tsx')?'tsx':'ts',target:'es2022',jsx:'transform',jsxFactory:'createElement',jsxFragment:'Fragment'});
 if(file==='index.tsx'||file==='widget.tsx')buildSync({entryPoints:[path.join(root,file)],bundle:true,write:false,format:'cjs',platform:'neutral',external:['scripting'],target:'es2022',jsx:'transform',jsxFactory:'createElement',jsxFragment:'Fragment'});
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
const iconSource=fs.readFileSync(path.join(root,'chatgpt-icon.ts'),'utf8');
const iconMatch=iconSource.match(/CHATGPT_ICON\s*=\s*'([^']+)'/);
if(!iconMatch)throw Error('Ícone ChatGPT não encontrado.');
const icon=Buffer.from(iconMatch[1],'base64'),iconReference=fs.readFileSync(path.resolve(root,'../../../assets/chatgpt-app-icon-100.jpg'));
const iconSha256=crypto.createHash('sha256').update(icon).digest('hex');
if(!icon.equals(iconReference)||iconSha256!=='b34849bce75639449105eaad405e055ce8553129297ddc7c39e530252f79174e')throw Error('Ícone ChatGPT diverge da listagem oficial.');
console.log(JSON.stringify({syntaxPassed:true,files:checked,version:descriptor.version,backgroundSha256,iconSha256,nativeTypeCheck:fs.existsSync(path.resolve(root,'../../dts/scripting.d.ts'))?'available':'pending-device-connection'}));
