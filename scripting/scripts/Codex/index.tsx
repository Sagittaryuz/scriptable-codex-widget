import { Dialog, Script, Widget } from 'scripting';
import { refreshSnapshot } from './repository';
import { ageLabel } from './model';
async function run(){
 console.log('Codex Scripting 1.0.6 · interface nativa');
 const requested=Script.queryParameters?.preview;
 if(typeof requested==='string'&&['systemSmall','systemMedium','systemLarge'].includes(requested)){
  await Widget.preview({family:requested as 'systemSmall'|'systemMedium'|'systemLarge'});return;
 }
 const option=await Dialog.actionSheet({title:'Codex · 1.0.6',message:'Limite em cima e até três tarefas clicáveis embaixo.',actions:[{label:'Ver 2×2'},{label:'Ver 2×4'},{label:'Ver 4×4'},{label:'Atualizar dados'},{label:'Diagnóstico'}]});
 if(option==null)return;
 if(option<=2){await Widget.preview({family:(['systemSmall','systemMedium','systemLarge'] as const)[option]});return;}
 const result=await refreshSnapshot();
 if(option!==4)Widget.reloadAll();
 await Dialog.alert({title:option===4?'Diagnóstico':'Dados do Codex',message:`Versão 1.0.6\n${result.offline?result.reason:'Consulta pública confirmada'}\nLimite: ${ageLabel(result.snapshot.usageObservedAt)}\nTarefas: ${ageLabel(result.snapshot.tasksObservedAt)}\nCobertura: ${result.snapshot.coverage}\n${result.snapshot.tasks.length} tarefas disponíveis; até 3 aparecem no widget.\nO iOS controla a atualização na tela inicial.`});
}
run()
 .catch(()=>Dialog.alert({title:'Codex',message:'Não foi possível concluir. A última configuração foi preservada.'}))
 .finally(()=>Script.exit());

