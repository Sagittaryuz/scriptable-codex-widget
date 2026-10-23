import { HStack, VStack, Text, Image, Rectangle, ProgressView, Link, ZStack } from 'scripting';
import { POPULAR_BACKGROUND } from './background';
import { Snapshot, Task, dimensions, windowLabel, ageLabel, stale, taskPresentation, CHATGPT_URL, taskURL } from './model';

function Rule({scale=1}:{scale?:number}){
 return <Rectangle fill="rgba(255,255,255,0.13)" frame={{height:(2/3)*scale}}/>;
}

function Icon({symbol,color,size}:{symbol:string;color:string;size:number}){
 return <Image systemName={symbol} font={size*.43} foregroundStyle="white" frame={{width:size,height:size}} background={{style:color,shape:{type:'circle'}}}/>;
}

function Row({task,layout,scale}:{task:Task;layout:ReturnType<typeof dimensions>;scale:number}){
 const p=taskPresentation(task),statusWidth=(layout.large?54:50)*scale;
 return <Link url={taskURL(task)}><VStack spacing={0}>
  <HStack spacing={4*scale} frame={{height:layout.row-(2/3)*scale}}>
   <Icon symbol={p.symbol} color={p.color} size={layout.icon*scale}/>
   <VStack alignment="leading" spacing={1*scale} frame={{maxWidth:'infinity',alignment:'leading'}}>
    <Text font={layout.title*scale} fontWeight="semibold" foregroundStyle="white" lineLimit={1} minScaleFactor={0.8}>{task.title}</Text>
    <Text font={layout.meta*scale} foregroundStyle={layout.small?p.color:'#96969C'} lineLimit={1} minScaleFactor={0.8}>{layout.small?p.label:(task.detail||`${task.origin} · ${ageLabel(task.observedAt)}`)}</Text>
   </VStack>
   {!layout.small?<Text font={layout.status*scale} fontWeight="semibold" foregroundStyle={p.color} lineLimit={1} minScaleFactor={0.72} frame={{width:statusWidth,alignment:'trailing'}}>{p.short}</Text>:null}
  </HStack>
  <Rule scale={scale}/>
 </VStack></Link>;
}

export function CodexView({snapshot,family,width,height,offline=false}:{snapshot:Snapshot;family:string;width:number;height:number;offline?:boolean}){
 const windows=[...snapshot.windows].sort((a,b)=>a.remainingPercent-b.remainingPercent);
 const small=family==='systemSmall',baseWidth=small?146:304;
 const scale=Math.min(1,Math.max(.72,(width-12)/baseWidth));
 const contentWidth=baseWidth*scale,contentHeight=Math.max(96,height-8),secondary=windows.length>1?8*scale:0;
 const layout=dimensions(family,contentHeight-secondary),w=windows[0];
 const quotaStale=stale(snapshot.usageObservedAt),remaining=w?.remainingPercent;
 const quotaColor=quotaStale?'#96969C':remaining==null?'#96969C':remaining<=10?'#FF5967':remaining<=25?'#FFB83E':'#30C795';
 const displayed=[...snapshot.tasks].sort((a,b)=>{
  const rank=(t:Task)=>stale(t.observedAt)?4:t.detail.startsWith('Último')?3:t.state==='approval'||t.state==='input'?0:t.state==='error'?1:t.state==='running'?2:3;
  return rank(a)-rank(b);
 }).slice(0,layout.count);
 const history=snapshot.coverage.startsWith('Histórico local');
 const footer=`${stale(snapshot.tasksObservedAt)?'Antigo · ':offline?'Cache · ':''}${history?'Hist. local · ':''}${ageLabel(snapshot.tasksObservedAt)}`;
 const background=UIImage.fromBase64String(POPULAR_BACKGROUND);
 return <ZStack alignment="topLeading" frame={{width,height}} clipped widgetBackground="#1E1E1E">
  {background?<Image image={background} resizable renderingMode="original" frame={{width,height}}/>:null}
  <VStack alignment="leading" spacing={0} frame={{width:contentWidth,height:contentHeight}} position={{x:width/2,y:height/2}}>
   <Link url={CHATGPT_URL}><VStack spacing={1*scale} frame={{height:layout.header}}>
    <HStack spacing={4*scale} frame={{height:29.5*scale}}>
     <Icon symbol="terminal.fill" color="#343438" size={layout.icon*scale}/>
     <VStack alignment="leading" spacing={1*scale} frame={{maxWidth:'infinity',alignment:'leading'}}>
      <Text font={layout.title*scale} fontWeight="semibold" foregroundStyle="white" lineLimit={1}>Codex</Text>
      <Text font={layout.meta*scale} foregroundStyle="#96969C" lineLimit={1}>{w?`${windowLabel(w).toUpperCase()}${quotaStale?' · ANTIGO':''}`:'LIMITE INDISPONÍVEL'}</Text>
     </VStack>
     <VStack alignment="trailing" spacing={0}>
      <Text font={layout.quota*scale} fontWeight="semibold" monospacedDigit foregroundStyle="white" lineLimit={1}>{remaining==null?'—':`${Math.round(remaining)}%`}</Text>
      <Text font={layout.foot*scale} foregroundStyle={quotaColor}>restante</Text>
     </VStack>
    </HStack>
    {w?<ProgressView value={remaining} total={100} progressViewStyle="linear" tint={quotaColor} frame={{height:5.5*scale}}/>:<Rule scale={scale}/>}
   </VStack></Link>
   {windows.length>1?<HStack spacing={4*scale} frame={{height:secondary}}>{windows.slice(1).map((other,i)=><Text key={i} font={layout.meta*scale} foregroundStyle="#96969C">{windowLabel(other)} · {Math.round(other.remainingPercent)}% restante</Text>)}</HStack>:null}
   {displayed.length?displayed.map(task=><Row key={task.id} task={task} layout={layout} scale={scale}/>):<Text font={layout.title*scale} foregroundStyle="#96969C" frame={{maxHeight:'infinity'}}>Nenhuma tarefa disponível</Text>}
   <Text font={layout.foot*scale} foregroundStyle="#96969C" lineLimit={1} frame={{height:layout.footer,alignment:'leading'}}>{footer}</Text>
  </VStack>
 </ZStack>;
}
