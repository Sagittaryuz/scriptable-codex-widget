import { ControlWidget, ControlWidgetButton } from 'scripting'
import { RefreshCodex } from './app_intents'
ControlWidget.present(<ControlWidgetButton intent={RefreshCodex(undefined)} label={{title:'Consultar Codex',systemImage:'terminal'}}/>)
