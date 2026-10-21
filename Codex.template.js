// Scriptable — Codex. Código e dados vêm do GitHub privado.
const VERSION = '2026.10.21.1';
const CODEX_WIDGET_ID = 'scriptable-codex-widget';
const SETTINGS = {
  api: 'https://api.github.com/repos/Sagittaryuz/scriptable-codex-widget/contents/data/tasks.json?ref=main',
  key: 'codex-github-read-token', cache: 'codex-tasks-last-good.json', refreshMinutes: 5
};
const BACKGROUND = '__POPULAR_BACKGROUND_BASE64__';
const LAYOUTS = {
  small: { count: 4, padding: 9, title: 11, meta: 8, header: 12, gap: 3 },
  medium: { count: 4, padding: 9, title: 12.5, meta: 8, header: 12, gap: 2 },
  large: { count: 8, padding: 12, title: 14, meta: 10, header: 14, gap: 3 }
};

function validateSnapshot(data) {
  if (!data || data.schemaVersion !== 1 || !Number.isFinite(Date.parse(data.generatedAt)) || !Array.isArray(data.tasks)) throw Error('Lista de tarefas inválida.');
  if (data.tasks.length > 50) throw Error('Lista de tarefas excedeu o limite.');
  for (const t of data.tasks) {
    if (!t || typeof t.id !== 'string' || !/^[\w-]{1,100}$/.test(t.id) || typeof t.title !== 'string' || !t.title.trim() || t.title.length > 500 || !Number.isFinite(t.updatedAt) || !['local','cloud','remote'].includes(t.origin) || typeof t.hostLabel !== 'string' || t.hostLabel.length > 80 || !['active','idle','waiting','error','unknown'].includes(t.status)) throw Error('Registro de tarefa inválido.');
  }
  return data;
}
function recentTasks(data, count) {
  const seen = new Set();
  return data.tasks.slice().sort((a,b) => b.updatedAt - a.updatedAt).filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; }).slice(0,count);
}
function refreshURL() {
  return 'scriptable:///run?scriptName=' + encodeURIComponent(Script.name()) + '&codex_refresh=1';
}
function taskURL(task) {
  // URL local do Codex desktop. No iPhone, usa a página web de tarefas.
  // Abertura direta da tarefa desktop no iOS não foi confirmada.
  return 'https://chatgpt.com/codex';
}
async function loadTasks() {
  const fm = FileManager.local(), path = fm.joinPath(fm.documentsDirectory(),SETTINGS.cache);
  let cached;
  try { if (fm.fileExists(path)) cached=validateSnapshot(JSON.parse(fm.readString(path))); } catch (_) {}
  try {
    if (!Keychain.contains(SETTINGS.key)) throw Error('Abra Codex-Auto no app e configure o token.');
    const req = new Request(SETTINGS.api);
    req.headers = { Accept: 'application/vnd.github.raw+json', Authorization: 'Bearer '+Keychain.get(SETTINGS.key), 'Cache-Control':'no-cache', 'User-Agent':'Codex-Scriptable' };
    req.timeoutInterval = 4;
    const raw = await req.loadString();
    const status=req.response && req.response.statusCode;
    if (status !== 200) throw Error('Dados: GitHub HTTP '+status+'.');
    if(raw.length>250000)throw Error('Arquivo de dados excedeu o limite.');
    const data=validateSnapshot(JSON.parse(raw));
    // Impede uma resposta atrasada de substituir dados mais novos.
    if(cached && Date.parse(cached.generatedAt)>Date.parse(data.generatedAt))return {data:cached,offline:false,older:true};
    try { fm.writeString(path,JSON.stringify(data)); } catch (_) {}
    return {data,offline:false};
  } catch (_) {
    if(cached)return {data:cached,offline:true};
    return {data:null,offline:true};
  }
}
function text(stack,value,size,color='FFFFFF') {
  const node=stack.addText(value);node.font=Font.systemFont(size);node.textColor=new Color(color);node.lineLimit=1;node.minimumScaleFactor=.85;return node;
}
function icon(stack,name,size,color='FFFFFF') {
  const symbol=SFSymbol.named(name);symbol.applyFont(Font.systemFont(size));
  const item=stack.addImage(symbol.image);item.imageSize=new Size(size,size);item.tintColor=new Color(color);return item;
}
function makeWidget(result,family) {
  const layout=LAYOUTS[family]||LAYOUTS.large, w=new ListWidget();
  w.setPadding(layout.padding,layout.padding,layout.padding,layout.padding);w.spacing=0;
  w.backgroundColor=new Color('1E1E1E');w.backgroundImage=Image.fromData(Data.fromBase64String(BACKGROUND));
  w.url=refreshURL();w.refreshAfterDate=new Date(Date.now()+SETTINGS.refreshMinutes*60000);
  const header=w.addStack();header.centerAlignContent();icon(header,'terminal',layout.header);header.addSpacer(5);text(header,'Codex',layout.header);header.addSpacer();
  const tasks=result.data ? recentTasks(result.data,layout.count):[];
  w.addSpacer(layout.gap+1);
  for(let i=0;i<tasks.length;i++) {
    const task=tasks[i],row=w.addStack();row.layoutVertically();row.spacing=1;
    if(family!=='small') row.url=taskURL(task);
    const line=row.addStack();line.centerAlignContent();text(line,task.title,layout.title);line.addSpacer(2);
    if(task.status==='active')icon(line,'arrow.triangle.2.circlepath',layout.meta,'C6C6CB');
    else if(task.status==='waiting')icon(line,'pause.circle',layout.meta,'C6C6CB');
    else if(task.status==='error')icon(line,'exclamationmark.circle',layout.meta,'FFAD91');
    const meta=row.addStack();meta.centerAlignContent();icon(meta,task.origin==='cloud'?'cloud':task.origin==='remote'?'network':'laptopcomputer',layout.meta,'C6C6CB');meta.addSpacer(4);text(meta,task.hostLabel,layout.meta,'C6C6CB');
    if(i<tasks.length-1)w.addSpacer(layout.gap);
  }
  if(!tasks.length) {
    w.addSpacer();const label=w.addText(result.data?'Nenhuma tarefa recente.':'Sem dados. Execute Codex-Auto no app para configurar o acesso.');
    label.font=Font.systemFont(layout.title);label.textColor=Color.white();label.lineLimit=4;
  }
  w.addSpacer();
  const footer=w.addStack();footer.centerAlignContent();
  if(result.data) {
    const age=Date.now()-Date.parse(result.data.generatedAt),d=new Date(result.data.generatedAt);
    const clock=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
    const time=age>24*60*60000?String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+' '+clock:clock;
    const stale=age>30*60000;
    const label=(result.offline?'Offline · ':stale?'Desatualizado · ':'')+time;
    text(footer,label,7.5,stale?'FFCA9C':'AFAFB5');
  } else text(footer,'Abra o app para configurar',7.5,'AFAFB5');
  footer.addSpacer();icon(footer,'arrow.clockwise',8,'AFAFB5');footer.url=refreshURL();
  return w;
}
async function main() {
  const parameter=String(args.widgetParameter||'').trim().toLowerCase();
  let family=config.widgetFamily;
  if(!config.runsInWidget) {
    family=Object.prototype.hasOwnProperty.call(LAYOUTS,parameter)?parameter:'large';
    if(String(args.queryParameters?.codex_refresh||'')!=='1'&&!parameter) {
      const a=new Alert();a.title='Codex — visualizar';['2×2 · 4 tarefas','4×2 · 4 tarefas','4×4 · 8 tarefas'].forEach(v=>a.addAction(v));a.addCancelAction('Cancelar');
      const choice=await a.presentAlert();if(choice<0)return;family=['small','medium','large'][choice];
    }
  }
  const result=await loadTasks(),widget=makeWidget(result,family);
  Script.setWidget(widget);
  if(!config.runsInWidget)await widget[family==='small'?'presentSmall':family==='medium'?'presentMedium':'presentLarge']();
  Script.complete();
}
await main();
