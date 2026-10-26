# Registro do projeto

## Pergunta - Scripting 1.6.1 - 26/10/2026

`input` exibe a cápsula amarela existente com texto `Pergunta`; a lista usa
`Pergunta aguardando sua resposta`. Fontes, margens, links e demais estados
preservados. Schema 2 continua com `Task.state='input'`, `observedAt` e `origin`;
nenhum campo novo ou migração de Storage/Keychain/pareamento.

O produtor local só emite `input` para `status.type='active'` com
`activeFlags` contendo `waitingOnUserInput`; `waitingOnApproval` prevalece.
Cada coleta substitui a observação: sem a flag, não conserva `input`.
Idle, interrupted, completed, paused, blocked, unknown e pontuação no título
não confirmam pergunta. Após 15 minutos, a apresentação é `Antigo`, sem
rejuvenescer a data. Falha de coleta conserva o cache e sua data original.

Cobertura: App Server stdio separado, metadados e último turno com
`itemsView:'notLoaded'`; não lê perguntas em mensagens finais nem acompanha
automaticamente o runtime desktop. O contrato aceita `origin='ChatGPT'` e
`state='input'` em uma fonte local explícita, mas o coletor atual não fornece
esse sinal para conversas gerais do ChatGPT. O merge aceita tarefas ChatGPT
somente da fonte local e tarefas Cloud somente da fonte cloud. A ausência de
fonte confiável para ChatGPT permanece uma limitação; suporte de schema não
comprova coleta. Sem novos tokens, scraping, serviços, notificações ou coleta.
Dados pessoais continuam exclusivamente no Git privado existente.

Regressão em `scripts/test-question-state.cjs`, árvores JSX reais compiladas
com dados sintéticos em `validation/question-trees-1.6.1.json`: simulação,
sem renderização iOS ou teste físico. Atualizar o mesmo projeto pelo Git ou
pacote da release; rollback em `scripting-v1.6.0`.

## Scripting Pro — 1.1.0

Ampliação aprovada em 23/10/2026: preservar widget e acrescentar lista/filtros,
assistente, controles, alertas, painel Home e arquivos. Conteúdo pessoal novo em
`Sagittaryuz/codex-widget-private-data`, privado; canal público sem tarefas/limites.
Autenticação no iPhone pela API GitHub nativa, sem acesso do JS ao token. Coletor
local com intervalo de 60 segundos; push send-only opcional com DPAPI no Windows.
Sem novos serviços pagos. Detalhes e limites em `scripting/PRO.md` e `PLANS.md`.
Solicitação de atualização ao iOS em 1 minuto não é garantia de frequência.
Testes locais aprovados; validação nativa e ativação do push permanecem pendentes.

## Scripting — 23/10/2026

Implementação incremental iniciada na branch `feat/scripting`, com distribuição
na branch `scripting` do Git público existente. Fonte nativa em
`scripting/scripts/Codex`, com limite restante acima e até três tarefas abaixo
em qualquer tamanho. Referência escolhida: widget Popular fornecido pelo
usuário. A versão Scriptable/Glance foi preservada. Dados mínimos em branch
`widget-data`, sem mensagens, caminhos ou credenciais.

Na versão 1.0.4, margens, tipografia, divisórias e fundo foram alinhados ao
Popular Scripting no commit `d24c9a2b153fc8b7b9733bf123e10382bcd58abd`.
O fundo embutido e a referência local têm o mesmo SHA-256
`5d0fc7f05533af6534525cf8f86484028614a01587b717fa7d99836b9c00c094`.
O cabeçalho usa `chatgpt://` para abrir o aplicativo; as linhas conservam URLs
HTTPS específicas para cada conversa.

Na versão 1.0.5, os três tamanhos passaram a mostrar no máximo três tarefas.
O bloco usa margens laterais regulares, linhas uniformes e altura máxima no
widget grande. O rodapé `Hist. local · agora` foi removido. Cada linha continua
com destino próprio e ganhou uma seta de navegação. O ícone ao lado de “Codex”
é o artwork sem alteração da listagem oficial do ChatGPT na App Store brasileira,
SHA-256 `b34849bce75639449105eaad405e055ce8553129297ddc7c39e530252f79174e`.

Na versão 1.0.7, os toques nas tarefas usam os caminhos universais publicados
pelo ChatGPT no iOS: `/codex/tasks/{id}` para tarefas locais/remotas e
`/codex/cloud/tasks/{id}` para tarefas Codex Cloud. A versão 1.0.6 reconstruiu
o cabeçalho conforme a nova referência:
símbolo Codex, nome, janela, percentual grande, barra azul e reinício. O símbolo
monocromático deriva do ativo `codex-app-ga-logo-3e5209898ca3.png` do aplicativo
oficial instalado, versão `OpenAI.Codex_26.1016.8622.0`, com contorno e terminal
preservados. O antigo artwork do ChatGPT foi removido.

Na versão 1.0.8, “Semanal” foi retirado do cabeçalho. Símbolo e nome ficam à
esquerda e o percentual restante, reduzido para caber, fica à direita. A cor do
percentual e da barra segue quatro faixas: verde a partir de 70%, azul a partir
de 40%, âmbar a partir de 20% e vermelho abaixo disso. O cabeçalho menor libera
altura para linhas de tarefa maiores e distribuídas igualmente.

Na versão 1.0.9, cada tarefa mostra sua origem logo abaixo do título. ChatGPT e
Codex Cloud recebem rótulos próprios; tarefas locais recebem o nome real da
máquina coletora, e tarefas remotas usam o nome fornecido pela fonte ou
“Máquina remota” quando ele não existe. O hostname publicado é metadado mínimo
intencional; nenhum caminho, mensagem ou credencial foi acrescentado.

Coleta local: App Server via stdio e autenticação existente. Sem inferência.
O proxy do runtime desktop falhou com socket Windows 10050. Por isso, a coleta
contínua usa metadados do último turno local e NÃO afirma monitoramento completo
do runtime/Cloud. Snapshot de instalação veio das ferramentas do app; o modo
contínuo informa sua cobertura diferente. Estados expirados são identificados.
`completed` significa resposta pronta, sem alegar que o objetivo foi concluído.

19 verificações novas e sintaxe TS/TSX passaram, além de 62 checks existentes.
Validação nativa, tipos da versão instalada e Home Screen permanecem pendentes
até a conexão do iPhone. Evidência em `validation/scripting.json`. Instruções,
permissões, atualização Git e recuperação: `scripting/README.md`.

## Glance — 22/10/2026

Três widgets criados na conexão **Glance**, escolhida pelo usuário, com 4/4/8
tarefas e abertura geral `chatgpt://`. Identificadores reais em `glance/widgets.json`.
Os tamanhos, árvores e href foram conferidos com get_template e list_widgets;
os três ingests tiveram aceitação e get_widget_status com hasState e lastSyncAt.
24 verificações locais do gerador/bindings passaram. O fundo é uma adaptação nativa
de duas cores do Popular; não é o PNG original. O app iOS ainda precisa ser
conferido quanto ao visual e ao toque.

Usuário autorizou atualização automática a cada hora. Automação Codex criada
e ativa: `atualizar-widgets-codex-no-glance`. A primeira execução agendada ainda
não foi observada. Ela envia dados pelo plugin Glance, sem chave de escrita,
sem alterar o Scriptable e sem criar novos widgets. Fonte e instruções continuam
no mesmo Git público; o Drive preserva a cópia com Git bundle.

- Conta/remoto: `Sagittaryuz/scriptable-codex-widget`, público, HTTPS, branch `main`.
- Repositório remoto criado e clonado antes da implementação.
- Plataforma: JavaScript nativo do Scriptable; sem backend e sem chave OpenAI.
- Fonte de tarefas: `list_threads` do app Codex, com coleta manual inicial real.
- A API `thread/list` existe no App Server, mas não foi tratada como fonte
  automaticamente equivalente à lista local + Cloud do app.
  [OpenAI Docs](https://learn.chatgpt.com/docs/app-server).
- O widget recebe snapshot mínimo por URLs públicas fixas do Git; código e dados
  possuem caches separados. Somente títulos/metadados autorizados são publicados.
- Fundo e carregador: procedência em `assets/ORIGEM.md`.
- Padrões: `Sagittaryuz/development-standards`, commit
  `722279eb8ec4bac318f8fa2ad50ac34b128e90dc`, GIT-FIRST 1.0.1 e WEBAPP-WORKFLOW 1.2.3.
- Publicação autorizada pelo pedido de hospedagem GitHub. Sem web app/deploy Vercel.
- Requisitos de tamanhos: small 4, medium 4, large 8; fundo Popular preservado.
- Limites: iOS controla refresh; snapshot não é uma assinatura em tempo real;
  nenhum teste nativo no iPhone realizado nesta sessão.
- A coleta recorrente depende da resposta à pergunta apresentada nesta conversa;
  até então, o fluxo de dados é manual e a data fica visível no widget.
