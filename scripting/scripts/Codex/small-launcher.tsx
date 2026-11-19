import { Image, Link, RoundedRectangle, Text, ZStack } from 'scripting'
import { HEADER_ICONS, CHATGPT_GLYPH_SCALE } from './header-icons'
import { HEADER_DESTINATIONS } from './shortcuts'
import { launcherGeometry } from './launcher-geometry'

const shortcuts=['dots','codex','voice','chatgpt'] as const
const labels={dots:'Dots',codex:'Codex',voice:'Voice',chatgpt:'ChatGPT'}
let icons:Record<string,any>|undefined
// Small only. The large outline remains visible through four low-tint lenses.
export function SmallLauncher({width,height}:{width:number;height:number}){
 icons??=Object.fromEntries(Object.entries(HEADER_ICONS).map(([key,data])=>[key,UIImage.fromBase64String(data)]))
 const {w,h,radius,centers}=launcherGeometry(width,height)
 const glyph=Math.min(40,h*.56,w*.59),labelHeight=Math.min(17,h*.26),labelGap=2,contentTop=(h-glyph-labelGap-labelHeight)/2
 const frame={width:w,height:h}
 const shape={type:'rect',cornerRadius:radius,style:'continuous'} as const
 return <ZStack alignment="topLeading" frame={{width,height}}>
  {shortcuts.map((key,index)=><Link key={key} url={HEADER_DESTINATIONS[key]} frame={frame} position={centers[index]} accessibilityLabel={`Abrir ${labels[key]} no ChatGPT`}>
   <ZStack alignment="topLeading" frame={frame}>
    <RoundedRectangle cornerRadius={radius} fill="rgba(3,8,12,0.05)" frame={frame} position={{x:w/2,y:h/2+.8}} clipShape={shape}/>
    <RoundedRectangle cornerRadius={radius} fill="rgba(193,226,245,0.08)" stroke={{shapeStyle:'rgba(230,249,255,0.58)',strokeStyle:{lineWidth:1.2}}} frame={frame} clipShape={shape}/>
    <RoundedRectangle cornerRadius={radius-1.4} fill="clear" stroke={{shapeStyle:'rgba(255,255,255,0.18)',strokeStyle:{lineWidth:.5}}} frame={{width:w-3,height:h-3}} position={{x:w/2,y:h/2}}/>
    {icons![key]?<Image image={icons![key]} resizable renderingMode="original" frame={{width:glyph*(key==='chatgpt'?CHATGPT_GLYPH_SCALE:1),height:glyph*(key==='chatgpt'?CHATGPT_GLYPH_SCALE:1)}} position={{x:w/2,y:contentTop+glyph/2}}/>:null}
    <Text font={Math.min(14,labelHeight*.86)} fontWeight="semibold" foregroundStyle="white" lineLimit={1} minScaleFactor={.8} frame={{width:w-8,height:labelHeight,alignment:'center'}} position={{x:w/2,y:h-contentTop-labelHeight/2}}>{labels[key]}</Text>
   </ZStack>
  </Link>)}
 </ZStack>
}
