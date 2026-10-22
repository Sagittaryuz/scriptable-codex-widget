const assert=require('node:assert/strict'),fs=require('node:fs');
const {makeTree,makeContent,SIZES,CHATGPT_URL}=require('./build.cjs');
const snapshot=JSON.parse(fs.readFileSync('glance/generated/snapshot.json','utf8'));
const nodes=n=>[n,...(n.children||[]).flatMap(nodes)];
let checks=0;
for(const size of Object.keys(SIZES)){
 const tree=makeTree(size),all=nodes(tree),content=makeContent(snapshot,size);
 const bindings=all.flatMap(n=>Object.values(n).flatMap(v=>typeof v==='string'?[...v.matchAll(/\{\{(\w+)\}\}/g)].map(m=>m[1]):[]));
 assert.deepEqual(Object.keys(content).sort(),[...new Set(bindings)].sort());checks++;
 assert.equal(all.filter(n=>/^title_\d+$/.test(n.id)).length,SIZES[size].count);checks++;
 assert.equal(new Set(all.map(n=>n.id)).size,all.length);checks++;
 assert.ok(all.length<=80);checks++;
 assert.equal(all.filter(n=>n.href).length,1);assert.equal(tree.href,CHATGPT_URL);assert.equal(CHATGPT_URL,'chatgpt://');checks++;
 assert.ok(!all.some(n=>['chart','grid','table'].includes(n.type)||n.action||n.views));checks++;
 assert.ok(all.filter(n=>n.type==='text').every(n=>n.style.maxLines===1));checks++;
 assert.equal(content.collected_at,snapshot.generatedAt);checks++;
}
console.log(checks+' verificacoes do Glance aprovadas; teste nativo no iPhone pendente.');
