// Entrada: JSON original de list_threads. Publica somente metadados mínimos.
const fs=require('node:fs');
const cp=require('node:child_process');
const {normalizeSnapshot}=require('./snapshot.cjs');
const input=process.argv[2];
if(!input)throw Error('Uso: node scripts/publish-snapshot.cjs caminho-list_threads.json [--push]');
const raw=JSON.parse(fs.readFileSync(input,'utf8'));
const data=normalizeSnapshot(raw);
fs.mkdirSync('data',{recursive:true});
fs.writeFileSync('data/tasks.json',JSON.stringify(data,null,2)+'\n');
if(process.argv.includes('--push')) {
  const run=(...args)=>cp.execFileSync('git',args,{encoding:'utf8'}).trim();
  if(run('remote','get-url','origin')!=='https://github.com/Sagittaryuz/scriptable-codex-widget.git')throw Error('Remote inesperado.');
  if(run('branch','--show-current')!=='main')throw Error('Branch inesperada.');
  // Usa API de conteúdo para não misturar dados com alterações locais de código.
  const gh=(...args)=>cp.execFileSync('gh',args,{encoding:'utf8'});
  const base='repos/Sagittaryuz/scriptable-codex-widget/contents/data/tasks.json';
  const old=JSON.parse(gh('api',base));
  const payload={message:'data: atualizar tarefas recentes do Codex',branch:'main',sha:old.sha,content:Buffer.from(fs.readFileSync('data/tasks.json')).toString('base64')};
  const response=cp.spawnSync('gh',['api','--method','PUT',base,'--input','-'],{input:JSON.stringify(payload),encoding:'utf8'});
  if(response.status!==0)throw Error('Não foi possível publicar o snapshot: '+response.stderr);
  const commit=JSON.parse(response.stdout).commit.sha;
  const verified=JSON.parse(gh('api',base));
  if(verified.content.replace(/\s/g,'')!==payload.content)throw Error('Readback diferente do snapshot enviado.');
  console.log('Snapshot privado publicado e conferido: '+commit);
} else console.log('Snapshot local preparado: '+data.tasks.length+' tarefas.');
