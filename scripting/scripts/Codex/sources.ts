import { Snapshot, validateSnapshot } from './model'
export function mergeSources(local:Snapshot|null,cloud:Snapshot|null):Snapshot{
 const sources=[local,cloud].filter(Boolean) as Snapshot[]
 if(!sources.length)throw Error('Nenhuma fonte disponível.')
 const newest=(field:'generatedAt'|'usageObservedAt'|'tasksObservedAt')=>sources.reduce((a,b)=>Date.parse(a[field])>=Date.parse(b[field])?a:b)
 const usage=sources.filter(s=>s.windows.length).sort((a,b)=>Date.parse(b.usageObservedAt)-Date.parse(a.usageObservedAt))[0]??newest('usageObservedAt')
 const tasks=new Map((local?.tasks??[]).filter(t=>t.origin!=='Cloud').map(t=>[t.id,t]))
 for(const task of cloud?.tasks??[])if(task.origin==='Cloud')tasks.set(task.id,task)
 return validateSnapshot({schemaVersion:2,generatedAt:newest('generatedAt').generatedAt,usageObservedAt:usage.usageObservedAt,tasksObservedAt:newest('tasksObservedAt').tasksObservedAt,
  coverage:cloud?'Nuvem independente · locais: último registro do computador':'Locais: último registro · nuvem indisponível',windows:usage.windows,tasks:[...tasks.values()].sort((a,b)=>Date.parse(b.observedAt)-Date.parse(a.observedAt))})
}
