import { Circle, HStack, Image, Link, Rectangle, RoundedRectangle, Text, VStack, ZStack } from 'scripting'
import { Snapshot, quotaColor, stale } from './model'
import { CODEX_SYMBOL } from './codex-symbol'
import { referenceLayout } from './content-layout'
import { compactReset, HEADER_DESTINATIONS, shortcutLayout } from './shortcuts'

type Layout=ReturnType<typeof referenceLayout>
const VOICE='#29D5DF',DOTS='#A855F7'
function DotsGlyph({size}:{size:number}){
 const diameter=size*.33
 return <ZStack frame={{width:size,height:size}} accessibilityLabel="Dots">
  {[[.5,.24],[.25,.70],[.75,.70]].map(([x,y],i)=><Circle key={i} fill={DOTS} frame={{width:diameter,height:diameter}} position={{x:size*x,y:size*y}}/>)}
 </ZStack>
}
function Tile({url,label,width,height,children}:any){
 return <Link url={url} accessibilityLabel={label}><ZStack frame={{width,height}}>
  <RoundedRectangle cornerRadius={Math.min(10,height*.22)} fill={{gradient:[{color:'#202123',location:0},{color:'#121314',location:1}],startPoint:{x:0,y:0},endPoint:{x:1,y:1}}} stroke={{shapeStyle:'rgba(255,255,255,0.08)',strokeStyle:{lineWidth:.5}}} frame={{width,height}}/>
  {children}
 </ZStack></Link>
}
export function ShortcutHeader({snapshot,layout}:{snapshot:Snapshot;layout:Layout}){
 const plan=shortcutLayout(layout.width,layout.header,layout.small,layout.large)
 const window=[...snapshot.windows].sort((a,b)=>a.remainingPercent-b.remainingPercent)[0]
 const old=stale(snapshot.usageObservedAt),remaining=window?.remainingPercent,base=quotaColor(remaining,old),color=base==='#4BAEFF'?'#0A84FF':base
 const inner=plan.codex-plan.padding*2,symbol=UIImage.fromBase64String(CODEX_SYMBOL),label=remaining==null?'Limite indisponível':`${Math.round(remaining)}% restante`
 const reset=compactReset(window),labelWidth=inner-plan.logo-(layout.small?3:5)
 return <ZStack alignment="topLeading" frame={{width:layout.width,height:layout.header}}>
  <HStack spacing={plan.gap} frame={{width:layout.width,height:plan.height}} position={{x:layout.width/2,y:plan.height/2}}>
   <Tile url={HEADER_DESTINATIONS.codex} label={`Abrir Codex. ${label}. ${reset}${old?'. Dados antigos.':''}`} width={plan.codex} height={plan.height}>
    <VStack alignment="leading" spacing={layout.small?2:3} frame={{width:inner,height:plan.height-plan.padding*2}}>
     <HStack spacing={layout.small?3:5}>
      {symbol?<Image image={symbol} resizable renderingMode="original" frame={{width:plan.logo,height:plan.logo}}/>:null}
      <VStack alignment="leading" spacing={1} frame={{width:labelWidth}}>
       <Text font={plan.title} fontWeight="bold" foregroundStyle="white" lineLimit={1} minScaleFactor={.75}>Codex</Text>
       <Text font={plan.quota} fontWeight="semibold" monospacedDigit foregroundStyle={color} lineLimit={1} minScaleFactor={.65}>{layout.small?(remaining==null?'—':`${Math.round(remaining)}%`):label}</Text>
      </VStack>
     </HStack>
     <ZStack alignment="leading" frame={{width:inner,height:plan.bar}} accessibilityLabel={label}>
      <Rectangle fill="#303033" clipShape="capsule" frame={{width:inner,height:plan.bar}}/>
      {remaining!=null&&remaining>0?<Rectangle fill={color} clipShape="capsule" frame={{width:inner*remaining/100,height:plan.bar}}/>:null}
     </ZStack>
     <Text font={plan.reset} foregroundStyle="#96969C" lineLimit={1} minScaleFactor={.65}>{old?'Antigo · ':''}{reset}</Text>
    </VStack>
   </Tile>
   <Tile url={HEADER_DESTINATIONS.voice} label="Abrir ChatGPT Voice" width={plan.other} height={plan.height}>
    <VStack spacing={layout.small?2:4} padding={2}>
     <Image systemName="waveform" font={plan.glyph} foregroundStyle={VOICE}/>
     <VStack spacing={0}><Text font={plan.shortcutFont} fontWeight="semibold" foregroundStyle="white" lineLimit={1} minScaleFactor={.7}>ChatGPT</Text><Text font={plan.shortcutFont} fontWeight="semibold" foregroundStyle="white" lineLimit={1}>Voice</Text></VStack>
    </VStack>
   </Tile>
   <Tile url={HEADER_DESTINATIONS.dots} label="Abrir Dots no ChatGPT" width={plan.other} height={plan.height}>
    <VStack spacing={layout.small?2:4}><DotsGlyph size={plan.glyph}/><Text font={plan.shortcutFont} fontWeight="semibold" foregroundStyle="white" lineLimit={1}>Dots</Text></VStack>
   </Tile>
  </HStack>
  <Rectangle fill="rgba(255,255,255,0.13)" frame={{width:layout.width,height:.6}} position={{x:layout.width/2,y:layout.header-.3}}/>
 </ZStack>
}
