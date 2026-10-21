# Registro do projeto

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
