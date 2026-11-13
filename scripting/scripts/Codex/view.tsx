import { ShortcutHeader } from './header'
import { recentTasks } from './sources'
import { referenceLayout } from './content-layout'
import { HStack, VStack, Text, Image, Rectangle, Circle, Button, ZStack, Canvas } from 'scripting'
import { RefreshCodex } from './app_intents'
import { POPULAR_BACKGROUND } from './background'
import { Snapshot, Task, STATES, stale, taskPresentation, taskSourceLabel, taskOriginIcon } from './model'
import { taskUpdatePresentation } from './task-update'
import { drawTokenGraph, tokenTotalLabel, tokenUsageDescription } from './token-graph'

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
// Ativos geometry: isotropic 26pt icon, two 13pt lines, 36x13pt capsule.
function TaskRow({task,layout,last}:{task:Task;layout:Layout;last:boolean}){
 const state=referenceStateStyle(task),circle=taskCirclePresentation(task),update=taskUpdatePresentation(task)
 const y=(layout.row-layout.icon)/2,line=layout.icon/2,w=layout.width-layout.textX-layout.badgeWidth-layout.rowGap
 return <Button intent={RefreshCodex()} buttonStyle="plain" accessibilityLabel={task.title+'. '+taskSourceLabel(task)+'. '+(circle.description??state.short)+'. '+update.accessibility}>
  <ZStack alignment="topLeading" frame={{width:layout.width,height:layout.taskAdvance}}>
   <ZStack frame={{width:layout.icon,height:layout.icon}} position={{x:layout.icon/2,y:y+layout.icon/2}}>
    <Circle fill={circle.iconBackground} frame={{width:layout.icon,height:layout.icon}}/>
    <Image systemName={circle.symbol} font={layout.icon*.52} foregroundStyle="white" frame={{width:layout.icon,height:layout.icon}}/>
   </ZStack>
   <Text font={layout.title} fontWeight="semibold" foregroundStyle="white" lineLimit={1} minScaleFactor={.8}
    frame={{width:w,height:line,alignment:'leading'}} position={{x:layout.textX+w/2,y:y+line/2}}>{task.title}</Text>
   <Text font={layout.meta} foregroundStyle="#96969C" lineLimit={1} minScaleFactor={.65}
    frame={{width:w,height:line,alignment:'leading'}} position={{x:layout.textX+w/2,y:y+line*1.5}}>{taskSourceLabel(task)}</Text>
   <ZStack frame={{width:layout.badgeWidth,height:line}} position={{x:layout.width-layout.badgeWidth/2,y:y+line/2}}>
    <Rectangle fill={state.background} clipShape="capsule" frame={{width:layout.badgeWidth,height:line}}/>
    <Text font={layout.badgeFont} foregroundStyle={state.color} lineLimit={1} minScaleFactor={6.5/10.5}>{state.short}</Text>
   </ZStack>
   <Text font={layout.meta} foregroundStyle="#96969C" lineLimit={1} minScaleFactor={.65}
    frame={{width:layout.badgeWidth,height:line,alignment:'trailing'}} position={{x:layout.width-layout.badgeWidth/2,y:y+line*1.5}}>{update.text}</Text>
   {!last?<Divider width={layout.width} y={layout.taskAdvance-.3}/>:null}
  </ZStack>
 </Button>
}
export function CodexView({snapshot,family,width,height,offline=false}:{snapshot:Snapshot;family:string;width:number;height:number;offline?:boolean}){
 const contentBottom=height,layout=referenceLayout(family,width,contentBottom,height)
 const displayed=recentTasks(snapshot.tasks).slice(0,layout.taskCount)
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
 </ZStack>
}
