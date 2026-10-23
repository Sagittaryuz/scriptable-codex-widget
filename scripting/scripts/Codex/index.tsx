import { Navigation, Script, Widget } from 'scripting'
import { CodexScreen } from './screen'
async function main(){
  const family=Script.queryParameters?.preview
  if(typeof family==='string'&&['systemSmall','systemMedium','systemLarge'].includes(family)){
    await Widget.preview({family:family as 'systemSmall'|'systemMedium'|'systemLarge'});return
  }
  await Navigation.present(<CodexScreen/>)
}
main().catch(()=>Dialog.alert({title:'Codex',message:'Não foi possível abrir. Seus dados foram preservados.'})).finally(()=>Script.exit())
