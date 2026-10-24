## Atualização 1.1.2 — botão de atualização

Botão pequeno de seta circular no canto inferior direito, usando AppIntent em segundo plano, sem solicitar abertura do app. O botão busca o snapshot mais recente no canal privado autorizado; não executa o coletor do computador. Foi corrigida a descoberta do executável GitHub CLI após desaparecer o atalho do WinGet, causa da publicação parada. O coletor voltou a publicar e a leitura privada confirmou 72% restantes em 24/10/2026; esse número não é fixado no código. O computador precisa continuar ligado e conectado para gerar novas observações.

Os widgets solicitam atualização após 1 minuto por padrão. O campo Parâmetro não altera a frequência. Codex/Popular permitem selecionar 1, 5 ou 15 minutos nas preferências do projeto. O iOS decide quando executar; a solicitação de 1 minuto não garante execução nesse intervalo. O botão pede dados atuais disponíveis e recarrega mesmo em falhas, preservando caches. Não altera o código instalado.

Testes locais de intenções, consulta forçada, sucesso/falha e geometria aprovados. Toque, renderização e execução nativa desta versão no iPhone/iPad ainda precisam de confirmação. Atualize o mesmo projeto pelo Git, preservando dados, permissões e pareamento.

# Codex 1.1.1

Distribuição: mesmo projeto, branch `scripting`. Atualize pelo vínculo remoto sem
apagar o projeto. O widget mantém fundo, cabeçalho, três tarefas e destinos diretos.
No app, a lista mostra todas as conversas locais não arquivadas disponíveis na captura, incluindo as sem título, com filtros,
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
O Agendador reutiliza a sessão GitHub já autorizada por uma cópia local protegida
por DPAPI e ACL do usuário em `work/private-runtime/github-token.dpapi`.
Nenhum token de nuvem novo é criado. O segredo só vai no ambiente do processo `gh`,
nunca no Git, backup, argumentos ou logs. Reexecute o instalador após trocar a sessão.

Alertas locais são opcionais e verificados nas execuções do script após ativação
no app. A primeira leitura estabelece a base, sem disparar pendências antigas.
Para push independente da execução do widget, registre o iPhone em Ferramentas →
Remote Push e crie uma chave de assinatura **send-only**. No Windows, execute
`powershell -NoProfile -File scripts/configure-push.ps1` e digite-a na entrada
oculta; nunca cole no Git/chat. DPAPI protege o arquivo no diretório privado indicado
em `work/scripting-runtime.json`. Toda a pasta `work/` é ignorada pelo Git e pelo backup.
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

A coleta percorre todas as páginas, remove duplicatas e subagentes. Até 1.000 conversas e 900 KB são limites de segurança: se excedidos, a coleta falha e preserva a última captura, sem cortar a lista. A tela mostra a lista completa; o widget mantém as três linhas aprovadas. Esta fonte local não comprova a presença de todas as conversas ChatGPT ou de outras máquinas.
