const fs=require('node:fs');
const input=fs.readFileSync('Codex.template.js','utf8');
const png=fs.readFileSync('assets/popular-background.png').toString('base64');
fs.writeFileSync('Codex.js',input.replace('__POPULAR_BACKGROUND_BASE64__',png));
console.log('Codex.js gerado; fundo incorporado, sem dependência de rede para imagem.');
