const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict'),{buildSync,transformSync}=require('esbuild');
const root=path.resolve(__dirname,'../scripting/scripts/Codex');
function code(file,contents){return buildSync({...contents?{stdin:{contents,loader:'tsx',resolveDir:root}}:{entryPoints:[path.join(root,file)]},bundle:true,write:false,platform:'node',format:'cjs',external:['scripting'],jsxFactory:'createElement'}).outputFiles[0].text}
function evaluate(source,sdk,extra={}){const m={exports:{}};vm.runInNewContext(source,{module:m,exports:m.exports,require:()=>sdk,Date,Set,Map,JSON,URL,setTimeout,clearTimeout,console:{log:()=>{}},...extra});return m.exports}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const nodes=(n,type)=>!n||typeof n!=='object'?[]:[...(n.type===type?[n]:[]),...(n.children||[]).flatMap(c=>nodes(c,type))];
const {HEADER_DESTINATIONS,widgetTapURL,widgetTapChannel}=evaluate(code('shortcuts.ts'),{});
(async()=>{
 for(const input of [null,undefined,[],{},'chatgpt',{codexWidgetTap:['chatgpt']},{codexWidgetTap:'constructor'},{codexWidgetTap:'__proto__'},{codexWidgetTap:'https://evil.test'},Object.create({codexWidgetTap:'chatgpt'})])assert.equal(widgetTapChannel(input),null);
 const events=[],sdk={Widget:{reloadAll:()=>events.push('reload')},Safari:{openURL:async url=>{events.push(url);return true}}};
 const tapDeps={scripting:sdk,'./shortcuts':{HEADER_DESTINATIONS,widgetTapChannel},'./tap-refresh':{refreshForTap:async()=>events.push('snapshot')}};
 const tapModule={exports:{}};vm.runInNewContext(transformSync(fs.readFileSync(path.join(root,'widget-tap.ts'),'utf8'),{loader:'ts',format:'cjs'}).code,{module:tapModule,exports:tapModule.exports,require:name=>tapDeps[name]});const routes=tapModule.exports;
 for(const [key,url]of Object.entries(HEADER_DESTINATIONS)){events.length=0;assert.equal(await routes.openWidgetDestination({codexWidgetTap:key,url:'https://evil.test'}),true);assert.deepEqual(events,['snapshot','reload',url]);assert.equal(widgetTapChannel({codexWidgetTap:key}),key);const parsed=new URL(widgetTapURL(key,'Codex Teste/Ç'));assert.equal(decodeURIComponent(parsed.pathname.slice(1)),'Codex Teste/Ç');assert.equal(parsed.searchParams.get('codexWidgetTap'),key);assert(!parsed.searchParams.has('url'))}
 events.length=0;await routes.openWidgetDestination({codexWidgetTap:'invalid'});assert.equal(events.length,0);
 let resolveOpen;sdk.Safari.openURL=url=>{events.push(url);return new Promise(resolve=>{resolveOpen=resolve})};
 let resolveSnapshot;tapDeps['./tap-refresh'].refreshForTap=()=>{events.push('snapshot');return new Promise(resolve=>{resolveSnapshot=resolve})};
 const pending=routes.openWidgetDestination({codexWidgetTap:'chatgpt'});assert.deepEqual(events,['snapshot'],'Snapshot is awaited before reload/navigation');resolveSnapshot();await tick();assert.deepEqual(events,['snapshot','reload',HEADER_DESTINATIONS.chatgpt]);resolveOpen(true);await pending;
 tapDeps['./tap-refresh'].refreshForTap=async()=>events.push('snapshot');
 for(const reloadThrows of [false,true])for(const openFails of [false,true]){events.length=0;sdk.Widget.reloadAll=()=>{events.push('reload');if(reloadThrows)throw Error('native reload unavailable')};sdk.Safari.openURL=async url=>{events.push(url);if(openFails)throw Error('destination unavailable');return false};assert.equal(await routes.openWidgetDestination({codexWidgetTap:'codex'}),true);assert.deepEqual(events,['snapshot','reload',HEADER_DESTINATIONS.codex],'Snapshot/reload failures cannot prevent exactly one navigation attempt')}
 sdk.Widget.reloadAll=()=>events.push('reload');sdk.Safari.openURL=async url=>{events.push(url);return true};events.length=0;
 tapDeps['./tap-refresh'].refreshForTap=async()=>{events.push('snapshot');throw Error('cache unavailable')};await routes.openWidgetDestination({codexWidgetTap:'chatgpt'});assert.deepEqual(events,['snapshot','reload',HEADER_DESTINATIONS.chatgpt]);tapDeps['./tap-refresh'].refreshForTap=async()=>events.push('snapshot');events.length=0;
 await routes.resumeWidgetTap({queryParameters:{codexWidgetTap:'voice'}});await routes.resumeWidgetTap({queryParameters:{codexWidgetTap:'voice'}});assert.deepEqual(events,['snapshot','reload',HEADER_DESTINATIONS.voice,'snapshot','reload',HEADER_DESTINATIONS.voice],'Every repeated explicit tap requests once');
 events.length=0;await routes.resumeWidgetTap({queryParameters:null});await routes.resumeWidgetTap({queryParameters:{}});assert.deepEqual(events,[],'Ambient app resumes must not reopen links or reload recursively');
 await routes.resumeWidgetTap({widgetParameter:''});await routes.resumeWidgetTap({controlWidgetParameter:''});assert.deepEqual(events,['reload','reload']);
 const indexCode=code('index.tsx');
 function index(query){
  const calls=[];let resume,close;
  const native={
   Script:{name:'Codex',queryParameters:query,onResume:fn=>{resume=fn;return()=>calls.push('unregister')},exit:()=>calls.push('exit')},
   Widget:{reloadAll:()=>calls.push('reload'),preview:async()=>calls.push('preview')},
   Safari:{openURL:async url=>{calls.push(url);return true}},
   Navigation:{present:()=>{calls.push('present');return new Promise(resolve=>{close=resolve})}}
  };
  const sdk=new Proxy(native,{get:(o,k)=>o[k]??k});
  const now=new Date().toISOString(),sample={schemaVersion:2,generatedAt:now,usageObservedAt:now,tasksObservedAt:now,coverage:'Synthetic tap fixture',tasks:[],windows:[]},values=new Map([['codex-widget-snapshot-v2',sample]]);
  evaluate(indexCode,sdk,{createElement:(type,props,...children)=>({type,props,children}),Storage:{get:k=>values.get(k),set:(k,v)=>{values.set(k,v);return true}},Dialog:{alert:()=>{throw Error('No new confirmation dialog')}},GitHub:{isAvailable:()=>true,getTextContent:async()=>({text:JSON.stringify(sample)})}});
  return {calls,resume:details=>resume(details),close:()=>close?.()};
 }
 const launched=index({codexWidgetTap:'dots'});await tick();assert.deepEqual(launched.calls,['reload',HEADER_DESTINATIONS.dots,'unregister','exit']);
 const live=index({});await tick();assert.deepEqual(live.calls,['reload','present']);live.resume({queryParameters:{codexWidgetTap:'chatgpt'}});await tick();live.resume({queryParameters:{codexWidgetTap:'codex'}});await tick();assert.deepEqual(live.calls,['reload','present','reload',HEADER_DESTINATIONS.chatgpt,'reload',HEADER_DESTINATIONS.codex]);live.resume({queryParameters:null,widgetParameter:null});await tick();assert.equal(live.calls.length,6);live.close();await tick();assert.deepEqual(live.calls.slice(-2),['unregister','exit']);
 const preview=index({preview:'systemSmall'});await tick();assert.deepEqual(preview.calls,['preview','unregister','exit'],'Developer previews do not create a reload loop');
 // Existing task/control actions remain RefreshCodex; only the four Link URLs change.
 const {referenceLayout}=require('../scripting/scripts/Codex/content-layout.ts'),iso=new Date().toISOString(),snapshot={schemaVersion:2,generatedAt:iso,usageObservedAt:iso,tasksObservedAt:iso,coverage:'Synthetic tap test',windows:[],tasks:[]},nativeCalls=[];
 const visualSDK=new Proxy({Script:{name:'Codex Teste',createRunURLScheme:(name,q)=>{nativeCalls.push([name,q]);return widgetTapURL(q.codexWidgetTap,name)}}},{get:(o,k)=>o[k]??k});
 const createElement=(type,props,...children)=>typeof type==='function'?type({...props,children:children.flat(Infinity).filter(Boolean)}):({type,props:props||{},children:children.flat(Infinity).filter(Boolean)}),extra={createElement,UIImage:{fromBase64String:()=>({syntheticImage:true})}};
 const before=evaluate(code(null,cp.execFileSync('git',['show','5e1330c:scripting/scripts/Codex/header.tsx'],{encoding:'utf8'})),visualSDK,extra),after=evaluate(code('header.tsx'),visualSDK,extra),plain=x=>JSON.parse(JSON.stringify(x));
 for(const [family,w,h]of [['systemSmall',158,158],['systemSmall',158,170],['systemMedium',338,170],['systemLarge',338,360]]){const layout=referenceLayout(family,w,h),a=plain(before.ShortcutHeader({snapshot,layout})),b=plain(after.ShortcutHeader({snapshot,layout})),oldLinks=nodes(a,'Link'),newLinks=nodes(b,'Link');for(const [i,key]of Object.keys(HEADER_DESTINATIONS).entries()){assert.equal(oldLinks[i].props.url,HEADER_DESTINATIONS[key]);assert.equal(newLinks[i].props.url,widgetTapURL(key,'Codex Teste'));oldLinks[i].props.url=newLinks[i].props.url}assert.deepEqual(a,b,'All visual/native node properties remain identical except four routed URLs')}
 assert.equal(nativeCalls.length,16,'Use the real Script.createRunURLScheme factory for all four shortcuts in each size');
 const providerEvents=[],values=new Map([['codex-ready-alerts',false],['codex-alerts',false]]);let queries=0;
 const providerSDK=new Proxy({AppIntentManager:{register:d=>()=>({name:d.name})},AppIntentProtocol:{AppIntent:0},Widget:{family:'systemSmall',displaySize:{width:158,height:158},reloadAll:()=>providerEvents.push('reload'),present:()=>providerEvents.push('present')}},{get:(o,k)=>o[k]??k});
 evaluate(code('widget.tsx'),providerSDK,{createElement:(type,props,...children)=>({type,props,children}),Storage:{get:k=>values.get(k),set:(k,v)=>{values.set(k,v);return true}},GitHub:{isAvailable:()=>true,getTextContent:async()=>{queries++;return{text:JSON.stringify(snapshot)}}}});await tick();assert.equal(queries,2,'Only the existing local/cloud snapshot reads occur in the provider');assert.deepEqual(providerEvents,['present'],'Provider rendering must never queue its own reload');
 console.log('PASS tap refresh: bounded snapshot completion before reload and exactly one navigation, same four destinations, allowlisted routing, live Script.onResume, repeat taps, failures, preview/no loops, unchanged visual nodes in four sizes, existing provider reads only. Real iOS handoff/timing pending.');
})().catch(error=>{console.error(error);process.exitCode=1});
