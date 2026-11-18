import { Image, Link, RoundedRectangle, Text, ZStack } from 'scripting'
import { HEADER_ICONS, CHATGPT_GLYPH_SCALE } from './header-icons'
import { HEADER_DESTINATIONS } from './shortcuts'

const shortcuts=['dots','codex','voice','chatgpt'] as const
const labels={dots:'Dots',codex:'Codex',voice:'Voice',chatgpt:'ChatGPT'}
let icons:Record<string,any>|undefined
// Small only: leave the middle clear for the outlined quota.
export function SmallLauncher({width,height}:{width:number;height:number}){
 icons??=Object.fromEntries(Object.entries(HEADER_ICONS).map(([key,data])=>[key,UIImage.fromBase64String(data)]))
 const cellWidth=width/2,cellHeight=(height-36)/2
 const w=Math.min(60,cellWidth-6),h=Math.min(49,cellHeight-3),radius=Math.min(15,h*.31)
 const glyph=Math.min(29,h-18),labelHeight=12,labelGap=2,contentTop=(h-glyph-labelGap-labelHeight)/2
 const frame={width:w,height:h}
 const shape={type:'rect',cornerRadius:radius,style:'continuous'} as const
 return <ZStack alignment="topLeading" frame={{width,height}}>
  {shortcuts.map((key,index)=><Link key={key} url={HEADER_DESTINATIONS[key]} frame={frame} position={{x:cellWidth*(index%2+.5),y:index<2?cellHeight/2:height-cellHeight/2}} accessibilityLabel={`Abrir ${labels[key]} no ChatGPT`}>
   <ZStack alignment="topLeading" frame={frame}>
    <RoundedRectangle cornerRadius={radius} fill="rgba(4,8,11,.38)" frame={frame} position={{x:w/2,y:h/2+.8}} clipShape={shape}/>
    <RoundedRectangle cornerRadius={radius} fill="rgba(25,31,33,.62)" stroke={{shapeStyle:'rgba(233,248,243,.42)',strokeStyle:{lineWidth:1.2}}} frame={frame} clipShape={shape}/>
    <RoundedRectangle cornerRadius={radius-1.4} fill="clear" stroke={{shapeStyle:'rgba(255,255,255,.10)',strokeStyle:{lineWidth:.5}}} frame={{width:w-3,height:h-3}} position={{x:w/2,y:h/2}}/>
    {icons![key]?<Image image={icons![key]} resizable renderingMode="original" frame={{width:glyph*(key==='chatgpt'?CHATGPT_GLYPH_SCALE:1),height:glyph*(key==='chatgpt'?CHATGPT_GLYPH_SCALE:1)}} position={{x:w/2,y:contentTop+glyph/2}}/>:null}
    <Text font={10.5} fontWeight="semibold" foregroundStyle="white" lineLimit={1} minScaleFactor={.8} frame={{width:w-8,height:labelHeight,alignment:'center'}} position={{x:w/2,y:h-contentTop-labelHeight/2}}>{labels[key]}</Text>
   </ZStack>
  </Link>)}
 </ZStack>
}
