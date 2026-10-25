import { AppIntentManager, AppIntentProtocol, ControlWidget } from 'scripting'
import { refreshSnapshot } from './repository'
import { notifyChanges } from './pro'
import { reloadWidgets } from './pro-common'
export const RefreshCodex=AppIntentManager.register({name:'RefreshCodex',protocol:AppIntentProtocol.AppIntent,perform:async()=>{
  try{
    const result=await refreshSnapshot()
    try{await notifyChanges(result.snapshot)}catch{Storage.set('codex-notification-diagnostic',{at:Date.now(),state:'permission-or-delivery-failed'})}
    Storage.set('manual-refresh',{at:Date.now(),state:result.offline?'offline-cache-preserved':'downloaded',observedAt:result.snapshot.generatedAt})
  }finally{await reloadWidgets();if(typeof ControlWidget.reloadButtons==='function')ControlWidget.reloadButtons()}
}})
