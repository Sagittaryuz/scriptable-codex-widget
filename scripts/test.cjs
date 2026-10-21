const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const {normalizeSnapshot}=require('./snapshot.cjs');
const source=fs.readFileSync('Codex.js','utf8'),loader=fs.readFileSync('Codex-Auto.js','utf8');
const snapshot=JSON.parse(fs.readFileSync('data/tasks.json','utf8'));
let checks=0;
function check(value,message){assert.ok(value,message);checks++;}
class Node {
  constructor(type='stack',value){this.type=type;this.value=value;this.children=[];}
  addStack(){const n=new Node();this.children.push(n);return n;}
  addText(v){const n=new Node('text',v);this.children.push(n);return n;}
  addImage(v){const n=new Node('image',v);this.children.push(n);return n;}
  addSpacer(v){this.children.push(new Node('spacer',v));}
  setPadding(...v){this.padding=v;}
  centerAlignContent(){} layoutVertically(){this.vertical=true;} layoutHorizontally(){}
  async presentSmall(){} async presentMedium(){} async presentLarge(){}
}
function context(family='large',options={}) {
  const files=new Map(options.files||[]),widgets=[],requests=[];
  class Color {constructor(hex){this.hex=hex;}static white(){return new Color('FFFFFF');}}
  class Request {
    constructor(url){this.url=url;requests.push(this);}
    async loadString(){
      const code=this.url.includes('/Codex.js?');
      const status=code?(options.codeStatus||200):(options.dataStatus||200);this.response={statusCode:status};
      if(options.offline)throw Error('Sem conexão');
      return code?(options.code===undefined?source:options.code):(options.data===undefined?JSON.stringify(snapshot):options.data);
    }
  }
  const sandbox={config:{runsInWidget:true,widgetFamily:family},args:{queryParameters:{},widgetParameter:''},ListWidget:class extends Node{},Color,
    Font:{systemFont:size=>({size})},Size:class{constructor(width,height){this.width=width;this.height=height;}},
    SFSymbol:{named:name=>({image:name,applyFont(){}})},Image:{fromData:data=>data},Data:{fromBase64String:s=>s},Request,
    Keychain:{contains:()=>!options.noToken,get:()=> 'fake-test-token'},
    FileManager:{local:()=>({documentsDirectory:()=>'/cache',joinPath:(a,b)=>a+'/'+b,fileExists:p=>files.has(p),readString:p=>files.get(p),writeString:(p,v)=>files.set(p,v)})},
    Script:{name:()=> 'Codex-Auto',setWidget:w=>widgets.push(w),complete(){}},console:{log(){}},URL,Date,Set,Proxy};
  return {sandbox,files,widgets,requests};
}
async function run(text,c){return vm.runInNewContext('(async()=>{'+text+'\n})()',c.sandbox,{timeout:5000});}
function all(n){return [n,...n.children.flatMap(all)];}
async function main(){
  new (Object.getPrototypeOf(async function(){}).constructor)(source);checks++;
  new (Object.getPrototypeOf(async function(){}).constructor)(loader);checks++;
  for(const [family,count] of [['small',4],['medium',4],['large',8]]){
    const c=context(family);await run(source,c);const nodes=all(c.widgets.at(-1));
    check(snapshot.tasks.slice(0,count).every(t=>nodes.some(n=>n.value===t.title)),family+' tarefas esperadas');
    check(!nodes.some(n=>n.value===snapshot.tasks[count].title),family+' não excede quantidade');
    check(c.widgets[0].backgroundImage===fs.readFileSync('assets/popular-background.png').toString('base64'),'fundo original');
    check(nodes.filter(n=>n.type==='text').every(n=>n.lineLimit===1),'linhas limitadas');
    check(c.widgets[0].url.includes('codex_refresh=1'),'refresh por toque');
    fs.mkdirSync('validation',{recursive:true});fs.writeFileSync('validation/'+family+'.json',JSON.stringify(c.widgets[0],null,2));
  }
  let c=context('large');await run(loader,c);
  check(c.files.get('/cache/codex-github-last-good.js')===source,'loader salva versão bem sucedida');
  check(c.files.has('/cache/codex-tasks-last-good.json'),'cache de dados independente');
  const cached=[['/cache/codex-github-last-good.js',source],['/cache/codex-tasks-last-good.json',JSON.stringify(snapshot)]];
  for(const options of [{offline:true},{codeStatus:401},{codeStatus:404},{codeStatus:403},{code:'<!doctype html>'},{code:source.replace('await main();','throw Error("runtime"); await main();')},{code:source.replace('await main();','invalid { await main();')}]){
    c=context('large',{...options,files:cached});await run(loader,c);
    check(all(c.widgets.at(-1)).some(n=>n.value===snapshot.tasks[0].title),'recupera código funcional');
    check(c.files.get('/cache/codex-github-last-good.js')===source,'não substitui cache por versão inválida');
    check(![...c.files.values()].some(v=>v.includes('fake-test-token')),'diagnóstico sem token');
  }
  for(const options of [{offline:true},{data:'{}'},{dataStatus:401},{dataStatus:404},{data:JSON.stringify({...snapshot,tasks:[{...snapshot.tasks[0],title:null}]})}]){
    c=context('large',{...options,files:cached});await run(source,c);
    check(all(c.widgets.at(-1)).some(n=>n.value===snapshot.tasks[0].title),'dados inválidos preservam cache');
    check(all(c.widgets.at(-1)).some(n=>n.value?.startsWith?.('Offline · ')),'offline sinalizado');
  }
  c=context('small',{noToken:true});await run(loader,c);check(c.widgets.length===1,'sem token apresenta orientação');
  c=context('large',{data:JSON.stringify({...snapshot,tasks:[]})});await run(source,c);check(all(c.widgets[0]).some(n=>n.value==='Nenhuma tarefa recente.'),'lista vazia');
  const stale={...snapshot,generatedAt:'2020-01-01T00:00:00.000Z'};
  c=context('large',{data:JSON.stringify(stale)});await run(source,c);check(all(c.widgets[0]).some(n=>n.value?.startsWith?.('Desatualizado · ')),'avisa snapshot antigo');
  c=context('large',{data:JSON.stringify(stale),files:cached});await run(source,c);check(JSON.parse(c.files.get('/cache/codex-tasks-last-good.json')).generatedAt===snapshot.generatedAt,'resposta velha não regride cache');
  const input={pinnedThreads:[{id:'old',kind:'codex',title:'Antiga fixada',updatedAt:1,hostId:'local',status:'idle'}],threads:[{id:'new',kind:'codex',title:'Recente',updatedAt:10,hostId:'durable',status:'active',summary:'PRIVADO',cwd:'PRIVADO'},{id:'chat',kind:'chatgpt',title:'Chat',updatedAt:20},{id:'new',kind:'codex',title:'Duplicada',updatedAt:9,hostId:'durable'}]};
  const output=normalizeSnapshot(input);check(output.tasks.length===2&&output.tasks[0].id==='new','recentes ordenadas, fixadas não priorizadas e sem duplicata');
  check(!JSON.stringify(output).includes('PRIVADO'),'não exporta mensagens nem diretórios');
  check(output.tasks[0].origin==='cloud','origem Cloud');
  check(normalizeSnapshot({...input,collectedAt:'2026-10-21T10:00:00.000Z'}).generatedAt==='2026-10-21T10:00:00.000Z','preserva horário real de coleta');
  assert.throws(()=>normalizeSnapshot({...input,unavailableHosts:['local']}));checks++;
  const report={at:new Date().toISOString(),checks,nativeIPhone:false,result:'passed',covers:['small/medium/large','fundo idêntico','sintaxe','401/403/404','offline','dados inválidos','rollback de código','cache independente','privacidade','ordenação','deduplicação','ausência de token','dados antigos']};
  fs.writeFileSync('validation/result.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
