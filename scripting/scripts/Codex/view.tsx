import { ShortcutHeader } from './header'
import { referenceLayout } from './content-layout'
import { HStack, VStack, Text, Image, Rectangle, Circle, Button, ZStack } from 'scripting'
import { RefreshCodex } from './app_intents'
import { POPULAR_BACKGROUND } from './background'
import { Snapshot, Task, STATES, stale, taskPresentation, taskSourceLabel, taskOriginIcon } from './model'
import { localCapsuleDate } from './quota-summary'

type Layout=ReturnType<typeof referenceLayout>
export function referenceStateStyle(task:Task){
 const state=taskPresentation(task)
 const old=stale(task.observedAt),idle=!old&&task.state==='idle',ready=!old&&task.state==='ready'
 const color=idle?'#0A84FF':state.color
 const background=idle?'rgba(10,132,255,0.16)':ready?'rgba(0,170,110,0.30)':old||task.state==='unknown'?'rgba(150,150,156,0.16)':task.state==='error'?'rgba(255,75,85,0.18)':task.state==='approval'||task.state==='input'?'rgba(255,189,46,0.18)':'rgba(38,152,255,0.18)'
 return {...state,color,background,iconBackground:ready?'#0A84FF':idle?'#2B2B2D':state.color}
}
function Divider({width,y}:{width:number;y:number}){
 return <Rectangle fill="rgba(255,255,255,0.13)" frame={{width,height:0.6}} position={{x:width/2,y}}/>
}
// Display-only history: never changes stored state, priority, filters or alerts.
export function taskCirclePresentation(task:Task,now=Date.now()){
 const at=Date.parse(task.observedAt),state=referenceStateStyle(task)
 if(!Number.isFinite(at)||at>now)return {symbol:STATES.unknown.symbol,iconBackground:STATES.unknown.color,historical:false,description:'Estado não confirmado: horário inválido ou futuro.'}
 if(stale(task.observedAt,now)&&task.state!=='unknown'&&Object.prototype.hasOwnProperty.call(STATES,task.state))return {
  symbol:STATES[task.state].symbol,iconBackground:'#66666D',historical:true,
  description:`Último estado observado: ${STATES[task.state].label}. Observado em ${task.observedAt}. Não confirma o estado atual.`
 }
 return {symbol:state.symbol,iconBackground:state.iconBackground,historical:false,description:null}
}
function TaskStatusCircle({task,layout,position}:{task:Task;layout:Layout;position?:{x:number;y:number}}){
 const circle=taskCirclePresentation(task),marker=layout.icon*.32
 return <ZStack frame={{width:layout.icon,height:layout.icon}} {...(position?{position}:{})} {...(circle.description?{accessibilityLabel:circle.description}:{})}>
  <Circle fill={circle.iconBackground} frame={{width:layout.icon,height:layout.icon}}/>
  <Image systemName={circle.symbol} font={layout.icon*.52} foregroundStyle="white" frame={{width:layout.icon,height:layout.icon}}/>
  {circle.historical?<ZStack frame={{width:marker,height:marker}} position={{x:layout.icon*.82,y:layout.icon*.82}}>
   <Circle fill="#242426" frame={{width:marker,height:marker}}/>
   <Image systemName="clock.fill" font={marker*.78} foregroundStyle="#D1D1D6" frame={{width:marker,height:marker}}/>
  </ZStack>:null}
 </ZStack>
}
export function smallHistoryNotice(snapshot:Snapshot,tasks:Task[],now=Date.now()){
 const dates=[...(snapshot.windows.length?[snapshot.usageObservedAt]:[]),...tasks.map(t=>t.observedAt),...(snapshot.resetCredits?[snapshot.resetCredits.observedAt]:[])].filter(d=>stale(d,now))
 if(!dates.length)return null
 const at=dates.sort((a,b)=>Date.parse(a)-Date.parse(b))[0],future=dates.some(d=>Date.parse(d)>now+60000)
 return `${future?'Horário não confirmado':'Há dados históricos'} · ${localCapsuleDate(at,now)}`
}
function SmallTaskRow({task,layout,last}:{task:Task;layout:Layout;last:boolean}){
 const state=referenceStateStyle(task),origin=taskOriginIcon(task),historical=stale(task.observedAt),textWidth=layout.width-layout.textX-(historical?0:layout.badgeWidth+layout.rowGap)
 const titleFont=layout.title*1.1,metaFont=layout.meta*1.15,textGap=1.5,titleHeight=titleFont*1.2,metaHeight=metaFont*1.2,textHeight=titleHeight+textGap+metaHeight
 const originColor=task.origin==='Cloud'?'#64D2FF':task.origin==='Local'?'#BF5AF2':task.origin==='Remoto'?'#FF9F0A':task.origin==='ChatGPT'?'#D1D1D6':'#96969C'
 const originText=task.origin==='Cloud'?'Nuvem':task.origin==='Local'?'Local':task.origin==='Remoto'?'Remoto':task.origin==='ChatGPT'?'ChatGPT':'Origem incerta'
 const label=`Atualizar widgets. ${task.title}. ${taskSourceLabel(task)}. ${taskCirclePresentation(task).description??(historical?'Estado histórico, observado em '+task.observedAt:state.short)}`
 return <Button intent={RefreshCodex()} buttonStyle="plain" accessibilityLabel={label}><ZStack alignment="topLeading" frame={{width:layout.width,height:last?layout.row:layout.taskAdvance}}>
  <TaskStatusCircle task={task} layout={layout} position={{x:layout.icon/2,y:layout.iconY}}/>
  <VStack alignment="leading" spacing={textGap} frame={{width:textWidth,height:textHeight,alignment:'leading'}} position={{x:layout.textX+textWidth/2,y:layout.iconY}}>
   <Text font={titleFont} fontWeight="semibold" foregroundStyle="white" lineLimit={1} minScaleFactor={.8}
     frame={{width:textWidth,height:titleHeight,alignment:'leading'}}>{task.title}</Text>
   <HStack spacing={metaFont*.3} frame={{width:textWidth,height:metaHeight,alignment:'leading'}}>
    <Image systemName={origin.symbol} font={metaFont} foregroundStyle={originColor} accessibilityLabel={origin.label} frame={{width:metaFont*1.2,height:metaFont*1.2}}/>
    <Text font={metaFont} fontWeight="regular" foregroundStyle={layout.metaColor} lineLimit={1} minScaleFactor={5/6}>{originText}</Text>
   </HStack>
  </VStack>
  {!historical?<ZStack frame={{width:layout.badgeWidth,height:layout.badgeHeight}} position={{x:layout.width-layout.badgeWidth/2,y:layout.iconY}}>
   <Rectangle fill={state.background} clipShape="capsule" frame={{width:layout.badgeWidth,height:layout.badgeHeight}}/>
   <Text font={layout.badgeFont} fontWeight="semibold" foregroundStyle={state.color} lineLimit={1} minScaleFactor={.7}>{state.short}</Text>
  </ZStack>:null}
  {!last?<Rectangle fill="rgba(255,255,255,0.13)" frame={{width:layout.width,height:layout.dividerHeight}} position={{x:layout.width/2,y:layout.row+layout.dividerHeight/2}}/>:null}
 </ZStack></Button>
}
function TaskRow({task,layout,last}:{task:Task;layout:Layout;last:boolean}){
 if(layout.small)return <SmallTaskRow task={task} layout={layout} last={last}/>
 const state=referenceStateStyle(task),w=layout.width,origin=taskOriginIcon(task),textWidth=w-layout.icon-layout.badgeWidth-layout.rowGap*2
 return <Button intent={RefreshCodex()} buttonStyle="plain" accessibilityLabel={`Atualizar widgets. ${task.title}. ${taskSourceLabel(task)}. ${taskCirclePresentation(task).description??state.short}`}><ZStack alignment="topLeading" frame={{width:layout.width,height:layout.row}}>
  <HStack spacing={layout.rowGap} frame={{width:w,height:layout.row-2}} position={{x:layout.width/2,y:layout.row/2}}>
   <TaskStatusCircle task={task} layout={layout}/>
   <VStack alignment="leading" spacing={layout.rowTextGap} frame={{width:textWidth,alignment:'leading'}}>
    <Text font={layout.title} fontWeight="semibold" foregroundStyle="white" lineLimit={1} minScaleFactor={0.8}>{task.title}</Text>
    <HStack spacing={layout.meta*.3} frame={{width:textWidth,alignment:'leading'}}>
     <Image systemName={origin.symbol} font={layout.meta} foregroundStyle="#D1D1D6" accessibilityLabel={origin.label} frame={{width:layout.meta*1.2,height:layout.meta*1.2}}/>
     <Text font={layout.meta} foregroundStyle="#96969C" lineLimit={1} minScaleFactor={0.75}>{taskSourceLabel(task)} · {state.short}</Text>
    </HStack>
   </VStack>
   <ZStack frame={{width:layout.badgeWidth,height:layout.badgeHeight}}>
    <Rectangle fill={state.background} clipShape="capsule" frame={{width:layout.badgeWidth,height:layout.badgeHeight}}/>
    <Text font={layout.badgeFont} fontWeight="semibold" foregroundStyle={state.color} lineLimit={1} minScaleFactor={0.7}>{state.short}</Text>
   </ZStack>
  </HStack>
  {!last?<Divider width={layout.width} y={layout.row-0.3}/>:null}
 </ZStack></Button>
}
export function CodexView({snapshot,family,width,height,offline=false}:{snapshot:Snapshot;family:string;width:number;height:number;offline?:boolean}){
 const contentBottom=height,layout=referenceLayout(family,width,contentBottom,height)
 const displayed=[...snapshot.tasks].sort((a,b)=>{
  const rank=(t:Task)=>stale(t.observedAt)?4:t.detail.startsWith('Último')?3:t.state==='approval'||t.state==='input'?0:t.state==='error'?1:t.state==='running'?2:3
  return rank(a)-rank(b)
 }).slice(0,layout.taskCount)
 const history=layout.small?smallHistoryNotice(snapshot,displayed):null
 const background=UIImage.fromBase64String(POPULAR_BACKGROUND)
 return <ZStack alignment="topLeading" frame={{width,height}} clipped widgetBackground="#1E1E1E">
  {background?<Image image={background} resizable renderingMode="original" frame={{width,height}}/>:null}
  <VStack alignment="leading" spacing={0} frame={{width:layout.width,height:layout.height,...(layout.small?{alignment:'topLeading' as const}:{})}} position={{x:width/2,y:contentBottom/2}}>
   {layout.small?<ZStack alignment="topLeading" frame={{width:layout.width,height:layout.taskTop}}>
    <ShortcutHeader snapshot={snapshot} layout={layout}/>
    <Rectangle fill="rgba(255,255,255,0.13)" frame={{width:layout.width,height:layout.dividerHeight}} position={{x:layout.width/2,y:layout.height/2}}/>
   </ZStack>:<ShortcutHeader snapshot={snapshot} layout={layout}/>}
   {displayed.length?displayed.map((task,i)=><TaskRow key={task.id} task={task} layout={layout} last={i===displayed.length-1}/>):<Text font={layout.title} foregroundStyle="#96969C" frame={{maxHeight:'infinity'}}>Nenhuma tarefa disponível</Text>}
  </VStack>
  {history?<Text font={5} foregroundStyle="#A1A1A8" lineLimit={1} minScaleFactor={1} frame={{width:layout.width,height:6}} position={{x:width/2,y:height-4}}>{history}</Text>:null}
 </ZStack>
}
