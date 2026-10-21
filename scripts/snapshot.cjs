function normalizeSnapshot(raw, now=new Date()) {
  if(!raw||!Array.isArray(raw.threads)||!Array.isArray(raw.pinnedThreads))throw Error('Entrada deve ser o JSON de list_threads.');
  if((raw.unavailableHosts||[]).length||(raw.unavailableSources||[]).length)throw Error('Fonte indisponível; preservando o snapshot anterior.');
  const seen=new Set();
  const tasks=[...raw.pinnedThreads,...raw.threads].filter(t=>t.kind==='codex'&&typeof t.title==='string'&&t.title.trim()).sort((a,b)=>b.updatedAt-a.updatedAt).filter(t=>{
    if(!/^[\w-]{1,100}$/.test(t.id)||!Number.isFinite(t.updatedAt)||seen.has(t.id))return false;seen.add(t.id);return true;
  }).slice(0,20).map(t=>({
    id:t.id,title:t.title.slice(0,500),updatedAt:t.updatedAt,
    origin:t.hostId==='durable'?'cloud':(!t.hostId||t.hostId==='local')?'local':'remote',
    hostLabel:t.hostId==='durable'?'Cloud':(!t.hostId||t.hostId==='local')?'Sagittaryuz':'Remoto',
    status:['active','idle','waiting','error'].includes(t.status)?t.status:'unknown'
  }));
  return {schemaVersion:1,generatedAt:now.toISOString(),source:'Codex list_threads',tasks};
}
module.exports={normalizeSnapshot};
