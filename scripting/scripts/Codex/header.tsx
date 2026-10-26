import { Circle, HStack, Image, Link, RoundedRectangle, Text, VStack, ZStack } from 'scripting'
import { Snapshot, stale, unreadCount } from './model'
import { quotaDots } from './quota-dots'
import { HEADER_ICONS } from './header-icons'
import { referenceLayout } from './content-layout'
import { compactReset, HEADER_DESTINATIONS, shortcutLayout } from './shortcuts'

type Layout=ReturnType<typeof referenceLayout>
const labels={chatgpt:'ChatGPT',codex:'Codex',voice:'Voice',dots:'Dots'} as const
// Decode the small bundled assets once per execution; no network or repeated row decoding.
let decodedIcons:Record<string,any>|undefined
function headerIcons(){return decodedIcons??=Object.fromEntries(Object.entries(HEADER_ICONS).map(([key,data])=>[key,UIImage.fromBase64String(data)]))}
function UnreadBadge({count,size,iconSize}:{count:number|null;size:number;iconSize:number}){
 if(count==null||count<=0)return null;
 return <ZStack frame={{width:size,height:size}} position={{x:iconSize-size*.2,y:size*.4}} accessibilityLabel={`${count} mensagens não lidas`}>
  <Circle fill="#FF3B30" frame={{width:size,height:size}}/>
  <Text font={size*.48} fontWeight="bold" monospacedDigit foregroundStyle="white" lineLimit={1} minScaleFactor={.7} frame={{width:size,height:size,alignment:'center'}}>{count>99?'99+':String(count)}</Text>
 </ZStack>
}
export function ShortcutHeader({snapshot,layout}:{snapshot:Snapshot;layout:Layout}){
 const icons=headerIcons()
 const plan=shortcutLayout(layout.width,layout.header,layout.small,layout.large)
 const window=[...snapshot.windows].sort((a,b)=>a.remainingPercent-b.remainingPercent)[0]
 const old=stale(snapshot.usageObservedAt),remaining=window?.remainingPercent,dots=quotaDots(remaining,old)
 const label=remaining==null?'Limite indisponível':`${Math.round(remaining)}% restante`,reset=compactReset(window)
 const summary=`${label} · ${old?'Antigo · ':''}Redefine ${reset}`
 const rowHeight=plan.tileHeight
 return <ZStack alignment="topLeading" frame={{width:layout.width,height:layout.header}}>
  <HStack spacing={plan.gap} frame={{width:layout.width,height:rowHeight}} position={{x:layout.width/2,y:rowHeight/2}}>
   {(Object.keys(HEADER_DESTINATIONS) as (keyof typeof HEADER_DESTINATIONS)[]).map(key=><Link key={key} url={HEADER_DESTINATIONS[key]} accessibilityLabel={`Abrir ${labels[key]} no ChatGPT`}>
    <ZStack frame={{width:plan.cell,height:rowHeight}}>
     <RoundedRectangle cornerRadius={plan.radius} fill="#242426" stroke={{shapeStyle:"rgba(255,255,255,0.13)",strokeStyle:{lineWidth:.6}}} frame={{width:plan.cell,height:rowHeight}}/>
     <VStack alignment="center" spacing={2} frame={{width:plan.cell,height:plan.labelFont*1.2+2+plan.glyph,alignment:'center'}}>
      <Text font={plan.labelFont} fontWeight="semibold" foregroundStyle="white" lineLimit={1} minScaleFactor={.75} frame={{width:plan.cell,height:plan.labelFont*1.2,alignment:'center'}}>{labels[key]}</Text>
      <ZStack frame={{width:plan.glyph,height:plan.glyph}}>
       {icons[key]?<Image image={icons[key]} resizable renderingMode="original" frame={{width:plan.glyph,height:plan.glyph}}/>:null}
       <UnreadBadge count={unreadCount(snapshot,key)} size={layout.small?8:14} iconSize={plan.glyph}/>
      </ZStack>
     </VStack>
    </ZStack>
   </Link>)}
  </HStack>
  <HStack spacing={(layout.width-dots.count*layout.bar)/(dots.count-1)} frame={{width:layout.width,height:layout.bar}} position={{x:layout.width/2,y:layout.barY}} accessibilityLabel={`Limite do Codex. ${summary}`}>
   {Array.from({length:dots.count},(_,index)=><Circle key={index} fill={dots.active!=null&&index<dots.active?dots.color:dots.inactive} frame={{width:layout.bar,height:layout.bar}}/>)}
  </HStack>
  <Text font={layout.quota} monospacedDigit foregroundStyle="white" lineLimit={1} minScaleFactor={.65} frame={{width:layout.width,height:layout.summaryHeight}} position={{x:layout.width/2,y:layout.barY+layout.bar/2+layout.belowBar+layout.summaryHeight/2}} accessibilityLabel={`Limite do Codex. ${summary}`}>{summary}</Text>
 </ZStack>
}
