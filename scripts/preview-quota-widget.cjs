// Export the real TSX tree; rasterization is an explicitly approximate simulation.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{buildSync}=require('esbuild');
const root=path.resolve(__dirname,'../scripting/scripts/Codex'),m={exports:{}};
const code=buildSync({entryPoints:[path.join(root,'view.tsx')],bundle:true,write:false,platform:'node',format:'cjs',external:['scripting'],jsxFactory:'createElement'}).outputFiles[0].text;
const sdk=new Proxy({AppIntentManager:{register:d=>()=>({name:d.name})},AppIntentProtocol:{AppIntent:0}},{get:(o,k)=>o[k]??k});
const createElement=(type,props,...children)=>typeof type==='function'?type({...props,children:children.flat(Infinity).filter(Boolean)}):({type,props:props||{},children:children.flat(Infinity).filter(Boolean)});
vm.runInNewContext(code,{module:m,exports:m.exports,require:()=>sdk,Date,Set,Map,JSON,createElement,UIImage:{fromBase64String:base64=>({base64})}});
const iso=new Date().toISOString(),snapshot={schemaVersion:2,generatedAt:iso,usageObservedAt:iso,tasksObservedAt:iso,coverage:'Synthetic preview',windows:[{remainingPercent:86,usedPercent:14,windowDurationMins:300,resetsAt:null}],tasks:['input','running','ready'].map((state,i)=>({id:'synthetic-'+i,title:['Tarefa de demonstração','Exemplo em execução','Resposta de exemplo'][i],state,origin:['Local','Cloud','ChatGPT'][i],hostLabel:'Computador de teste',observedAt:iso,detail:'Synthetic fixture'}))};
fs.mkdirSync(path.resolve(__dirname,'../work'),{recursive:true});
fs.writeFileSync(path.resolve(__dirname,'../work/quota-full-widget-tree.json'),JSON.stringify({simulation:true,nativeIOS:false,family:'systemLarge',width:338,height:360,outputWidth:1080,description:'Scale chosen for a 971px limit line from the parent reference measurement; original full-image dimensions unavailable to this executor. Actual TSX tree, synthetic data, approximate typography and SF Symbols.',tree:m.exports.CodexView({snapshot,family:'systemLarge',width:338,height:360})}));
console.log('Exported actual synthetic widget tree for approximate raster preview.');
