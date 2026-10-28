const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{buildSync}=require('esbuild');
const model=require('../scripting/scripts/Codex/model.ts'),{taskFromThread,makeSnapshot}=require('./scripting-model.cjs');
const root=path.resolve(__dirname,'../scripting/scripts/Codex'),now=new Date(),iso=now.toISOString();
const thread={id:'synthetic-question',name:'Synthetic task?',status:{type:'active',activeFlags:['waitingOnUserInput']}};
const usage={rateLimits:{primary:{usedPercent:20,windowDurationMins:300,resetsAt:null}}};
const input=taskFromThread(thread,null,iso,'Synthetic host');
assert.equal(input.state,'input');
assert.equal(model.taskPresentation(input).short,'Pergunta');
assert.equal(model.taskPresentation(input).label,'Pergunta aguardando sua resposta');
assert.equal(taskFromThread({...thread,status:{type:'active',activeFlags:['waitingOnUserInput','waitingOnApproval']}},null,iso).state,'approval');
const observations=[
 [{type:'active',activeFlags:[]},null,'running'],
 [{type:'active'},null,'running'],
 [{type:'idle'},null,'idle'],
 [{type:'notLoaded'},{status:'interrupted'},'idle'],
 [{type:'notLoaded'},{status:'completed'},'ready'],
 [{type:'notLoaded'},{status:'inProgress'},'unknown'],
 [undefined,undefined,'unknown'],
 [{type:'paused'},null,'unknown'],
 [{type:'blocked'},null,'unknown'],
 [{type:'notLoaded',activeFlags:['waitingOnUserInput']},null,'unknown']
];
for(const [status,turn,expected]of observations){
 const task=taskFromThread({...thread,status},turn,iso);
 assert.equal(task.state,expected,'Question mark in title is not evidence');
 assert.notEqual(model.taskPresentation(task).short,'Pergunta');
 const next=makeSnapshot(usage,[{...thread,status}],new Map([[thread.id,turn]]),now);
 assert.equal(next.tasks[0].state,expected,'New observation replaces the pending state');
}
assert.equal(model.taskPresentation(input,now.getTime()+15*60000).short,'Pergunta');
assert.equal(model.taskPresentation(input,now.getTime()+15*60000+1).short,'Antigo');
assert.equal(model.taskPresentation({...input,observedAt:new Date(now.getTime()+120000).toISOString()}).short,'Antigo');
const snapshot=makeSnapshot(usage,[thread],new Map(),now,'Synthetic host');
assert.equal(model.validateSnapshot(JSON.parse(JSON.stringify(snapshot))).tasks[0].state,'input');
assert.equal(model.validateSnapshot({...snapshot,tasks:[],windows:[]}).tasks.length,0);
assert.throws(()=>model.validateSnapshot({...snapshot,schemaVersion:3}));
assert.throws(()=>model.validateSnapshot({...snapshot,tasks:[{...input,state:undefined}]}));
function compile(file){
 const m={exports:{}},code=buildSync({entryPoints:[path.join(root,file)],bundle:true,write:false,platform:'node',format:'cjs',external:['scripting'],jsxFactory:'createElement'}).outputFiles[0].text;
 const sdk=new Proxy({AppIntentManager:{register:d=>()=>({name:d.name})},AppIntentProtocol:{AppIntent:0}},{get:(o,k)=>o[k]??k});
 const createElement=(type,props,...children)=>typeof type==='function'?type({...props,children:children.flat(Infinity).filter(Boolean)}):({type,props:props||{},children:children.flat(Infinity).filter(Boolean)});
 vm.runInNewContext(code,{module:m,exports:m.exports,require:()=>sdk,Date,Set,Map,JSON,createElement,UIImage:{fromBase64String:()=>({syntheticImage:true})}});
 return m.exports;
}
const view=compile('view.tsx'),sources=compile('sources.ts');
const nodes=(n,type)=>!n||typeof n!=='object'?[]:[...(n.type===type?[n]:[]),...(n.children||[]).flatMap(c=>nodes(c,type))];
const chatgpt={...input,id:'synthetic-chatgpt',origin:'ChatGPT'};
assert.equal(sources.mergeSources({...snapshot,tasks:[chatgpt]},null).tasks[0].state,'input','Explicit local ChatGPT contract is supported');
assert.equal(sources.mergeSources({...snapshot,tasks:[]},{...snapshot,tasks:[chatgpt]}).tasks.length,0,'Cloud source does not establish ChatGPT coverage');
const previews=[];
for(const [family,width,height]of [['systemSmall',158,158],['systemSmall',158,170],['systemMedium',338,170],['systemLarge',338,360]]){
 const tree=view.CodexView({snapshot,family,width,height});
 const pill=nodes(tree,'Rectangle').find(n=>n.props.clipShape==='capsule'&&n.props.fill==='rgba(255,189,46,0.18)');
 assert(pill,'Pending input has a yellow task capsule');
 assert.equal(pill.props.fill,'rgba(255,189,46,0.18)');
 const label=nodes(tree,'Text').find(n=>n.children.join('')==='Pergunta');
 assert.equal(label.props.foregroundStyle,'#ffbd2e');
 assert.equal(label.props.lineLimit,1);
 assert(nodes(tree,'Image').some(n=>n.props.systemName==='text.bubble.fill'));
 assert(nodes(tree,'Button').some(n=>n.props.accessibilityLabel.includes('. Pergunta')));
 assert(label.props.font*0.7*8*0.65<=pill.props.frame.width,'Conservative estimated text fit at supported minimum scale; native typography still pending');
 const staleTree=view.CodexView({snapshot:{...snapshot,tasks:[{...input,observedAt:'2000-01-01T00:00:00Z'}]},family,width,height});
 assert(!nodes(staleTree,'Text').some(n=>n.children.join('')==='Pergunta'));
 assert(family==='systemSmall'?nodes(staleTree,'Image').some(n=>n.props.systemName==='clock.fill'):nodes(staleTree,'Text').some(n=>n.children.join('')==='Antigo'),'Historical state remains explicit via clock without footer');
 const empty=view.CodexView({snapshot:{...snapshot,tasks:[],windows:[]},family,width,height});
 assert(nodes(empty,'Text').some(n=>n.children.join('')==='Nenhuma tarefa disponível'));
 previews.push({family,width,height,simulation:true,nativeIOS:false,tree});
}
for(const state of ['approval','running','idle','ready','unknown']){
 const style=view.referenceStateStyle({...input,state});assert.equal(style.short,model.STATES[state].short);assert.notEqual(style.short,'Pergunta');
}
if(process.argv.includes('--write-preview'))fs.writeFileSync(path.resolve(__dirname,'../validation/question-trees-1.6.1.json'),JSON.stringify({description:'Simulated JSX trees compiled from the real view.tsx. Synthetic data only; no iOS rendering or physical test.',previews},null,2)+'\n');
console.log('PASS question: explicit input, approval priority, cleared flags/answered, paused/idle/blocked/unknown, title punctuation, stale/future, missing data, schema 2, ChatGPT source boundaries and real JSX trees in four dimensions (simulation; native iOS pending).');
