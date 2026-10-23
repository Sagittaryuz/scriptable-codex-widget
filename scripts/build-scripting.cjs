const fs=require('node:fs'),path=require('node:path'),{buildSync,transformSync}=require('esbuild');
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
console.log(JSON.stringify({syntaxPassed:true,files:checked,version:descriptor.version,nativeTypeCheck:fs.existsSync(path.resolve(root,'../../dts/scripting.d.ts'))?'available':'pending-device-connection'}));
