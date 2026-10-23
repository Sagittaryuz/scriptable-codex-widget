# Registro do projeto

## Scripting — 23/10/2026

Implementação incremental na branch `feat/scripting`, usando o Git privado
existente. Fonte nativa em `scripting/scripts/Codex`, com limite restante acima,
lista abaixo e 2/4/8 tarefas. Referência escolhida: widget Popular fornecido pelo
usuário. A versão Scriptable/Glance foi preservada. Dados mínimos em branch
`widget-data`, sem mensagens, caminhos ou credenciais.

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
no mesmo Git privado; o Drive preserva a cópia com Git bundle.

- Conta/remoto: `Sagittaryuz/scriptable-codex-widget`, privado, HTTPS, branch `main`.
- Repositório remoto criado e clonado antes da implementação.
- Plataforma: JavaScript nativo do Scriptable; sem backend e sem chave OpenAI.
- Fonte de tarefas: `list_threads` do app Codex, com coleta manual inicial real.
- A API `thread/list` existe no App Server, mas não foi tratada como fonte
  automaticamente equivalente à lista local + Cloud do app.
  [OpenAI Docs](https://learn.chatgpt.com/docs/app-server).
- O widget recebe snapshot mínimo por Git autenticado; código e dados possuem
  caches separados. Somente títulos/metadados autorizados, em repositório privado.
- Fundo e carregador: procedência em `assets/ORIGEM.md`.
- Padrões: `Sagittaryuz/development-standards`, commit
  `722279eb8ec4bac318f8fa2ad50ac34b128e90dc`, GIT-FIRST 1.0.1 e WEBAPP-WORKFLOW 1.2.3.
- Publicação autorizada pelo pedido de hospedagem GitHub. Sem web app/deploy Vercel.
- Requisitos de tamanhos: small 4, medium 4, large 8; fundo Popular preservado.
- Limites: iOS controla refresh; snapshot não é uma assinatura em tempo real;
  nenhum teste nativo no iPhone realizado nesta sessão.
- A coleta recorrente depende da resposta à pergunta apresentada nesta conversa;
  até então, o fluxo de dados é manual e a data fica visível no widget.
