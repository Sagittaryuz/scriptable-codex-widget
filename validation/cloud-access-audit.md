# Prova de acesso na nuvem — 23/10/2026

## Resultado

Um runner Ubuntu do GitHub Actions leu limites e tarefas atuais/duráveis do Codex diretamente do backend OpenAI. Não usou o aplicativo desktop, App Server local, túnel para o PC nem histórico local. Isso comprova o transporte independente para uma amostra existente, não cobertura completa, autenticação renovável ou streaming.

Execução: https://github.com/Sagittaryuz/scriptable-codex-widget/actions/runs/39950510039

Código executado: 49cc826533c0affc9ae0aed2516975c2930c16d9. Horário: 2026-10-23T12:03:50Z (09:03:50 em Brasília).

| Sondagem no runner | Resultado |
| --- | --- |
| GET /backend-api/wham/usage | HTTP 200; rate_limit presente |
| POST /backend-api/wham/apps, JSON-RPC tools/call, codex tasks_list_tasks | HTTP 200, sem erro RPC/ferramenta, 2 tarefas nessa página, paginação disponível |
| Mesmo transporte, codex tasks_read_task | HTTP 200; ID esperado confirmado; último turno completed |
| GET /backend-api/conversations?offset=0&limit=1&order=updated | HTTP 403; cf-mitigated: challenge |
| GET /backend-api/conversations/{id}?num_turns=1 | HTTP 403; cf-mitigated: challenge |

A tarefa usada foi Recuperar auditoria geográfica, previamente confirmada pelo conector. O resultado completed descreve o turno, não a conclusão do projeto. A resposta não foi salva: somente indicadores mínimos no log privado.

## Alternativas comparadas

- HTTPS direto em Node no Windows: tarefas atuais e limites também responderam 200. As rotas ChatGPT plural e singular /backend-api/conversation/{id} receberam desafio. Não foram realizados contornos de challenge nem cópia de cookies.
- Codex CLI cloud list/status: acesso confirmado a tarefa antiga task_e_..., mas a tarefa atual UUID retornou 404 Invalid task ID. São superfícies distintas; não usar CLI legado como inventário completo.
- Ferramentas internas desktop list_threads/read_thread: leem ChatGPT, tarefas locais, remotas e duráveis; não foram tratadas como API externa transplantável.
- Catálogo tools/list de /wham/apps: expõe o conector Codex Tasks (Internal/CCA), sem uma ferramenta equivalente de histórico geral do ChatGPT identificada. Pages e mensagens de serviços terceiros não equivalem a chats ChatGPT.
- Navegador autenticado hospedado: não testado; exige sessão interativa própria e pode enfrentar challenge. Não é descartado nem apresentado como API pronta.
- API pública de Conversations/Agents: documentação não estabelece importação dos chats existentes do consumidor. Não foi criada uma sessão nova como substituto do teste exigido.

## Autenticação e limites

O teste usou somente o access token OAuth existente e o identificador da conta, enviados por stdin ao armazenamento de secrets do repositório privado. Não copiou refresh token, cookies ou auth.json inteiro. O segredo CODEX_AUDIT_EPHEMERAL_ACCESS foi excluído após o job; listagem posterior confirmou sua ausência. Nenhuma credencial entrou no Git, relatório, logs ou backup.

O transporte do conector é interno/experimental e pode mudar. Não foi demonstrado contrato de escopo somente leitura para o token: o script restringe as chamadas, mas o bearer tem poderes maiores. Para operação permanente, usar login separado no servidor, cofre e escopo mínimo disponível. Renovação, revogação e recuperação após expiração precisam ser testadas antes de produção.

A autenticação headless/device code e manutenção em CI têm documentação oficial: https://learn.chatgpt.com/docs/auth . Isso não torna estáveis as rotas internas usadas pelo teste.

Não houve coleta permanente, deploy do widget, assinatura de eventos ou teste com o iPhone. O PC permaneceu ligado durante o trabalho, mas o runner não utilizou nenhum serviço nele. A evidência é de independência arquitetural da execução de leitura, não um ensaio físico de desligamento.

## Decisão

Codex atual + limites: viabilidade de leitura por serviço na nuvem comprovada para a amostra. Próxima fase pode implementar coleta periódica com autenticação independente, recuperação e paginação.

ChatGPT geral: acesso por HTTP simples bloqueado por challenge nos testes local e cloud; não concluir ausência de dados ou impossibilidade universal. Falta validar sessão de navegador em hospedagem apropriada ou encontrar outro transporte legítimo que exponha as conversas.

Tempo real: não comprovado. Sucesso de polling não comprova webhooks, SSE nem atualização imediata de widgets iOS. Eventos locais do App Server não devem ser atribuídos automaticamente ao conector cloud.

Workflow foi alterado para somente execução manual depois do teste, sem agendamento ou segredo persistente. Código do widget preservado.
