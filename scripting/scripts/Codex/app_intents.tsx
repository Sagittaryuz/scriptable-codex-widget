import { AppIntentManager, AppIntentProtocol, ControlWidget } from 'scripting'
import { refreshSnapshot } from './repository'
import { reloadWidgets } from './pro-common'
export const RefreshCodex=AppIntentManager.register({name:'RefreshCodex',protocol:AppIntentProtocol.AppIntent,perform:async()=>{
  try{
    const result=await refreshSnapshot()
    Storage.set('manual-refresh',{at:Date.now(),state:result.offline?'offline-cache-preserved':'downloaded',observedAt:result.snapshot.generatedAt})
  }finally{await reloadWidgets();if(typeof ControlWidget.reloadButtons==='function')ControlWidget.reloadButtons()}
}})
