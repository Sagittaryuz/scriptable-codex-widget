# Codex no Scripting

Versão 1.0.0. Widget nativo `widget.tsx`, em TypeScript/TSX. A versão Scriptable e
os widgets Glance existentes não são alterados. Referência visual: widget Popular
fornecido pelo usuário em 23/10/2026; superfície preta, ícones circulares,
divisórias finas, limite acima e estados à direita das tarefas.

| Família | Tamanho pedido | Itens |
|---|---|---:|
| systemSmall | 2×2 | 2 |
| systemMedium | 2×4 horizontal (4×2 no iOS) | 4 |
| systemLarge | 4×4 | 8 |

O tamanho vem do iOS, não de um parâmetro. O cabeçalho usa a janela com menos
percentual restante; outra janela só é exibida quando efetivamente retornada.
Valores ausentes aparecem como indisponíveis. Os títulos originais são
preservados e truncados visualmente. Aprovações, pedidos de resposta e erros
têm prioridade na lista, seguidos por tarefas em execução e demais tarefas.

## Instalação e validação no iPhone

1. No computador, faça `git clone` / `git pull` deste Git privado. Execute
   `npx scripting-cli@1.5.0 start --port=4000 --editor=none --no-auto-open`
   **dentro da pasta `scripting`**. O serviço só deve ter a pasta `scripts/Codex`.
2. No Scripting do iPhone, conecte ao serviço local na mesma rede e selecione
   o projeto **Codex** do computador. Nunca substitua outro script do usuário.
3. Execute **Codex**. O menu permite prévias de 2×2, 2×4 e 4×4. O snapshot
   embarcado é uma coleta real datada, e não uma conexão ao vivo. Sem credencial,
   a prévia identifica o uso desse snapshot/cache.
4. Em **Configurar acesso GitHub**, forneça um token fine-grained de leitura,
   apenas para `Sagittaryuz/scriptable-codex-widget`, `Contents: Read-only`.
   Digite/cole no campo seguro do próprio Scripting; nunca no chat.
   A credencial fica no Keychain privado do script, sem sincronização entre apps.
5. **Atualizar dados** consulta `data/scripting.json` na branch `widget-data`
   pela API autenticada do próprio GitHub. Código e dados são independentes.
6. Adicione os três tamanhos do widget **Scripting** à tela inicial e selecione
   **Codex**, sem parâmetro. Confira corte de títulos, contraste, percentual,
   estado, horário e retorno após uma falha de rede. A prévia não substitui esse
   teste no host real. Não use coloração/tint do iOS como única indicação de estado.

O render emite um diagnóstico sem títulos, tokens ou mensagens: versão,
família, dimensões, data do snapshot, uso de cache e quantidade de itens.
O script principal termina com `Script.exit()`. O widget apresenta uma árvore
nativa e pede uma atualização após cinco minutos; o iOS decide a frequência.

## Fonte e fidelidade dos estados

Há duas fontes que NÃO devem ser confundidas:

- **Ferramentas do app Codex**: podem confirmar quais chats estão ativos ou
  ociosos naquele app e host. Uma coleta inicial real foi embarcada.
- **App Server independente, via stdio**: consulta limites da sessão existente,
  lista histórico local e lê **apenas metadados do último turno** com
  `itemsView: notLoaded`, sem mensagens nem itens de ferramentas. Não controla
  o runtime desktop. Nesta máquina, o proxy do runtime desktop retornou erro
  de socket 10050; `notLoaded` não significa ociosa ou concluída.

Mapeamento conservador: `active` = execução; flags explícitas
`waitingOnApproval` / `waitingOnUserInput` = aprovação/resposta; `systemError`
ou último turno `failed` = erro; último turno `completed` = **Resposta pronta**,
não conclusão do projeto; `interrupted` = última execução interrompida.
Um turno registrado como `inProgress` em servidor que não possui o runtime
aparece como **Não confirmado**, com descrição do último registro.
Sem sinal, o estado permanece desconhecido. Depois de 15 minutos, um estado
passa a **Antigo**, conservando o título e o instante real da observação.

O coletor local não cobre automaticamente todos os hosts remotos/Cloud do app.
A cobertura efetiva aparece no diagnóstico. Não há resumo por IA, previsão de
esgotamento, percentual de conclusão de tarefa, cobrança estimada nem mensagens
da conversa no widget. Uma resposta pronta pode exigir trabalho adicional.

## Atualização dos dados, sem chamadas a modelos

`node scripts/collect-scripting.cjs --out arquivo.json` faz coleta local.
`node scripts/collect-scripting.cjs --push` publica e confere o readback no
Git privado, na branch exclusiva de dados. `node scripts/watch-scripting.cjs`
repete a coleta a cada cinco minutos sem sobreposição. O processo precisa ficar
ativo no computador, conectado à conta Codex e à sessão `gh`. A consulta não
gera mensagens nem executa tarefas/inferência. Requisições de dados não são
atualizações do código. Falha preserva a última publicação; nenhum horário é
adiantado artificialmente. O status local fica em `work/`, fora do Git/backup.

## Código, atualização e recuperação

Fonte: Git privado, branch `feat/scripting` durante desenvolvimento. A instalação
de desenvolvimento recebe arquivos do checkout Git via CLI oficial. Nesta
primeira versão não há autoatualização de código dentro do widget: atualize
o checkout por Git, conserve o commit anterior e sincronize só **Codex**.
Isso evita distribuir um token amplo ou executar código baixado sem validação.
O Git permite reverter um commit; snapshots/cache de dados são separados.
Um carregador futuro deve validar versão/sintaxe antes de promover a atualização
e reter a última versão nativa aprovada. Não confundir o cache de dados com
recuperação automática do código.

## Verificações

`npm run test:scripting` verifica estados, privacidade, percentuais, fontes
ausentes, expiração e capacidade 2/4/8. `npm run build:scripting` verifica sintaxe
TS/TSX e descritor. `npm run check:scripting` precisa das declarações `.d.ts`
enviadas pelo Scripting ao conectar o iPhone; sem elas não há confirmação dos
tipos específicos da versão instalada. Não editar as declarações sincronizadas.

Documentação oficial consultada: índice `https://scriptingapp.github.io/llms.txt`,
Widget API, Keychain, Storage, fetch, Dialog, HStack, VStack, ProgressView, Image,
Text View Modifiers, frame e widgetBackground. API Codex:
`https://learn.chatgpt.com/docs/app-server`. Padrões: GIT-FIRST 1.0.1,
WEBAPP-WORKFLOW 1.2.3, referência registrada no PROJECT.md do repositório.
