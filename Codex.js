// Scriptable — Codex. Código e dados vêm do GitHub privado.
const VERSION = '2026.10.21.1';
const CODEX_WIDGET_ID = 'scriptable-codex-widget';
const SETTINGS = {
  api: 'https://api.github.com/repos/Sagittaryuz/scriptable-codex-widget/contents/data/tasks.json?ref=main',
  key: 'codex-github-read-token', cache: 'codex-tasks-last-good.json', refreshMinutes: 5
};
const BACKGROUND = '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';
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
