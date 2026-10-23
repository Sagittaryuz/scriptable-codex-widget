import { Dialog, Script, Widget } from 'scripting';
import { refreshSnapshot, readToken, saveToken, REPO } from './repository';
import { ageLabel } from './model';
async function run(){
 console.log('Codex Scripting 1.0.0 · interface nativa');
 const requested=Script.queryParameters?.preview;
 if(typeof requested==='string'&&['systemSmall','systemMedium','systemLarge'].includes(requested)){
  await Widget.preview({family:requested as 'systemSmall'|'systemMedium'|'systemLarge'});return;
 }
 const option=await Dialog.actionSheet({title:'Codex · 1.0.0',message:'Limite em cima, tarefas embaixo. O widget mostra a idade real dos dados.',actions:[{label:'Ver 2×2'},{label:'Ver 2×4'},{label:'Ver 4×4'},{label:'Atualizar dados'},{label:readToken()?'Trocar acesso GitHub':'Configurar acesso GitHub'},{label:'Diagnóstico'}]});
 if(option==null)return;
 if(option<=2){await Widget.preview({family:(['systemSmall','systemMedium','systemLarge'] as const)[option]});return;}
 if(option===4){
  const token=await Dialog.prompt({title:'Acesso privado ao GitHub',message:`Use um token fine-grained apenas para ${REPO}, Contents: Read-only. Será salvo no Keychain deste script. Não envie o token ao chat.`,obscureText:true,confirmLabel:'Guardar no Keychain'});
  if(!token)return;saveToken(token);
 }
 const result=await refreshSnapshot();
 if(option!==5)Widget.reloadAll();
 await Dialog.alert({title:option===5?'Diagnóstico':'Dados do Codex',message:`Versão 1.0.0\n${result.offline?result.reason:'Consulta privada confirmada'}\nLimite: ${ageLabel(result.snapshot.usageObservedAt)}\nTarefas: ${ageLabel(result.snapshot.tasksObservedAt)}\nCobertura: ${result.snapshot.coverage}\n${result.snapshot.tasks.length} tarefas.\nO iOS controla a atualização na tela inicial.`});
}
try{await run()}catch{await Dialog.alert({title:'Codex',message:'Não foi possível concluir. A última configuração foi preservada.'})}finally{Script.exit()}
