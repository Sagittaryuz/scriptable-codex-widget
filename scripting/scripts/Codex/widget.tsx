import { Widget } from 'scripting';
import { refreshSnapshot } from './repository';
import { CodexView } from './view';
import { refreshMinutes, dashboardStatus } from './pro-common';
import { notifyChanges } from './pro';
refreshSnapshot().then(async result=>{
 console.log(JSON.stringify({event:'codex-widget-render',version:'1.1.1',family:Widget.family,size:Widget.displaySize,generatedAt:result.snapshot.generatedAt,offline:result.offline,tasks:result.snapshot.tasks.length}));
 dashboardStatus('Codex',{at:Date.parse(result.snapshot.generatedAt),label:result.snapshot.tasks.length+' tarefas observadas'});
 Widget.present(<CodexView snapshot={result.snapshot} family={Widget.family} width={Widget.displaySize.width} height={Widget.displaySize.height} offline={result.offline}/>,{policy:'after',date:new Date(Date.now()+refreshMinutes()*60000)});
 try{await notifyChanges(result.snapshot)}catch{}
});
