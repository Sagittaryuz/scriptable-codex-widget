# Prova de conceito — navegador nativo da nuvem

Data: 23/10/2026. Coleta encerrada em 2026-10-23T14:12:23.254Z. Sem Browserbase, computador do usuário, túnel, novos serviços pagos ou automações.

## Login remoto
Aba 3 autenticada: menu do perfil, projetos e conversas existentes visíveis após o login pessoal. Credenciais/MFA não foram preenchidos pelo agente nem copiados. Leituras na mesma aba, sem logout.

## Conversas: amostra de cinco
| Título | ID | Atualização | Estado estruturado |
|---|---|---|---|
| Analisar readequação da Vivo | 6adb6693-b2c8-83e9-a420-362b649572e3 | Não exposta | Não confirmado |
| Solicitar cancelamento pagamento | 6adb65ba-4f54-83e8-a2df-b312eeeb91f6 | Não exposta | Não confirmado |
| Identificar tipo de parede | 6adb6355-1f80-83e9-9ed2-d61b3622e25b | Não exposta | Não confirmado |
| Pedido incompleto | 6adb632e-6b84-83e8-b0f0-44f3a56278f4 | Não exposta | Não confirmado |
| Criar provas de matemática | 6ada8eb6-9ca0-83e9-a38e-6ebb9c70dc05 | Não exposta | Não confirmado |

Títulos e IDs conferidos por links da barra lateral e navegação renderizada. Em Criar provas, havia um elemento time 2026-10-22T22:32:50.788Z (ontem 19:32), sem confirmação de que representa updatedAt da conversa. Não foi exportado como atualização. Uma navegação teve timeout no clique, mas a leitura posterior confirmou a conversa de destino.

## Estados efetivamente expostos
Em Analisar readequação da Vivo apareceram Gerar resposta novamente e Trabalhou por 53 s. São sinais de uma resposta renderizada; não comprovam objetivo concluído nem estado atual do runtime. A página autenticada não registrou ferramentas WebMCP de leitura de estados (fetchTools retornou nenhuma ferramenta).

Todos os cinco itens foram exportados como unknown. Não se afirmou idle, ready, running, approval ou input sem campo explícito da fonte. Ociosa descreve runtime sem execução; resposta pronta descreve um turno concluído; execução, aprovação e entrada exigem sinais próprios. Tarefa agendada é uma entidade de programação, não o estado de um chat.

## Codex e agendamentos
A área Codex listou itens com rotas /local/UUID. Amostra: Recuperar auditoria geográfica, 01a16427-5b79-74c3-b764-d0209a89a000. A abertura mostrou J.A.R.V.I.S is managing this task e Assumir o controle desmarcado. Não se acionou esse controle. A interface não expôs updatedAt, estado do turno ou host de execução; /local/ não foi tratado como prova de execução em computador ou nuvem. Inventário completo e equivalência com a API auditada anteriormente não foram demonstrados.

Agendado exibiu seção Ativa com Pendências, trabalho e notícias (Hoje 11:30, Cronograma personalizado), Trabalhos e concursos em Goiás (Amanhã 08, Diariamente às 8:00), monitoramentos e Analisar novos e-mails (evento no Gmail). Concluído e Em pausa eram seções separadas. Nenhuma tarefa foi criada, editada, disparada ou pausada.

## Persistência
Após as leituras, abriu-se a aba 4 do MESMO perfil, mantendo a 3. Ela mostrou menu do perfil, ausência do botão Entrar e 30 links de conversas. Login reutilizado entre abas comprovado. Não há mecanismo de criação/reinício de sessão de navegador anunciado; persistência entre sessões independentes, reinício, expiração e renovação NÃO testadas. A aba 3 foi marcada para continuidade.

## Snapshot privado e leitura de volta
Destino: Sagittaryuz/scriptable-codex-widget, visibilidade private e permissões pull/push confirmadas pela conexão GitHub. Foram lidos GIT-FIRST.md, WEBAPP-WORKFLOW.md, AGENTS.md do padrão, PROJECT.md, README, scripting/README, modelo/consumidor e auditoria anterior. Nenhum AGENTS.md foi encontrado na árvore feat/scripting.

Arquivo separado: data/tests/scripting-cloud-poc-20261023-141223.json, branch widget-data, commit 0fd014e1671ee148cb66bf3d08c6c96d605cac3f. Leitura pelo SHA imutável comparada byte a byte: idêntica. data/scripting.json comparado antes/depois: inalterado. Cinco títulos/IDs autorizados, estados unknown; sem mensagens, credenciais ou limites inventados. windows vazio; usageObservedAt usa epoch como sentinela de ausência exigida pelo esquema, não data de uma coleta de uso. Validação pelo modelo schemaVersion 2 aprovada.

## Widget e instalação
Links implementados em feat/scripting, versão 1.0.1, commit b1837853f6f53d00d615dbadc32aad7cb24a3d31. Cabeçalho: https://chatgpt.com/. Linhas: URL explícita validada em /c/UUID ou /local/UUID, com fallback por origem/UUID e ChatGPT para origem desconhecida. Nenhum parâmetro secreto em URL. Rota /local/UUID observada no navegador; acesso de cada tarefa no aparelho depende de disponibilidade e autenticação.

13 testes de modelo, 6 de rede/cache, teste de destinos/URLs inseguras/árvore 2-4-8, sintaxe TS/TSX e tipagem do núcleo passaram em runtime na nuvem usando fonte obtida da API Git privada. Tipos nativos dependem das declarações do Scripting instalado. O ajuste posterior foi somente versão nos diagnósticos, com sintaxe repetida aprovada. Importação privada automática, render e toques na Home Screen NÃO testados. Link GitHub é fonte de instalação, não instalador de um toque; README oferece cópia dos sete arquivos no iPhone.

## Limite operacional
O teste comprova consulta pontual interativa e transporte de snapshot pela conexão GitHub. Não comprova coleta agendada sem intervenção, sessão renovável, streaming, eventos ou sincronização contínua. Nenhuma automação recorrente criada. O iOS decide o refresh; o consumidor atual continua lendo somente data/scripting.json e não o teste separado. Backup no Drive não executado nesta prova; fonte e histórico preservados no Git privado.
