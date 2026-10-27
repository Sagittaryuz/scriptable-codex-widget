import { Safari, Widget } from 'scripting'
import { HEADER_DESTINATIONS, widgetTapChannel } from './shortcuts'
import { refreshForTap } from './tap-refresh'

export function requestWidgetReload(){
 try{Widget.reloadAll();return true}catch{return false}
}
export async function openWidgetDestination(query:unknown):Promise<boolean>{
 const channel=widgetTapChannel(query)
 if(!channel)return false
 // Finish a bounded snapshot read before switching apps; timeout/offline preserves the cache.
 try{await refreshForTap()}catch{}
 requestWidgetReload()
 try{await Safari.openURL(HEADER_DESTINATIONS[channel])}catch{}
 return true
}
export async function resumeWidgetTap(details:{queryParameters?:unknown;widgetParameter?:unknown;controlWidgetParameter?:unknown}){
 if(await openWidgetDestination(details?.queryParameters))return
 // A plain widget re-open requests reload only. Ordinary foreground resumes do nothing.
 if(typeof details?.widgetParameter==='string'||typeof details?.controlWidgetParameter==='string')requestWidgetReload()
}
