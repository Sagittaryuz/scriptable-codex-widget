import { Button, VStack, Text, useState } from 'scripting'
import { refreshSnapshot } from './repository'
import { summary } from './pro'
function Tool({response}:AssistantTool.UIProps<{}>){
  const [busy,setBusy]=useState(false),[error,setError]=useState('')
  return <VStack><Text>Consultar metadados e compartilhar com esta conversa.</Text>
    <Button title={busy?'Consultando…':'Consultar Codex'} action={async()=>{if(busy)return;setBusy(true);try{
      const r=await refreshSnapshot();response({success:true,output:{assistantParts:[{type:'text',text:JSON.stringify({offline:r.offline,...summary(r.snapshot)})}],userParts:[{type:'text',text:'Consulta: '+r.snapshot.generatedAt+' · '+r.snapshot.coverage}]}})
    }catch{setError('Consulta indisponível.')}finally{setBusy(false)}}}/>{error?<Text>{error}</Text>:null}
  </VStack>
}
AssistantTool.registerUIView(Tool)
