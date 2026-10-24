import { HStack, Image, Link, Rectangle, Text, VStack, ZStack } from 'scripting'
import { Snapshot, quotaColor, stale } from './model'
import { HEADER_ICONS } from './header-icons'
import { referenceLayout } from './content-layout'
import { compactReset, HEADER_DESTINATIONS, shortcutLayout } from './shortcuts'

type Layout=ReturnType<typeof referenceLayout>
const labels={chatgpt:'ChatGPT',codex:'Codex',voice:'Voice Mode',dots:'Dots'} as const
// Decode the small bundled assets once per execution; no network or repeated row decoding.
let decodedIcons:Record<string,any>|undefined
function headerIcons(){return decodedIcons??=Object.fromEntries(Object.entries(HEADER_ICONS).map(([key,data])=>[key,UIImage.fromBase64String(data)]))}
export function ShortcutHeader({snapshot,layout}:{snapshot:Snapshot;layout:Layout}){
 const icons=headerIcons()
 const plan=shortcutLayout(layout.width,layout.header,layout.small,layout.large)
 const window=[...snapshot.windows].sort((a,b)=>a.remainingPercent-b.remainingPercent)[0]
 const old=stale(snapshot.usageObservedAt),remaining=window?.remainingPercent,base=quotaColor(remaining,old),color=base==='#4BAEFF'?'#0A84FF':base
 const label=remaining==null?'Limite indisponível':`${Math.round(remaining)}% restante`,reset=compactReset(window)
 const summary=`${label} · ${old?'Antigo · ':''}Redefine ${reset}`
 const rowHeight=plan.shortcutFont*1.2+plan.spacing+plan.glyph
 return <ZStack alignment="topLeading" frame={{width:layout.width,height:layout.header}}>
  <VStack spacing={plan.spacing} frame={{width:layout.width,height:plan.height}} position={{x:layout.width/2,y:plan.height/2}}>
   <HStack spacing={plan.gap} frame={{width:layout.width,height:rowHeight}}>
    {(Object.keys(HEADER_DESTINATIONS) as (keyof typeof HEADER_DESTINATIONS)[]).map(key=><Link key={key} url={HEADER_DESTINATIONS[key]} accessibilityLabel={`Abrir ${labels[key]} no ChatGPT`}>
     <VStack spacing={plan.spacing} frame={{width:plan.cell,height:rowHeight}}>
      <Text font={plan.shortcutFont} fontWeight="semibold" foregroundStyle="white" lineLimit={1} minScaleFactor={.75}>{labels[key]}</Text>
      {icons[key]?<Image image={icons[key]} resizable renderingMode="original" frame={{width:plan.glyph,height:plan.glyph}}/>:null}
     </VStack>
    </Link>)}
   </HStack>
   <ZStack alignment="leading" frame={{width:layout.width,height:plan.bar}} accessibilityLabel={`Limite do Codex. ${summary}`}>
    <Rectangle fill="#303033" clipShape="capsule" frame={{width:layout.width,height:plan.bar}}/>
    {remaining!=null&&remaining>0?<Rectangle fill={color} clipShape="capsule" frame={{width:layout.width*remaining/100,height:plan.bar}}/>:null}
   </ZStack>
   <Text font={plan.quota} monospacedDigit foregroundStyle={color} lineLimit={1} minScaleFactor={.65} accessibilityLabel={`Limite do Codex. ${summary}`}>{summary}</Text>
  </VStack>
  <Rectangle fill="rgba(255,255,255,0.13)" frame={{width:layout.width,height:.6}} position={{x:layout.width/2,y:layout.header-.3}}/>
 </ZStack>
}
