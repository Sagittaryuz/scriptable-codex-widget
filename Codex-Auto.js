// Cole este carregador no Scriptable e selecione-o no widget.
// Executa Codex.js público de main, sem credenciais.
// Carregador 1.5: URL fixa validada e última versão funcional preservada.
const AUTO = {
  api: 'https://raw.githubusercontent.com/Sagittaryuz/scriptable-codex-widget/main/Codex.js',
  cache: 'codex-github-last-good.js'
};

const AUTO_EXPECTED_API = 'https://raw.githubusercontent.com/Sagittaryuz/scriptable-codex-widget/main/Codex.js';
function codexCodeEndpoint(raw) {
  const text=typeof raw==='string'?raw.trim():'';
  const link=text.match(/^\[[^\]\r\n]*\]\((https:\/\/[^\s)]+)\)$/);
  const candidate=link?link[1]:text;
  if(candidate!==AUTO_EXPECTED_API)throw Error('Endereço de atualização inválido. Use o arquivo oficial Codex-Auto.js.');
  return {url:AUTO_EXPECTED_API,normalized:raw!==candidate};
}

async function codexAuto() {
  console.log('Codex-Auto 1.5');
  const fm = FileManager.local();
  const path = fm.joinPath(fm.documentsDirectory(), AUTO.cache);
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  // Finaliza somente depois de salvar o código que terminou sem erro.
  const deferredScript = new Proxy(Script, { get(target, key) {
    if (key === 'complete') return () => {};
    if (key === 'setWidget') return widget => {widget.refreshAfterDate=new Date(Date.now()+5*60000);target.setWidget(widget);};
    const value = target[key];
    return typeof value === 'function' ? value.bind(target) : value;
  }});
  let executionMode='github';
  const receiptPath=fm.joinPath(fm.documentsDirectory(),'codex-auto-diagnostic.json');
  const receipt={loader:'1.5',attemptAt:Date.now(),mode:null,version:null,status:null,failure:null,apiNormalized:false};
  const saveReceipt=()=>{try{fm.writeString(receiptPath,JSON.stringify(receipt));}catch(_){} };
  saveReceipt();
  const execute = async text => {
    receipt.mode=executionMode;receipt.version=text.match(/const VERSION\s*=\s*['"]([^'"]+)/)?.[1]||'desconhecida';saveReceipt();
    await new AsyncFunction('Script','Request',text)(deferredScript,Request);
    receipt.completedAt=Date.now();saveReceipt();
  };
  let cached = null;
  try { if (fm.fileExists(path)) cached = fm.readString(path); } catch (_) {}
  let source = null;
  let failure = 'Não foi possível baixar a versão pública.';
  try {
    const endpoint=codexCodeEndpoint(AUTO.api);receipt.apiNormalized=endpoint.normalized;saveReceipt();
    if(endpoint.normalized)console.log('Codex-Auto 1.5: endereço normalizado para a URL oficial.');
    const request = new Request(endpoint.url);
    request.headers = { Accept: 'text/plain', 'Cache-Control': 'no-cache' };
    request.timeoutInterval = 3;
    const download=request.loadString();
    const text = typeof Timer==='undefined'?await download:await new Promise((resolve,reject)=>{
      const timer=Timer.schedule(4000,false,()=>reject(Error('GitHub: tempo de consulta excedido')));
      download.then(value=>{timer.invalidate();resolve(value);},error=>{timer.invalidate();reject(error);});
    });
    const status = request.response && request.response.statusCode;receipt.status=status;saveReceipt();
    if (status === 404) throw new Error('GitHub HTTP 404: arquivo público não encontrado.');
    if (status === 403) throw new Error('GitHub HTTP 403: consulta bloqueada. Tente mais tarde.');
    if (status !== 200) throw new Error('GitHub HTTP ' + status + ': não foi possível baixar o código.');
    if (!text.includes("const CODEX_WIDGET_ID = 'scriptable-codex-widget'") || text.length < 100 || text.length > 2000000 || !/const VERSION\s*=/.test(text) || !/await main\(\)/.test(text)) {
      throw new Error('O arquivo recebido não é o widget esperado.');
    }
    new AsyncFunction(text); // Rejeita erro de sintaxe antes de executar.
    source = text;
  } catch (error) {
    failure = String(error.message||error);receipt.failure=failure;saveReceipt();console.log('Atualização indisponível: '+failure);
  }
  if (source) {
    try {
      await execute(source);
    } catch (error) {
      console.log('A versão do GitHub falhou; tentando a última versão que funcionou.');
      failure = 'Falha ao executar o widget: ' + String(error.message||error);receipt.failure=failure;saveReceipt();
      console.log(failure);
      source = null;
    }
    if (source) {
      try { fm.writeString(path, source); } catch (_) { console.log('Não foi possível salvar a cópia local.'); }
      Script.complete();
      return;
    }
  }
  if (cached) {
    try { executionMode='offline-cache';await execute(cached);console.log('Codex '+receipt.version+' — código local; dados consultados separadamente; motivo: '+failure); Script.complete(); return; }
    catch (_) { console.log('A cópia local também falhou.'); }
  }
  const widget = new ListWidget();
  widget.backgroundColor = new Color('000000');
  const label = widget.addText(failure);
  label.textColor = Color.white();
  label.font = Font.systemFont(12);
  widget.refreshAfterDate = new Date(Date.now() + 5 * 60000);
  Script.setWidget(widget);
  if (!config.runsInWidget) {
    const diagnostic = new Alert();
    diagnostic.title = 'Codex — diagnóstico';
    diagnostic.message = failure + '\n\nA última versão funcional foi preservada, quando disponível.';
    diagnostic.addAction('OK');
    await diagnostic.presentAlert();
    await widget.presentSmall();
  }
  Script.complete();
}
await codexAuto();
