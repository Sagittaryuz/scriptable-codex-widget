import { Circle, HStack, Image, Link, Rectangle, RoundedRectangle, Text, VStack, ZStack } from 'scripting'
import { Snapshot, stale, unreadCount, resetCreditsPresentation } from './model'
import { quotaDots, quotaDotGeometry } from './quota-dots'
import { HEADER_ICONS, CHATGPT_GLYPH_SCALE } from './header-icons'
import { referenceLayout } from './content-layout'
import { compactReset, HEADER_DESTINATIONS, shortcutLayout } from './shortcuts'
import { quotaSummaryLayout, quotaCapsuleDates } from './quota-summary'

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
 const old=stale(snapshot.usageObservedAt),remaining=window?.remainingPercent,historical=old&&Date.parse(snapshot.usageObservedAt)<=Date.now(),dots=quotaDots(remaining,old,historical)
 const dot=quotaDotGeometry(layout.width)
 const label=remaining==null?'Limite indisponível':`${Math.round(remaining)}% restante`,reset=compactReset(window)
 const summary=`${label} · ${old?'Antigo · ':''}Redefine ${reset}`
 const rowHeight=plan.tileHeight
 const panel=quotaSummaryLayout(layout),credits=resetCreditsPresentation(snapshot)
 const quotaValue=remaining==null?'—':`${Math.round(remaining)}%`,creditValue=credits.count==null?'—':String(credits.count)
 // Use one shared font size, including longer values, so the two capsules remain symmetric.
 const units=['restante',credits.count===1?'redefinição':'redefinições'],dates=quotaCapsuleDates(snapshot,window,old)
 const labelWidths=units.map(value=>value.length*panel.labelFont*.62)
 const valueUnits=(value:string)=>value==='—'?1.05:value.length*.75
 const valueFont=Math.min(panel.valueFont,(panel.contentWidth-Math.max(...labelWidths)-panel.inlineGap)/Math.max(valueUnits(quotaValue),valueUnits(creditValue)))
 const dateFont=Math.min(panel.dateFont,panel.contentWidth/(Math.max(dates.renewal.length,dates.expiry.length)*.62))
 return <ZStack alignment="topLeading" frame={{width:layout.width,height:layout.small?layout.height/2:layout.header}}>
  <HStack spacing={plan.gap} frame={{width:layout.width,height:rowHeight}} position={{x:layout.width/2,y:rowHeight/2}}>
   {(Object.keys(HEADER_DESTINATIONS) as (keyof typeof HEADER_DESTINATIONS)[]).map(key=><Link key={key} url={HEADER_DESTINATIONS[key]} accessibilityLabel={`Abrir ${labels[key]} no ChatGPT`}>
    <ZStack frame={{width:plan.cell,height:rowHeight}}>
     <RoundedRectangle cornerRadius={plan.radius} fill="#242426" stroke={{shapeStyle:"rgba(255,255,255,0.13)",strokeStyle:{lineWidth:.6}}} frame={{width:plan.cell,height:rowHeight}}/>
     <VStack alignment="center" spacing={2} frame={{width:plan.cell,height:plan.labelFont*1.2+2+plan.glyph,alignment:'center'}}>
      <Text font={plan.labelFont} fontWeight="semibold" foregroundStyle="white" lineLimit={1} minScaleFactor={.75} frame={{width:plan.cell,height:plan.labelFont*1.2,alignment:'center'}}>{labels[key]}</Text>
      <ZStack frame={{width:plan.glyph,height:plan.glyph}}>
       {icons[key]?<Image image={icons[key]} resizable renderingMode="original" frame={{width:plan.glyph*(key==='chatgpt'?CHATGPT_GLYPH_SCALE:1),height:plan.glyph*(key==='chatgpt'?CHATGPT_GLYPH_SCALE:1)}}/>:null}
       <UnreadBadge count={unreadCount(snapshot,key)} size={layout.small?8:14} iconSize={plan.glyph}/>
      </ZStack>
     </VStack>
    </ZStack>
   </Link>)}
  </HStack>
  <HStack spacing={(layout.width-dots.count*dot.width)/(dots.count-1)} frame={{width:layout.width,height:dot.height}} position={{x:layout.width/2,y:layout.barY}} accessibilityLabel={`Limite do Codex. ${summary}`}>
   {dots.fractions.map((fraction,index)=>fraction>0&&fraction<1?<ZStack key={index} alignment="topLeading" frame={{width:dot.width,height:dot.height}}>
    <RoundedRectangle cornerRadius={dot.radius} fill={dots.inactive} frame={{width:dot.width,height:dot.height}}/>
    <RoundedRectangle cornerRadius={dot.radius} fill={dots.colors[index]} frame={{width:dot.width,height:dot.height}}
     mask={<ZStack alignment="topLeading" frame={{width:dot.width,height:dot.height}}><Rectangle fill="white" frame={{width:dot.width*fraction,height:dot.height}}/></ZStack>}/>
   </ZStack>:<RoundedRectangle key={index} cornerRadius={dot.radius} fill={fraction===1?dots.colors[index]:dots.inactive} frame={{width:dot.width,height:dot.height}}/>)}
  </HStack>
  {layout.small?<ZStack alignment="topLeading" frame={{width:layout.width,height:layout.height/2}} accessibilityLabel={`Limite da cota: ${label}. ${old?'Observação antiga. ':''}Renovação da cota: ${reset}. ${credits.accessibility}`}>
   {units.map((unit,index)=>{const value=index===0?quotaValue:creditValue,valueWidth=valueUnits(value)*valueFont,firstWidth=valueWidth+panel.inlineGap+labelWidths[index];return <ZStack key={index} alignment="topLeading" frame={{width:panel.columnWidth,height:panel.capsuleHeight}} position={{x:index*(panel.columnWidth+panel.columnGap)+panel.columnWidth/2,y:panel.capsuleY}}>
    <RoundedRectangle cornerRadius={panel.capsuleHeight/2} fill="#242426" frame={{width:panel.columnWidth,height:panel.capsuleHeight}}/>
    <VStack alignment="center" spacing={panel.lineGap} frame={{width:panel.contentWidth,height:panel.textHeight,alignment:'center'}} position={{x:panel.columnWidth/2,y:panel.capsuleHeight/2}}>
     <HStack spacing={panel.inlineGap} frame={{width:firstWidth,height:panel.valueHeight,alignment:'center'}}>
      <Text font={valueFont} fontWeight="bold" monospacedDigit foregroundStyle={index===0?dots.balanceColor:credits.count==null?'#96969C':'white'} lineLimit={1} minScaleFactor={1}
       frame={{width:valueWidth,height:panel.valueHeight,alignment:'trailing'}} accessibilityLabel={index===1?credits.accessibility:`Limite da cota: ${label}${old?', observação antiga':''}`}>{value}</Text>
      <Text font={panel.labelFont} fontWeight="regular" foregroundStyle="#96969C" lineLimit={1} minScaleFactor={1} frame={{width:labelWidths[index],height:panel.valueHeight,alignment:'leading'}}>{unit}</Text>
     </HStack>
     <Text font={dateFont} foregroundStyle="#96969C" lineLimit={1} minScaleFactor={1} frame={{width:panel.contentWidth,height:panel.dateHeight}}>{index===0?dates.renewal:dates.expiry}</Text>
    </VStack>
   </ZStack>})}
  </ZStack>:<Text font={layout.quota} monospacedDigit foregroundStyle="white" lineLimit={1} minScaleFactor={.65} frame={{width:layout.width,height:layout.summaryHeight}} position={{x:layout.width/2,y:layout.barY+layout.bar/2+layout.belowBar+layout.summaryHeight/2}} accessibilityLabel={`Limite do Codex. ${summary}`}>{summary}</Text>}
 </ZStack>
}
