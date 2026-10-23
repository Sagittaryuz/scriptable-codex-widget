const assert=require('node:assert/strict'),vm=require('node:vm'),path=require('node:path');
const {buildSync}=require('esbuild');
const {validateSnapshot}=require('../scripting/scripts/Codex/model.ts');
const seed=require('../scripting/scripts/Codex/seed.json');
const code=buildSync({entryPoints:[path.resolve(__dirname,'../scripting/scripts/Codex/repository.ts')],bundle:true,write:false,format:'cjs',platform:'node',external:['scripting']}).outputFiles[0].text;
function setup({token='read-only-test',reply,cache=null}={}){
 const values=new Map(cache?[['codex-widget-snapshot-v2',cache]]:[]),secrets=new Map(token?[['codex-widget-github-readonly',token]]:[]),calls=[];
 const module={exports:{}};
 const scripting={Keychain:{get:k=>secrets.get(k)||null,set:(k,v)=>{secrets.set(k,v);return true}},fetch:async(url,options)=>{calls.push({url,options});return reply(url,options)}};
 vm.runInNewContext(code,{module,exports:module.exports,require:name=>{assert.equal(name,'scripting');return scripting},Storage:{get:k=>values.get(k)||null,set:(k,v)=>{values.set(k,v);return true}},console:{log:()=>{throw Error('O repositório não deve logar credenciais')}},Date,Set,JSON,Error});
 return {api:module.exports,calls,values,secrets};
}
const now=new Date().toISOString();
const fresh=validateSnapshot({...seed,generatedAt:now,usageObservedAt:now,tasksObservedAt:now});
let passed=0;async function test(name,fn){await fn();passed++;console.log('OK '+name)}
(async()=>{
 await test('Consulta autenticada vai apenas ao repositório fixo via HTTPS',async()=>{
  const x=setup({reply:async(url,options)=>{assert.equal(url,'https://api.github.com/repos/Sagittaryuz/scriptable-codex-widget/contents/data/scripting.json?ref=widget-data');assert.equal(options.headers.Authorization,'Bearer read-only-test');assert.equal(await options.handleRedirect({url:'https://other.test'}),null);return {ok:true,text:async()=>JSON.stringify(fresh)}}});
  const r=await x.api.refreshSnapshot();assert.equal(r.offline,false);assert.equal(x.values.size,1);assert.ok(!JSON.stringify([...x.values]).includes('read-only-test'));
 });
 await test('Falha de rede conserva snapshot e data de coleta',async()=>{
  const x=setup({cache:fresh,reply:async()=>{throw Error('network failure')}}),r=await x.api.refreshSnapshot();assert.equal(r.offline,true);assert.equal(r.snapshot.generatedAt,now);assert.equal(x.values.get('codex-widget-snapshot-v2').generatedAt,now);
 });
 await test('HTTP 401 não substitui cache nem apaga credencial',async()=>{
  const x=setup({cache:fresh,reply:async()=>({ok:false,status:401})}),r=await x.api.refreshSnapshot();assert.equal(r.offline,true);assert.equal(r.reason,'Reveja o acesso GitHub');assert.equal(x.secrets.size,1);assert.equal(x.values.get('codex-widget-snapshot-v2').generatedAt,now);
 });
 await test('JSON inválido e payload excessivo preservam o último funcional',async()=>{
  for(const text of ['<html>bad gateway</html>','x'.repeat(60001),JSON.stringify({...fresh,schemaVersion:9})]){
   const x=setup({cache:fresh,reply:async()=>({ok:true,text:async()=>text})}),r=await x.api.refreshSnapshot();assert.equal(r.offline,true);assert.equal(r.snapshot.generatedAt,now);
  }
 });
 await test('Resposta velha e horário futuro são recusados',async()=>{
  for(const generatedAt of ['2000-01-01T00:00:00Z',new Date(Date.now()+3600000).toISOString()]){
   const x=setup({cache:fresh,reply:async()=>({ok:true,text:async()=>JSON.stringify({...fresh,generatedAt})})}),r=await x.api.refreshSnapshot();assert.equal(r.offline,true);assert.equal(r.snapshot.generatedAt,now);
  }
 });
 await test('Sem token usa snapshot de instalação sem transmitir nada',async()=>{
  const x=setup({token:null,reply:async()=>{throw Error('Não deveria consultar')}}),r=await x.api.refreshSnapshot();assert.equal(r.offline,true);assert.equal(x.calls.length,0);assert.equal(r.snapshot.generatedAt,seed.generatedAt);
 });
 console.log(`${passed} verificações de rede/cache passaram.`);
})().catch(e=>{console.error(e);process.exitCode=1});
