import { Button, HStack, Link, NavigationStack, ScrollView, Text, VStack, useEffect, useRef, useState } from 'scripting'
import { lastSnapshot, refreshSnapshot } from './repository'
import { Task, taskURL, taskPresentation, taskSourceLabel, ageLabel, matchesFilter } from './model'
import { notifyChanges, summary } from './pro'
import { chooseExportFolder, explain, exportPreferences, readPreferences, refreshMinutes, reloadWidgets } from './pro-common'
export function CodexScreen(){
  const [snapshot,setSnapshot]=useState(lastSnapshot()),[filter,setFilter]=useState('Todas'),[message,setMessage]=useState(''),[busy,setBusy]=useState(false)
  const running=useRef(false)
  async function action(fn:()=>Promise<void>){if(running.current)return;running.current=true;setBusy(true);try{await fn()}catch{setMessage('Não foi possível concluir. Dados e configurações anteriores foram preservados.')}finally{running.current=false;setBusy(false)}}
  async function refresh(){const result=await refreshSnapshot();setSnapshot(result.snapshot);await notifyChanges(result.snapshot);await reloadWidgets();setMessage(result.reason||'Consulta confirmada · '+new Date(result.snapshot.generatedAt).toLocaleString('pt-BR'))}
  useEffect(()=>{void action(refresh)},[])
  const visible=snapshot.tasks.filter((t:Task)=>matchesFilter(t,filter))
  return <NavigationStack><ScrollView><VStack padding={16} spacing={12} navigationTitle="Codex">
    <Text font="headline">Codex · 1.4.1</Text>
    <Button title={busy?'Consultando…':'Atualizar dados'} action={()=>action(refresh)}/>
    <Text>{snapshot.coverage}</Text><Text>{'Coleta: '+new Date(snapshot.generatedAt).toLocaleString('pt-BR')}</Text>
    <HStack>{['Todas','Pendências','Execução'].map(f=><Button key={f} title={(filter===f?'✓ ':'')+f} action={()=>setFilter(f)}/>)}</HStack>
    {visible.map(t=><Link key={t.id} url={taskURL(t)}><VStack alignment="leading"><Text>{t.title}</Text><Text foregroundStyle="secondary">{taskSourceLabel(t)+' · '+taskPresentation(t).label+' · '+ageLabel(t.observedAt)+' · '+t.detail}</Text></VStack></Link>)}
    {!visible.length?<Text>Nenhuma tarefa neste filtro.</Text>:null}
    <Button title="O que depende de mim?" action={()=>action(()=>explain('Analise as pendências e os limites abaixo. Estado antigo não comprova estado atual. Resposta pronta não significa objetivo concluído.\n'+JSON.stringify(summary(snapshot))))}/>
    <Button title="Conectar dados privados" action={()=>action(async()=>{
      if(typeof GitHub==='undefined'||!GitHub.isAvailable()){setMessage('Configure o GitHub nas preferências do Scripting com leitura do repositório codex-widget-private-data.');return}
      await GitHub.requestPermissions(['read_contents']);Storage.set('codex-private-data',true);await refresh()
    })}/>
    <Button title={'Alertas locais: '+(Storage.get('codex-alerts')?'ligados':'desligados')} action={()=>action(async()=>{const enabled=!Storage.get('codex-alerts');Storage.set('codex-alerts',enabled);Storage.remove('codex-alert-baseline-v2');if(enabled)await Notification.schedule({title:'Codex · alertas ativados',body:'Novas pendências serão verificadas nas execuções do script.',threadIdentifier:'codex-pending'});await notifyChanges(snapshot);setMessage('Alertas locais verificados ao consultar. Push do computador precisa de configuração própria.')} )}/>
    <Text>Frequência solicitada ao iOS</Text>
    <HStack>{[1,5,15].map(n=><Button key={n} title={(refreshMinutes()===n?'✓ ':'')+n+' min'} action={()=>action(async()=>{Storage.set('refresh-minutes',n);await reloadWidgets();setMessage('Intervalo solicitado: '+n+' min. O iOS decide a execução.')} )}/>)}</HStack>
    <Button title="Exportar preferências" action={()=>action(async()=>{await exportPreferences('Codex',{refreshMinutes:refreshMinutes(),alerts:Storage.get('codex-alerts')===true})})}/>
    <Button title="Escolher pasta de exportação" action={()=>action(chooseExportFolder)}/>
    <Button title="Importar preferências" action={()=>action(async()=>{const p=await readPreferences('Codex') as any;if(!p)return;if(![1,5,15].includes(p.refreshMinutes)||typeof p.alerts!=='boolean')throw Error('Formato inválido');Storage.set('refresh-minutes',p.refreshMinutes);Storage.set('codex-alerts',p.alerts);await reloadWidgets();setMessage('Preferências importadas.')} )}/>
    <Text foregroundStyle="secondary">Tarefas e limites na nuvem são consultados no GitHub a cada 30 minutos, sujeitos ao agendador. Tarefas locais dependem do último contato do computador e conservam a data original. Atualizar o widget busca os registros publicados, sem iniciar uma nova coleta na nuvem.</Text>
    {message?<Text>{message}</Text>:null}
  </VStack></ScrollView></NavigationStack>
}
