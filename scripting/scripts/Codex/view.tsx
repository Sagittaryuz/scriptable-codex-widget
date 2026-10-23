import { HStack, VStack, Text, Image, Rectangle, ProgressView, Link, ZStack } from 'scripting';
import { POPULAR_BACKGROUND } from './background';
import { CODEX_SYMBOL } from './codex-symbol';
import { Snapshot, Task, dimensions, windowLabel, resetLabel, ageLabel, stale, taskPresentation, CHATGPT_URL, taskURL } from './model';

function Rule({scale=1}:{scale?:number}){
 return <Rectangle fill="rgba(255,255,255,0.13)" frame={{height:(2/3)*scale}}/>;
}

function Icon({symbol,color,size}:{symbol:string;color:string;size:number}){
 return <Image systemName={symbol} font={size*.43} foregroundStyle="white" frame={{width:size,height:size}} background={{style:color,shape:{type:'circle'}}}/>;
}

function Row({task,layout,scale}:{task:Task;layout:ReturnType<typeof dimensions>;scale:number}){
 const p=taskPresentation(task),statusWidth=(layout.large?62:50)*scale;
 return <Link url={taskURL(task)}><VStack spacing={0}>
  <HStack spacing={4*scale} frame={{height:layout.row-(2/3)*scale}}>
   <Icon symbol={p.symbol} color={p.color} size={layout.icon*scale}/>
   <VStack alignment="leading" spacing={1*scale} frame={{maxWidth:'infinity',alignment:'leading'}}>
    <Text font={layout.title*scale} fontWeight="semibold" foregroundStyle="white" lineLimit={1} minScaleFactor={0.8}>{task.title}</Text>
    <Text font={layout.meta*scale} foregroundStyle={layout.small?p.color:'#96969C'} lineLimit={1} minScaleFactor={0.8}>{layout.small?p.label:(task.detail||`${task.origin} · ${ageLabel(task.observedAt)}`)}</Text>
   </VStack>
   {!layout.small?<Text font={layout.status*scale} fontWeight="semibold" foregroundStyle={p.color} lineLimit={1} minScaleFactor={0.72} frame={{width:statusWidth,alignment:'trailing'}}>{p.short}</Text>:null}
   <Image systemName="chevron.right" font={6*scale} foregroundStyle="#69696F" frame={{width:6*scale,height:layout.icon*scale}}/>
  </HStack>
  <Rule scale={scale}/>
 </VStack></Link>;
}

export function CodexView({snapshot,family,width,height,offline=false}:{snapshot:Snapshot;family:string;width:number;height:number;offline?:boolean}){
 const windows=[...snapshot.windows].sort((a,b)=>a.remainingPercent-b.remainingPercent);
 const small=family==='systemSmall',baseWidth=small?138:304,horizontalInset=small?10:14;
 const contentWidth=Math.max(120,Math.min(baseWidth,width-horizontalInset*2));
 const scale=Math.min(1,Math.max(.88,contentWidth/baseWidth));
 const layout=dimensions(family,Math.max(104,height-16)),w=windows[0];
 const quotaStale=stale(snapshot.usageObservedAt),remaining=w?.remainingPercent;
 const quotaColor=quotaStale?'#96969C':'#4BAEFF';
 const displayed=[...snapshot.tasks].sort((a,b)=>{
  const rank=(t:Task)=>stale(t.observedAt)?4:t.detail.startsWith('Último')?3:t.state==='approval'||t.state==='input'?0:t.state==='error'?1:t.state==='running'?2:3;
  return rank(a)-rank(b);
 }).slice(0,layout.count);
 const background=UIImage.fromBase64String(POPULAR_BACKGROUND);
 const codexSymbol=UIImage.fromBase64String(CODEX_SYMBOL);
 const headerWindow=w?windowLabel(w):'Limite indisponível';
 const reset=w?resetLabel(w):'Reinício indisponível';
 const contentHeight=layout.header+layout.row*Math.max(1,displayed.length);
 return <ZStack alignment="topLeading" frame={{width,height}} clipped widgetBackground="#1E1E1E">
  {background?<Image image={background} resizable renderingMode="original" frame={{width,height}}/>:null}
  <VStack alignment="leading" spacing={0} frame={{width:contentWidth,height:contentHeight}} position={{x:width/2,y:height/2}}>
   <Link url={CHATGPT_URL}><VStack alignment="leading" spacing={1*scale} frame={{height:layout.header}}>
    <HStack spacing={5*scale} frame={{height:(layout.large?20:16)*scale}}>
     {codexSymbol?<Image image={codexSymbol} resizable renderingMode="original" frame={{width:(layout.large?20:16)*scale,height:(layout.large?20:16)*scale}}/>:null}
     <Text font={layout.headerTitle*scale} fontWeight="regular" foregroundStyle="white" lineLimit={1}>Codex</Text>
    </HStack>
    <Text font={layout.window*scale} foregroundStyle="#B1B1B5" lineLimit={1}>{headerWindow}{quotaStale?' · antigo':''}</Text>
    <Text font={layout.quota*scale} fontWeight="regular" monospacedDigit foregroundStyle="white" lineLimit={1}>{remaining==null?'—':`${Math.round(remaining)}% restante`}</Text>
    {w?<ProgressView value={remaining} total={100} progressViewStyle="linear" tint={quotaColor} frame={{height:4*scale}}/>:<Rule scale={scale}/>}
    <Text font={layout.reset*scale} foregroundStyle="#96969C" lineLimit={1}>{reset}</Text>
   </VStack></Link>
   {displayed.length?displayed.map(task=><Row key={task.id} task={task} layout={layout} scale={scale}/>):<Text font={layout.title*scale} foregroundStyle="#96969C" frame={{maxHeight:'infinity'}}>Nenhuma tarefa disponível</Text>}
  </VStack>
 </ZStack>;
}
