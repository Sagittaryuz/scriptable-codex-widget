import { ShortcutHeader } from './header'
import { referenceLayout } from './content-layout'
import { RefreshFooter, footerLayout } from './refresh-footer'
import { HStack, VStack, Text, Image, Rectangle, Circle, Link, ZStack } from 'scripting'
import { RefreshCodex } from './app_intents'
import { POPULAR_BACKGROUND } from './background'
import { Snapshot, Task, stale, taskPresentation, taskSourceLabel, taskURL } from './model'

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
function TaskRow({task,layout,last}:{task:Task;layout:Layout;last:boolean}){
 const state=referenceStateStyle(task),w=layout.width-layout.rowInset*2
 return <Link url={taskURL(task)}><ZStack alignment="topLeading" frame={{width:layout.width,height:layout.row}}>
  <HStack spacing={layout.rowGap} frame={{width:w,height:layout.row-2}} position={{x:layout.width/2,y:layout.row/2}}>
   <ZStack frame={{width:layout.icon,height:layout.icon}}>
    <Circle fill={state.iconBackground} frame={{width:layout.icon,height:layout.icon}}/>
    <Image systemName={state.symbol} font={layout.icon*0.52} foregroundStyle="white" frame={{width:layout.icon,height:layout.icon}}/>
   </ZStack>
   <VStack alignment="leading" spacing={layout.small?1:3} frame={{maxWidth:'infinity',alignment:'leading'}}>
    <Text font={layout.title} fontWeight="semibold" foregroundStyle="white" lineLimit={1} minScaleFactor={0.8}>{task.title}</Text>
    <Text font={layout.meta} foregroundStyle="#96969C" lineLimit={1} minScaleFactor={0.75}>{taskSourceLabel(task)} · {state.short}</Text>
   </VStack>
   <ZStack frame={{width:layout.badgeWidth,height:layout.badgeHeight}}>
    <Rectangle fill={state.background} clipShape="capsule" frame={{width:layout.badgeWidth,height:layout.badgeHeight}}/>
    <Text font={layout.badgeFont} fontWeight="semibold" foregroundStyle={state.color} lineLimit={1} minScaleFactor={0.7}>{state.short}</Text>
   </ZStack>
   <Image systemName="chevron.right" font={layout.chevron} foregroundStyle="#69696F" frame={{width:layout.chevron,height:layout.icon}}/>
  </HStack>
  {!last?<Divider width={layout.width} y={layout.row-0.3}/>:null}
 </ZStack></Link>
}
export function CodexView({snapshot,family,width,height,offline=false}:{snapshot:Snapshot;family:string;width:number;height:number;offline?:boolean}){
 const contentBottom=footerLayout(width,height).top,layout=referenceLayout(family,width,contentBottom)
 const displayed=[...snapshot.tasks].sort((a,b)=>{
  const rank=(t:Task)=>stale(t.observedAt)?4:t.detail.startsWith('Último')?3:t.state==='approval'||t.state==='input'?0:t.state==='error'?1:t.state==='running'?2:3
  return rank(a)-rank(b)
 }).slice(0,3)
 const background=UIImage.fromBase64String(POPULAR_BACKGROUND)
 return <ZStack alignment="topLeading" frame={{width,height}} clipped widgetBackground="#1E1E1E">
  {background?<Image image={background} resizable renderingMode="original" frame={{width,height}}/>:null}
  <VStack alignment="leading" spacing={0} frame={{width:layout.width,height:layout.height}} position={{x:width/2,y:contentBottom/2}}>
   <ShortcutHeader snapshot={snapshot} layout={layout}/>
   {displayed.length?displayed.map((task,i)=><TaskRow key={task.id} task={task} layout={layout} last={i===displayed.length-1}/>):<Text font={layout.title} foregroundStyle="#96969C" frame={{maxHeight:'infinity'}}>Nenhuma tarefa disponível</Text>}
  </VStack>
  <RefreshFooter width={width} height={height} at={snapshot.generatedAt} intent={RefreshCodex()} label="Atualizar todos os widgets do Scripting. Última coleta"/>
 </ZStack>
}
