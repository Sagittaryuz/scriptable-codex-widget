// Read-only Codex App Server client. No inference, login or approval handling.
const {spawn}=require('node:child_process');
const {createInterface}=require('node:readline');

class CodexReader {
  constructor({command='codex',args=['app-server','proxy'],timeout=20000,onTokenUsage}={}) {
    this.next=1;this.pending=new Map();this.timeout=timeout;this.stderr='';
    this.child=spawn(command,args,{stdio:['pipe','pipe','pipe'],windowsHide:true});
    this.child.stderr.on('data',chunk=>{this.stderr=(this.stderr+chunk).slice(-2000)});
    this.lines=createInterface({input:this.child.stdout});
    this.lines.on('line',line=>{
      let message;try{message=JSON.parse(line)}catch{return}
      if(message.id==null){
        if(message.method==='thread/tokenUsage/updated'&&typeof onTokenUsage==='function')onTokenUsage(message.params);
        return;
      }
      const p=this.pending.get(message.id);if(!p)return;
      clearTimeout(p.timer);this.pending.delete(message.id);
      if(message.error)p.reject(Error(`RPC ${p.method}: ${message.error.message}`));
      else p.resolve(message.result);
    });
    const fail=()=>{for(const p of this.pending.values()){clearTimeout(p.timer);p.reject(Error('App Server indisponível.'))}this.pending.clear()};
    this.child.on('error',fail);this.child.on('exit',fail);
  }
  request(method,params={}) {
    if(!['initialize','account/rateLimits/read','thread/list','thread/turns/list'].includes(method))throw Error('Método fora do escopo somente leitura.');
    return new Promise((resolve,reject)=>{
      const id=this.next++;
      const timer=setTimeout(()=>{this.pending.delete(id);reject(Error(`Tempo esgotado: ${method}`))},this.timeout);
      this.pending.set(id,{resolve,reject,timer,method});
      this.child.stdin.write(JSON.stringify({jsonrpc:'2.0',id,method,params})+'\n');
    });
  }
  async initialize(){await this.request('initialize',{clientInfo:{name:'codex_scripting_widget',title:'Codex Scripting Widget',version:'1.0.0'}});this.child.stdin.write('{"jsonrpc":"2.0","method":"initialized"}\n')}
  close(){this.child.stdin.end();this.lines.close();this.child.kill()}
}
module.exports={CodexReader};
if(require.main===module)(async()=>{
 const reader=new CodexReader();
 try{
   await reader.initialize();
   const [usage,threads]=await Promise.all([reader.request('account/rateLimits/read'),reader.request('thread/list',{limit:8,sortKey:'updated_at'})]);
   console.log(JSON.stringify({connected:true,limits:Object.values(usage.rateLimitsByLimitId||{codex:usage.rateLimits}).map(x=>({id:x.limitId,primary:x.primary,secondary:x.secondary})),threads:threads.data.map(t=>({id:t.id,title:t.name,status:t.status})),hasMore:!!threads.nextCursor},null,2));
 }catch(error){console.error(error.message);process.exitCode=1}finally{reader.close()}
})();
