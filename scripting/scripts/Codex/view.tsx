import { HStack, VStack, Text, Image, Spacer, Rectangle, ProgressView } from 'scripting';
import { Snapshot, Task, dimensions, windowLabel, ageLabel, stale, taskPresentation } from './model';
const BG={colors:['#242424','#0b0b0c'],startPoint:'top' as const,endPoint:'bottom' as const};
function Rule(){return <Rectangle fill="#3a3a3c" frame={{height:0.5}}/>}
function Icon({symbol,color,size}:{symbol:string;color:string;size:number}){
 return <Image systemName={symbol} font={size*.43} foregroundStyle="white" frame={{width:size,height:size}} background={{style:color,shape:{type:'circle'}}}/>;
}
function Row({task,layout}:{task:Task;layout:ReturnType<typeof dimensions>}){
 const p=taskPresentation(task),statusWidth=layout.small?0:layout.large?82:68;
 return <VStack spacing={0}>
  <HStack spacing={7} frame={{height:layout.row-1}}>
   <Icon symbol={p.symbol} color={p.color} size={layout.icon}/>
   <VStack alignment="leading" spacing={1} frame={{maxWidth:'infinity',alignment:'leading'}}>
    <Text font={layout.title} fontWeight="semibold" foregroundStyle="#ffffff" lineLimit={1} minScaleFactor={0.9}>{task.title}</Text>
    {layout.small||layout.row>=33?<Text font={layout.meta} foregroundStyle={layout.small?p.color:'#99999f'} lineLimit={1}>{layout.small?p.label:(task.detail||`${task.origin} · ${ageLabel(task.observedAt)}`)}</Text>:null}
   </VStack>
   {!layout.small?<Text font={layout.meta+1} fontWeight="semibold" foregroundStyle={p.color} lineLimit={1} frame={{width:statusWidth,alignment:'trailing'}}>{p.short}</Text>:null}
  </HStack>
  <Rule/>
 </VStack>;
}
export function CodexView({snapshot,family,height,offline=false}:{snapshot:Snapshot;family:string;height:number;offline?:boolean}){
 const windows=[...snapshot.windows].sort((a,b)=>a.remainingPercent-b.remainingPercent);
 const l=dimensions(family,height-(windows.length>1?12:0));
 const w=windows[0],quotaStale=stale(snapshot.usageObservedAt),remaining=w?.remainingPercent;
 const quotaColor=quotaStale?'#a1a1a8':remaining==null?'#a1a1a8':remaining<=10?'#ff4b55':remaining<=25?'#ffbd2e':'#22db91';
 const displayed=[...snapshot.tasks].sort((a,b)=>{
  const rank=(t:Task)=>stale(t.observedAt)?4:t.state==='approval'||t.state==='input'?0:t.state==='error'?1:t.state==='running'?2:3;
  return rank(a)-rank(b);
 }).slice(0,l.count);
 const footer=`${offline?'Cache · ':''}${stale(snapshot.tasksObservedAt)?'Dados antigos · ':''}${ageLabel(snapshot.tasksObservedAt)}`;
 return <VStack alignment="leading" spacing={0} widgetBackground={BG}>
  <VStack spacing={4} frame={{height:l.header}}>
   <HStack spacing={7}>
    <Icon symbol="terminal.fill" color="#343438" size={l.small?24:27}/>
    <VStack alignment="leading" spacing={1} frame={{maxWidth:'infinity',alignment:'leading'}}>
     <Text font={l.small?15:17} fontWeight="semibold" foregroundStyle="white" lineLimit={1}>Codex</Text>
     <Text font={l.meta} foregroundStyle="#99999f" lineLimit={1}>{w?`${windowLabel(w).toUpperCase()}${quotaStale?' · ANTIGO':''}`:'LIMITE INDISPONÍVEL'}</Text>
    </VStack>
    <VStack alignment="trailing" spacing={0}>
     <Text font={l.small?21:25} fontWeight="semibold" monospacedDigit foregroundStyle="white" lineLimit={1}>{remaining==null?'—':`${Math.round(remaining)}%`}</Text>
     <Text font={l.meta} foregroundStyle={quotaColor}>restante</Text>
    </VStack>
   </HStack>
   {w?<ProgressView value={remaining} total={100} progressViewStyle="linear" tint={quotaColor}/>:<Rule/>}
  </VStack>
  {windows.length>1?<HStack spacing={6} frame={{height:12}}>{windows.slice(1).map((other,i)=><Text key={i} font={l.meta} foregroundStyle="#aaaaaf">{windowLabel(other)} · {Math.round(other.remainingPercent)}% restante</Text>)}</HStack>:null}
  {displayed.length?displayed.map(task=><Row key={task.id} task={task} layout={l}/>):<Text font={12} foregroundStyle="#a1a1a8" frame={{maxHeight:'infinity'}}>Nenhuma tarefa disponível</Text>}
  <Spacer minLength={1}/>
  <Text font={l.meta} foregroundStyle="#8b8b91" lineLimit={1} frame={{height:l.footer,alignment:'leading'}}>{footer}</Text>
 </VStack>;
}
