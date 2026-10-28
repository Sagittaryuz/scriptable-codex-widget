// Harness-only native labels over captured Ativos0.2.21 geometry. All values/icons illustrative.
export function Reference({width,height}){
 const p=layout('small',width,height),G=GEOMETRY
 return <ZStack alignment="topLeading" frame={{width,height}} widgetBackground="#1E1E1E">
  {[0,1,2,3].map(i=>{const y=i*(G.row+G.gap);return <ZStack alignment="topLeading" frame={{width,height}}>
   <Circle fill="#34343A" {...place(p,0,y+G.iconTop,26,26)}/>
   <Label value={'Ativo '+String.fromCharCode(65+i)} plan={p} x={G.detail} y={y+G.line1Top} width={G.name} height={G.top} size={10} min={8} bold/>
   <Label value="123,45" plan={p} x={G.detail+G.name} y={y+G.line1Top} width={G.price} height={G.top} size={17.5} min={8.5} bold right/>
   <Rectangle fill="#30C795" {...place(p,G.detail,y+G.graphTop,G.graph,1)}/>
   <Label value="+0,10%" plan={p} x={G.detail+G.graph+3} y={y+G.line2Top} width={G.percent} height={G.middle} size={10.5} min={7.5} right color="#30C795"/>
   <Label value={'CODE_'+String.fromCharCode(65+i)} plan={p} x={G.detail} y={y+G.line3Top} width={G.name} height={G.bottom} size={6} min={5} color="#96969C"/>
   <Label value="08:17 INV" plan={p} x={G.detail+68} y={y+G.line3Top} width={48} height={G.bottom} size={7.5} min={6} right color="#96969C"/>
   {i<3?<Rectangle fill="rgba(255,255,255,0.13)" {...place(p,0,y+G.row,G.column,G.gap)}/>:null}
  </ZStack>})}
 </ZStack>
}
