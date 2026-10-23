import { AppIntentManager, AppIntentProtocol, ControlWidget } from 'scripting'
import { refreshSnapshot } from './repository'
import { reloadWidgets } from './pro-common'
export const RefreshCodex=AppIntentManager.register({name:'RefreshCodex',protocol:AppIntentProtocol.AppIntent,perform:async()=>{
  await refreshSnapshot();await reloadWidgets();ControlWidget.reloadButtons()
}})
