import { Navigation, Script, Widget } from 'scripting'
import { CodexScreen } from './screen'
import { openWidgetDestination, requestWidgetReload, resumeWidgetTap } from './widget-tap'
const stopResume=typeof Script.onResume==='function'?Script.onResume(details=>{void resumeWidgetTap(details)}):()=>{}
async function main(){
  if(await openWidgetDestination(Script.queryParameters))return
  const family=Script.queryParameters?.preview
  if(typeof family==='string'&&['systemSmall','systemMedium','systemLarge'].includes(family)){
    await Widget.preview({family:family as 'systemSmall'|'systemMedium'|'systemLarge'});return
  }
  requestWidgetReload()
  await Navigation.present(<CodexScreen/>)
}
main().catch(()=>Dialog.alert({title:'Codex',message:'Não foi possível abrir. Seus dados foram preservados.'})).finally(()=>{stopResume();Script.exit()})
