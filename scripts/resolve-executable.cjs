// Resolve again after updates; an absent configured shortcut must not pin a dead path.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
function resolveExecutable(bin,runtime={},options={}){
 const disk=options.fs||fs,home=options.home||os.homedir(),platform=options.platform||process.platform;
 const configured=runtime.executables?.[bin];
 if(configured&&disk.existsSync(configured))return configured;
 if(platform==='win32'){
  const directory=bin==='codex'?path.join(home,'AppData/Local/OpenAI/Codex/bin'):
   bin==='gh'?path.join(home,'AppData/Local/Microsoft/WinGet/Packages'):null;
  if(directory&&disk.existsSync(directory)){
   const candidates=disk.readdirSync(directory).filter(name=>bin!=='gh'||name.startsWith('GitHub.cli_')).map(name=>
    bin==='codex'?path.join(directory,name,'codex.exe'):path.join(directory,name,'bin/gh.exe')).filter(file=>disk.existsSync(file));
   candidates.sort((a,b)=>disk.statSync(b).mtimeMs-disk.statSync(a).mtimeMs);
   if(candidates.length)return candidates[0];
  }
 }
 return bin;
}
module.exports={resolveExecutable};
