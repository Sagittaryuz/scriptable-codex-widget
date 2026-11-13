const assert=require('node:assert/strict'),{buildSync}=require('esbuild'),vm=require('vm');
const m={exports:{}};vm.runInNewContext(buildSync({entryPoints:['scripting/scripts/Codex/sources.ts'],bundle:true,write:false,platform:'node',format:'cjs'}).outputFiles[0].text,{module:m,exports:m.exports,Date,Map,Set});
const base={schemaVersion:2,generatedAt:'2026-11-13T14:00:00Z',usageObservedAt:'2026-11-13T14:00:00Z',tasksObservedAt:'2026-11-13T14:00:00Z',coverage:'synthetic',windows:[]};
const task=(id,origin,updatedAt,state='ready')=>({id,origin,updatedAt,state,title:id,observedAt:base.generatedAt,detail:''});
const tasks=[task('old','Local','2026-11-12T14:00:00Z','approval'),task('work','Work','2026-11-13T13:58:00Z'),task('dot','Dots','2026-11-13T13:59:00Z'),task('gpt','ChatGPT','2026-11-13T13:50:00Z'),task('cloud','Cloud','2026-11-13T13:40:00Z')];
const result=m.exports.mergeSources({...base,tasks:tasks.slice(0,2)},{...base,tasks:tasks.slice(2)});
assert.equal(result.tasks.length,5);assert.equal(result.tasks.slice(0,2).map(t=>t.id).join(','),'dot,work');
assert.equal(m.exports.recentTasks([task('future','Local','2027-01-01T00:00:00Z'),...tasks])[0].id,'dot');
console.log('PASS all-source merge and real activity ordering; future dates cannot lead.');
