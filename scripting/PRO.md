# Codex 1.1.0

Distribuição: mesmo projeto, branch `scripting`. Atualize pelo vínculo remoto sem
apagar o projeto. O widget mantém fundo, cabeçalho, três tarefas e destinos diretos.
No app, a lista mostra todas as tarefas disponíveis na captura (até 20), com filtros,
data e cobertura. Não equivale à lista completa de todos os hosts do Codex.

## Dados privados

`Sagittaryuz/codex-widget-private-data`, privado, branch `main`,
`data/scripting.json`. O coletor publica ali tarefas e limites, confirma por releitura,
e mantém no canal público apenas um aviso sem tarefas nem limites. O código não
lê o token: usa `GitHub.getTextContent`, com autenticação do Keychain do Scripting.
No iPhone, configure GitHub com leitura de conteúdo desse repositório e use
**Conectar dados privados**. Permissão precisa ser concedida no app antes do widget.
Falhas mantêm o cache e suas datas. A reserva embarcada não contém dados pessoais.
Histórico público anterior não foi reescrito; a migração protege publicações futuras.

## Atualização, controles e avisos

Solicitação ao iOS: 1 minuto por padrão, opções 1/5/15. O iOS decide o intervalo real.
**Consultar Codex** na Central de Controle consulta o último snapshot e solicita
`Widget.reloadUserWidgets()`; não dispara o coletor do computador. O coletor tem
um intervalo de 60 segundos entre tentativas, sem sobreposição e sem inferência.

No Windows, após clone/pull do Git e Node 24+, execute
`powershell -NoProfile -File scripts/install-collector.ps1`. A tarefa
`CodexWidget-Scripting-Collector` inicia no logon. Status privado em
`work/scripting-collector-status.json`; computador ligado e sessão autenticada são
necessários. Parar/remover somente essa tarefa desativa a recorrência.
O instalador grava somente caminhos de executáveis em `work/scripting-runtime.json`
porque o PATH do Agendador pode ser diferente. Para atualizar essa instalação no
mesmo checkout, use `scripts/install-collector.ps1 -Update`; outro destino é recusado.

Alertas locais são opcionais e verificados nas execuções do script após ativação
no app. A primeira leitura estabelece a base, sem disparar pendências antigas.
Para push independente da execução do widget, registre o iPhone em Ferramentas →
Remote Push e crie uma chave de assinatura **send-only**. No Windows, execute
`powershell -NoProfile -File scripts/configure-push.ps1` e digite-a na entrada
oculta; nunca cole no Git/chat. DPAPI protege o arquivo em `%LOCALAPPDATA%/CodexWidget`.
O provedor recebe somente uma mensagem genérica e o destino da tarefa, sem título.
Sem essa configuração não há push remoto ativo. Envio aceito não comprova leitura.

## Assistente, painel e arquivos

Ferramenta **Consultar Codex** compartilha metadados somente após aprovação e toque.
**O que depende de mim?** usa IA local se disponível; caso contrário prepara uma
conversa sem envio automático. Pro não inclui créditos do provedor externo.

`home_screen_default_ui.tsx` cria o painel Agenda/Codex/Indicadores na aba Início.
Ele compartilha somente contagens e horários entre scripts no aparelho. A API Home
foi documentada no canal TestFlight; disponibilidade precisa ser validada na versão
instalada. Selecione qualquer um dos três projetos na aba Início.

Preferências podem ser exportadas/importadas em JSON e há seleção de pasta
autorizada. Tokens, snapshots e chaves de push não entram nesse arquivo.

## Validação e recuperação

Testes de estados/limites/links, privacidade pública, API privada/cache, transições,
retry/deduplicação, transporte de push simulado, sintaxe e hashes dos ativos.
Não foram confirmados: tipos da versão instalada, toques nativos, Home, permissões,
IA local, sincronização com o iPhone e recebimento real de notificações.

Incorpora a identificação de origem/máquina da versão 1.0.9, inclusive na lista e
no contexto do assistente. Rollback: tag `scripting-v1.0.9`, preservando armazenamento. O cliente antigo usa o
canal público agora vazio; prefira desativar somente funções Pro em vez de voltar
à publicação de dados pessoais. Git é fonte; Drive contém backup privado com bundle.
