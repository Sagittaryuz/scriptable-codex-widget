import { HStack, Image, Link, Rectangle, RoundedRectangle, Text, ZStack } from 'scripting'
import { Snapshot, stale } from './model'
import { HEADER_ICONS, CHATGPT_GLYPH_SCALE } from './header-icons'
import { HEADER_DESTINATIONS } from './shortcuts'
import { quotaDots, quotaDotGeometry } from './quota-dots'

const shortcuts=['dots','codex','voice','chatgpt'] as const
const labels={dots:'Dots',codex:'Codex',voice:'Voice',chatgpt:'ChatGPT'}
let icons:Record<string,any>|undefined
// The small family is a launcher only. Larger widgets retain their existing tree.
export function SmallLauncher({snapshot,width,height}:{snapshot:Snapshot;width:number;height:number}){
 icons??=Object.fromEntries(Object.entries(HEADER_ICONS).map(([key,data])=>[key,UIImage.fromBase64String(data)]))
 const window=[...snapshot.windows].sort((a,b)=>a.remainingPercent-b.remainingPercent)[0]
 const old=stale(snapshot.usageObservedAt),remaining=window?.remainingPercent
 const dots=quotaDots(remaining,old,old&&Date.parse(snapshot.usageObservedAt)<=Date.now())
 const dot=quotaDotGeometry(width),middle=height/2,band=24,cellWidth=width/2,cellHeight=(height-band)/2
 const glyph=Math.min(42,cellHeight-12,cellWidth-16)
 const label=remaining==null?'Limite indisponível':`${Math.round(remaining)}% restante`
 return <ZStack alignment="topLeading" frame={{width,height}}>
  {shortcuts.map((key,index)=><Link key={key} url={HEADER_DESTINATIONS[key]} frame={{width:cellWidth,height:cellHeight}} position={{x:cellWidth*(index%2+.5),y:index<2?cellHeight/2:height-cellHeight/2}} accessibilityLabel={`Abrir ${labels[key]} no ChatGPT`}>
   <ZStack frame={{width:cellWidth,height:cellHeight}}>
    {icons![key]?<Image image={icons![key]} resizable renderingMode="original" frame={{width:glyph*(key==='chatgpt'?CHATGPT_GLYPH_SCALE:1),height:glyph*(key==='chatgpt'?CHATGPT_GLYPH_SCALE:1)}}/>:null}
   </ZStack>
  </Link>)}
  <HStack spacing={(width-dots.count*dot.width)/(dots.count-1)} frame={{width,height:dot.height}} position={{x:width/2,y:middle-5}} accessibilityLabel={`Limite do Codex. ${label}${old?' · Observação antiga':''}`}>
   {dots.fractions.map((fraction,index)=>fraction>0&&fraction<1?<ZStack key={index} alignment="topLeading" frame={{width:dot.width,height:dot.height}}>
    <RoundedRectangle cornerRadius={dot.radius} fill={dots.inactive} frame={{width:dot.width,height:dot.height}}/>
    <RoundedRectangle cornerRadius={dot.radius} fill={dots.colors[index]} frame={{width:dot.width,height:dot.height}}
     mask={<ZStack alignment="topLeading" frame={{width:dot.width,height:dot.height}}><Rectangle fill="white" frame={{width:dot.width*fraction,height:dot.height}}/></ZStack>}/>
   </ZStack>:<RoundedRectangle key={index} cornerRadius={dot.radius} fill={fraction===1?dots.colors[index]:dots.inactive} frame={{width:dot.width,height:dot.height}}/>)}
  </HStack>
  <Text font={9} fontWeight="semibold" monospacedDigit foregroundStyle={dots.balanceColor} lineLimit={1} minScaleFactor={.75} frame={{width,height:12}} position={{x:width/2,y:middle+6}}>{remaining==null?'—':`${Math.round(remaining)}%`}{old?' †':''}</Text>
 </ZStack>
}
