// Utilitário de construção: referências já obtidas do Git autenticado.
// Obtenha Popular.js e Popular-Auto.js pelo gh api no commit de assets/ORIGEM.md
// e salve-os em TEMP/codex-widget-popular-reference.js e TEMP/codex-popular-loader.js.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const popular=fs.readFileSync(path.join(process.env.TEMP,'codex-widget-popular-reference.js'),'utf8');
const match=popular.match(/"widget-background-v8"\s*:\s*"([A-Za-z0-9+/=]+)"/);
if(!match)throw Error('Imagem do Popular não encontrada.');
fs.mkdirSync('assets',{recursive:true});fs.writeFileSync('assets/popular-background.png',Buffer.from(match[1],'base64'));
let loader=fs.readFileSync(path.join(process.env.TEMP,'codex-popular-loader.js'),'utf8').replaceAll('scriptable-popular-widget','scriptable-codex-widget').replaceAll('Popular','Codex').replaceAll('popular','codex');
loader=loader.replace("executionMode==='offline-cache'?offlineRequest:Request",'Request');
loader=loader.replace(/  const offlineRequest=class \{[\s\S]*?\n  \};\r?\n/,'');
loader=loader.replace('if (text.length < 100',`if (!text.includes("const CODEX_WIDGET_ID = 'scriptable-codex-widget'") || text.length < 100`);
loader=loader.replace('cópia local offline','código local; dados consultados separadamente');
fs.writeFileSync('Codex-Auto.js',loader);
console.log('Fundo original SHA-256: '+crypto.createHash('sha256').update(Buffer.from(match[1],'base64')).digest('hex'));
