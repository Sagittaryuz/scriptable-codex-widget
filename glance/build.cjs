const fs=require('node:fs');
const {normalizeSnapshot}=require('../scripts/snapshot.cjs');
const CHATGPT_URL='chatgpt://';
const SIZES={small:{count:4,title:10.5,meta:8,padding:10,spacing:1},medium:{count:4,title:12,meta:8,padding:12,spacing:1},large:{count:8,title:14,meta:10,padding:12,spacing:4}};
function makeTree(size){
 const l=SIZES[size];if(!l)throw Error('Tamanho inválido');
 const label=(id,binding,fontSize,color='#FFFFFF')=>({id,type:'text',binding,style:{fontSize,color,fontWeight:'regular',maxLines:1}});
 const icon=(id,binding,fontSize)=>({id,type:'icon',binding,style:{fontSize,color:'#C6C6CB',weight:'regular'}});
 const rows=Array.from({length:l.count},(_,i)=>{
  const n=i+1;return {id:'task_'+n,type:'container',layout:'vertical',style:{spacing:1},children:[label('title_'+n,'{{task_'+n+'_title}}',l.title),{id:'meta_'+n,type:'container',layout:'horizontal',style:{spacing:4,alignment:'center'},children:[icon('origin_icon_'+n,'{{task_'+n+'_icon}}',l.meta),label('origin_'+n,'{{task_'+n+'_origin}}',l.meta,'#C6C6CB')]}]};
 });
 return {id:'root',type:'container',layout:'z-stack',href:CHATGPT_URL,style:{padding:0,background:'#0D0D0D'},children:[
  {id:'background',type:'gradient',style:{type:'linear',startColor:'#1E1E1E',endColor:'#0D0D0D',angle:90,padding:0,spacing:0},children:[]},
  {id:'content',type:'container',layout:'vertical',style:{padding:l.padding,spacing:0,flex:1},children:[
   {id:'header',type:'container',layout:'horizontal',style:{height:24,spacing:5,alignment:'center'},children:[icon('brand_icon','terminal',l.title),label('brand','Codex',l.title),{id:'header_space',type:'spacer',style:{flex:1}},{id:'reload_safe_zone',type:'spacer',style:{minLength:40}}]},
   {id:'rows',type:'container',layout:'vertical',style:{spacing:l.spacing},children:rows},
   {id:'bottom_space',type:'spacer',style:{flex:1,minLength:2}},
   {id:'collected_at',type:'relative_time',binding:'{{collected_at}}',style:{fontSize:l.meta,color:'#AFAFB5',fontWeight:'regular'}}
  ]}
 ]};
}
function makeContent(snapshot,size){
 const l=SIZES[size],data={collected_at:snapshot.generatedAt};
 for(let i=1;i<=l.count;i++){
  const t=snapshot.tasks[i-1];data['task_'+i+'_title']=t?t.title:'—';data['task_'+i+'_origin']=t?t.hostLabel:'Sem outra tarefa';data['task_'+i+'_icon']=!t?'minus':t.origin==='cloud'?'cloud':t.origin==='remote'?'network':'laptopcomputer';
 }
 return data;
}
if(require.main===module){
 const input=process.argv[2];if(!input)throw Error('Uso: node glance/build.cjs arquivo-list_threads.json');
 const raw=JSON.parse(fs.readFileSync(input,'utf8'));
 if(!Number.isFinite(Date.parse(raw.collectedAt)))throw Error('collectedAt deve registrar a coleta real.');
 const snapshot=normalizeSnapshot(raw);fs.mkdirSync('glance/generated',{recursive:true});
 if(process.argv.includes('--stdout')){
  console.log(JSON.stringify(Object.keys(SIZES).map(size=>({size,content:makeContent(snapshot,size)}))));
  process.exit(0);
 }
 for(const size of Object.keys(SIZES))fs.writeFileSync('glance/generated/'+size+'.json',JSON.stringify({size,tree:makeTree(size),content:makeContent(snapshot,size)},null,2)+'\n');
 fs.writeFileSync('glance/generated/snapshot.json',JSON.stringify(snapshot,null,2)+'\n');
 console.log('Layouts e conteúdo mínimo do Glance gerados.');
}
module.exports={makeTree,makeContent,SIZES,CHATGPT_URL};
