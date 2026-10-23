// One-shot read-only transport audit. Never prints response bodies or credentials.
const fs = require('node:fs');
async function main() {
  const auth = JSON.parse(process.env.CODEX_PROBE_AUTH || '{}');
  if (!auth.token) throw new Error('missing_auth');
  const results = [];
  async function probe(label, path, rpc, summarize) {
    try {
      const r = await fetch('https://chatgpt.com' + path, {
        method: rpc ? 'POST' : 'GET', redirect: 'error',
        headers: { Authorization: 'Bearer ' + auth.token,
          'ChatGPT-Account-Id': auth.accountId || '', 'Content-Type': 'application/json' },
        body: rpc ? JSON.stringify(rpc) : undefined,
        signal: AbortSignal.timeout(20000)
      });
      const data = await r.json().catch(() => null);
      results.push({ label, http: r.status, challenge: r.headers.get('cf-mitigated') === 'challenge',
        ...(r.ok && data ? summarize(data) : {}) });
    } catch (e) { results.push({ label, error: e.name }); }
  }
  const call = (name, args) => ({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } });
  const unwrap = j => { if(j.result?.structuredContent) return j.result.structuredContent;
    try{return JSON.parse(j.result?.content?.find(c=>c.type==='text')?.text)}catch{return {}} };
  await probe('quota', '/backend-api/wham/usage', null, d=>({hasRateLimit:!!d.rate_limit}));
  await probe('current_codex_list', '/backend-api/wham/apps', call('codex tasks_list_tasks',{limit:3}), j=>{
    const d=unwrap(j);return {rpcError:!!j.error,toolError:!!j.result?.isError,count:d.tasks?.length??null,hasNext:!!d.nextCursor};});
  await probe('current_codex_read', '/backend-api/wham/apps', call('codex tasks_read_task',{
    task_id:'01a16427-5b79-74c3-b764-d0209a89a000',turn_limit:1}),j=>{
      const d=unwrap(j);return {rpcError:!!j.error,toolError:!!j.result?.isError,
        expectedTask:d.task?.id==='01a16427-5b79-74c3-b764-d0209a89a000',
        statuses:d.turns?.map(t=>['completed','inProgress','failed','interrupted'].includes(t.status)?t.status:'other')};});
  await probe('chatgpt_list','/backend-api/conversations?offset=0&limit=1&order=updated',null,d=>({hasItems:Array.isArray(d.items)}));
  await probe('chatgpt_read','/backend-api/conversations/6ab9552f-a2e4-83e9-9efd-5b116550fd60?num_turns=1',null,d=>({jsonReceived:!!d}));
  const report={at:new Date().toISOString(),runner:process.env.GITHUB_ACTIONS==='true'?'github-hosted':'local-node',
    commit:process.env.GITHUB_SHA||null,results};
  console.log(JSON.stringify(report,null,2));
  if(process.env.PROBE_OUTPUT) fs.writeFileSync(process.env.PROBE_OUTPUT,JSON.stringify(report,null,2));
}
main().catch(()=>{console.error('Probe could not initialize; no secret or response body logged.');process.exitCode=1});
