import { Image, Link, Text, ZStack } from 'scripting'
import { Snapshot } from './model'
import { HEADER_ICONS, CHATGPT_GLYPH_SCALE } from './header-icons'
import { HEADER_DESTINATIONS } from './shortcuts'
import { liquidQuota } from './liquid-quota'

const shortcuts=['dots','codex','voice','chatgpt'] as const
const labels={dots:'Dots',codex:'Codex',voice:'Voice',chatgpt:'ChatGPT'}
let icons:Record<string,any>|undefined
// The small family is a launcher only. Larger widgets retain their existing tree.
export function SmallLauncher({snapshot,width,height}:{snapshot:Snapshot;width:number;height:number}){
 icons??=Object.fromEntries(Object.entries(HEADER_ICONS).map(([key,data])=>[key,UIImage.fromBase64String(data)]))
 const state=liquidQuota(snapshot),remaining=state.remaining
 const middle=height/2,band=24,cellWidth=width/2,cellHeight=(height-band)/2
 const glyph=Math.min(42,cellHeight-12,cellWidth-16)
 return <ZStack alignment="topLeading" frame={{width,height}}>
  {shortcuts.map((key,index)=><Link key={key} url={HEADER_DESTINATIONS[key]} frame={{width:cellWidth,height:cellHeight}} position={{x:cellWidth*(index%2+.5),y:index<2?cellHeight/2:height-cellHeight/2}} accessibilityLabel={`Abrir ${labels[key]} no ChatGPT`}>
   <ZStack frame={{width:cellWidth,height:cellHeight}}>
    {icons![key]?<Image image={icons![key]} resizable renderingMode="original" frame={{width:glyph*(key==='chatgpt'?CHATGPT_GLYPH_SCALE:1),height:glyph*(key==='chatgpt'?CHATGPT_GLYPH_SCALE:1)}}/>:null}
   </ZStack>
  </Link>)}
  <Text font={9} fontWeight="semibold" monospacedDigit accessibilityLabel={state.label} foregroundStyle="white" lineLimit={1} minScaleFactor={.75} frame={{width,height:12}} position={{x:width/2,y:middle}}>{remaining==null?'—':`${Math.round(remaining)}%`}{state.historical?' · '+state.observationTime:''}</Text>
 </ZStack>
}
