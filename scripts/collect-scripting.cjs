// Publishes minimal metadata only. Uses the existing local Codex/GitHub sessions.
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const {CodexReader}=require('./scripting-rpc.cjs');
const {makeSnapshot}=require('./scripting-model.cjs');
const ROOT=path.resolve(__dirname,'..');
const runtimeFile=path.join(ROOT,'work/scripting-runtime.json');
const runtime=fs.existsSync(runtimeFile)?JSON.parse(fs.readFileSync(runtimeFile,'utf8').replace(/^\uFEFF/,'')):{};
const executable=bin=>runtime.executables?.[bin]||bin;
const REPO='Sagittaryuz/scriptable-codex-widget',BRANCH='widget-data',FILE='data/scripting.json';
const PRIVATE_REPO='Sagittaryuz/codex-widget-private-data';
function commandError(bin,args,result){
 const error=Error(`${bin} não concluiu a operação.`),message=String(result.stderr||'');
 error.operation=bin+':'+args[0];
 error.code=result.error?.code||(/HTTP 401|not logged|authentication|could not read Username/i.test(message)?'authentication-unavailable':/HTTP 403/i.test(message)?'http-403':/safe.directory|dubious ownership/i.test(message)?'git-ownership':/HTTP 409|sha.*match|not.*fast.forward/i.test(message)?'concurrent-update':'command-failed');
 return error;
}
const run=(bin,args,input)=>{
 const r=cp.spawnSync(executable(bin),args,{input,encoding:'utf8',windowsHide:true,cwd:ROOT,timeout:30000});
 if(r.status!==0)throw commandError(bin,args,r);return r.stdout.trim();
};
async function collect(){
 const rpc=new CodexReader({command:executable('codex'),args:['app-server','--listen','stdio://']});
 try{
  await rpc.initialize();
  const [usage,page]=await Promise.all([rpc.request('account/rateLimits/read'),rpc.request('thread/list',{limit:30,sortKey:'updated_at',archived:false})]);
  const threads=page.data.filter(t=>!t.parentThreadId&&t.name).slice(0,20),turns=new Map();
  // Bound concurrency; request no chat or tool item contents.
  for(let i=0;i<threads.length;i+=4)await Promise.all(threads.slice(i,i+4).map(async t=>{
   const r=await rpc.request('thread/turns/list',{threadId:t.id,limit:1,sortDirection:'desc',itemsView:'notLoaded'});
   turns.set(t.id,r.data[0]);
  }));
  return makeSnapshot(usage,threads,turns);
 }finally{rpc.close()}
}
function publishFile(repo,branch,snapshot){
 const remote=run('git',['remote','get-url','origin']);
 if(remote!==`https://github.com/${REPO}.git`)throw Error('Remote inesperado.');
 const endpoint=`repos/${repo}/contents/${FILE}`;
 const existing=cp.spawnSync(executable('gh'),['api',endpoint+`?ref=${branch}`],{encoding:'utf8',windowsHide:true,cwd:ROOT,timeout:30000});
 let previous=null;
 if(existing.status===0)previous=JSON.parse(existing.stdout);
 else if(!existing.stderr.includes('404'))throw commandError('gh',['api-read'],existing);
 const content=Buffer.from(JSON.stringify(snapshot,null,2)+'\n').toString('base64');
 const payload={message:'data: atualizar observação local',branch,...(previous?{sha:previous.sha}:{}),content};
 const result=JSON.parse(run('gh',['api','--method','PUT',endpoint,'--input','-'],JSON.stringify(payload)));
 const readback=JSON.parse(run('gh',['api',endpoint+`?ref=${branch}`]));
 if(readback.content.replace(/\s/g,'')!==content)throw Error('Leitura remota diverge do envio.');
 return result.commit.sha;
}
function publicSnapshot(snapshot){return {...snapshot,tasks:[],windows:[],coverage:'Tarefas e limites disponíveis somente no canal privado. Conecte o GitHub no Scripting.'}}
function publish(snapshot){
 const repository=JSON.parse(run('gh',['api',`repos/${PRIVATE_REPO}`]));
 if(repository.private!==true)throw Error('Destino dos dados pessoais precisa ser privado.');
 const privateCommit=publishFile(PRIVATE_REPO,'main',snapshot);
 const publicCommit=publishFile(REPO,BRANCH,publicSnapshot(snapshot));
 return {privateCommit,publicCommit};
}
async function main(){
 const snapshot=await collect();
 if(process.argv.includes('--push')){
  const commit=publish(snapshot);console.log(JSON.stringify({published:true,commit,tasks:snapshot.tasks.length,collectedAt:snapshot.generatedAt,coverage:snapshot.coverage}));
 }else{
  const output=process.argv.indexOf('--out');
  if(output>=0){const file=path.resolve(process.argv[output+1]);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(snapshot,null,2)+'\n');}
  console.log(JSON.stringify({collected:true,tasks:snapshot.tasks.length,remaining:snapshot.windows.map(w=>w.remainingPercent),collectedAt:snapshot.generatedAt,coverage:snapshot.coverage}));
 }
}
if(require.main===module)main().catch(()=>{console.error('Coleta não concluída; último snapshot preservado.');process.exitCode=1});
module.exports={collect,publish,publicSnapshot};
