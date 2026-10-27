import { referenceLayout } from './content-layout'
// Fit the selected two-column summary into the existing reserve. Task/divider/header icon
// geometry is untouched. A discreet third line preserves the quota renewal date.
export function quotaSummaryLayout(layout:ReturnType<typeof referenceLayout>){
 const pointHeight=layout.width*29/971,top=layout.barY+pointHeight/2+.9
 const bottom=layout.height/2-layout.dividerHeight/2-.7,available=bottom-top
 const scale=Math.min(1,available/18.55),gap=.2*scale,labelHeight=5.5*scale,valueHeight=7.7*scale,renewalHeight=4.95*scale
 return {top,bottom,scale,labelFont:5*scale,valueFont:7*scale,renewalFont:4.5*scale,labelHeight,valueHeight,renewalHeight,gap,columnGap:6,columnWidth:(layout.width-6)/2,
  labelY:top+labelHeight/2,valueY:top+labelHeight+gap+valueHeight/2,renewalY:top+labelHeight+gap+valueHeight+gap+renewalHeight/2}
}
