import { Widget } from 'scripting';
import { refreshSnapshot } from './repository';
import { CodexView } from './view';
refreshSnapshot().then(result=>{
 console.log(JSON.stringify({event:'codex-widget-render',version:'1.0.3',family:Widget.family,size:Widget.displaySize,generatedAt:result.snapshot.generatedAt,offline:result.offline,tasks:result.snapshot.tasks.length}));
 Widget.present(<CodexView snapshot={result.snapshot} family={Widget.family} height={Widget.displaySize.height} offline={result.offline}/>,{policy:'after',date:new Date(Date.now()+5*60000)});
});

