# Codex no Scripting

Versão 1.0.7. Widget nativo `widget.tsx`, em TypeScript/TSX. A versão Scriptable e
os widgets Glance existentes não são alterados. A composição segue o código do
[Popular Scripting](https://github.com/Sagittaryuz/popular-scripting/tree/main/scripts/Popular%20Scripting),
commit `d24c9a2b153fc8b7b9733bf123e10382bcd58abd`. A versão 1.0.5 aumenta a
margem do pequeno, usando conteúdo central de 138 pt; os demais usam até 304 pt.
Mantém ícones de 26 pt, títulos de 10 pt, detalhes de
6 pt, estados de 10,5 pt, valor do limite de 17,5 pt e legenda de 7,5 pt.
O PNG do fundo é exatamente o mesmo arquivo da referência, confirmado pelo
SHA-256 `5d0fc7f05533af6534525cf8f86484028614a01587b717fa7d99836b9c00c094`.

| Família | Tamanho pedido | Itens |
|---|---|---:|
| systemSmall | 2×2 | até 3 |
| systemMedium | 2×4 horizontal (4×2 no iOS) | até 3 |
| systemLarge | 4×4 | até 3 |

O tamanho vem do iOS, não de um parâmetro. O cabeçalho usa a janela com menos
percentual restante e reproduz a hierarquia da referência: símbolo Codex, nome,
janela, percentual grande, barra azul e tempo até o reinício. Valores ausentes
aparecem como indisponíveis. Os títulos originais são
preservados e truncados visualmente. As três linhas têm altura uniforme e o
bloco é centralizado; no tamanho grande a altura é limitada para evitar linhas
esticadas. Não há rodapé de atualização. Aprovações, pedidos de resposta e erros
têm prioridade na lista, seguidos por tarefas em execução e demais tarefas.

## Instalação e validação no iPhone

Fonte de instalação: [pasta Codex no Git público](https://github.com/Sagittaryuz/scriptable-codex-widget/tree/scripting/scripting/scripts/Codex).
No Scripting, use **Importar Scripts Remotos** e cole essa URL. A branch de
distribuição é `scripting`; nenhum login ou token GitHub é necessário. Como
alternativa, a release fornece um arquivo `.scripting` rastreável pelo Git.
O procedimento abaixo por CLI continua disponível para desenvolvimento.

## Toques

O cabeçalho do limite abre o aplicativo pelo esquema `chatgpt://`. Cada linha abre a conversa
correspondente: tarefas Codex locais/remotas usam `/codex/tasks/{id}`, tarefas
Codex Cloud usam `/codex/cloud/tasks/{id}` e conversas ChatGPT
usam `/c/{id}`. O snapshot pode fornecer `url` explícita nesses três formatos;
URLs com outro host, credenciais, parâmetros ou fragmentos são descartadas.
Um identificador sem destino reconhecido abre somente `https://chatgpt.com/`.
Os links usam o componente nativo `Link`; cada uma das até três linhas mantém
seu próprio destino. Uma seta discreta identifica a área clicável.
O esquema do cabeçalho depende de o aplicativo ChatGPT estar instalado e
registrado no iOS. Os links HTTPS das linhas podem abrir o app ou o navegador
conforme o iOS; links de tarefas locais não tornam o runtime do computador acessível pelo iPhone.
Toques e suporte às áreas independentes no tamanho pequeno ainda precisam ser
conferidos na Home Screen do iPhone; o teste da árvore não comprova isso.

## Instalação por CLI e validação

1. No computador, faça `git clone` / `git pull` deste Git público. Execute
   `npx scripting-cli@1.5.0 start --port=4000 --editor=none --no-auto-open`
   **dentro da pasta `scripting`**. O serviço só deve ter a pasta `scripts/Codex`.
2. No Scripting do iPhone, conecte ao serviço local na mesma rede e selecione
   o projeto **Codex** do computador. Nunca substitua outro script do usuário.
3. Execute **Codex**. O menu permite prévias de 2×2, 2×4 e 4×4. Todas mostram
   no máximo três tarefas. O snapshot
   embarcado é uma coleta real datada, e não uma conexão ao vivo.
4. **Atualizar dados** consulta publicamente `data/scripting.json` na branch
   `widget-data`, sem credenciais. Código e dados são independentes.
5. Adicione os três tamanhos do widget **Scripting** à tela inicial e selecione
   **Codex**, sem parâmetro. Confira corte de títulos, contraste, percentual,
   estado, horário e retorno após uma falha de rede. A prévia não substitui esse
   teste no host real. Não use coloração/tint do iOS como única indicação de estado.

O render emite um diagnóstico sem títulos nem mensagens: versão,
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

O coletor requer Node.js 24 ou posterior para executar o módulo TypeScript
compartilhado sem uma dependência de runtime. Validado com Node.js 24.20.0.

`node scripts/collect-scripting.cjs --out arquivo.json` faz coleta local.
`node scripts/collect-scripting.cjs --push` publica e confere o readback no
Git público, na branch exclusiva de dados. `node scripts/watch-scripting.cjs`
repete a coleta a cada cinco minutos sem sobreposição. O processo precisa ficar
ativo no computador, conectado à conta Codex e à sessão `gh`. A consulta não
gera mensagens nem executa tarefas/inferência. Requisições de dados não são
atualizações do código. Falha preserva a última publicação; nenhum horário é
adiantado artificialmente. O status local fica em `work/`, fora do Git/backup.

## Código, atualização e recuperação

Fonte: Git público, branch `scripting` para distribuição. A instalação de
desenvolvimento recebe arquivos do checkout Git via CLI oficial. Nesta
primeira versão não há autoatualização de código dentro do widget: atualize
o checkout por Git, conserve o commit anterior e sincronize só **Codex**.
Isso evita executar código baixado sem validação.
O Git permite reverter um commit; snapshots/cache de dados são separados.
Um carregador futuro deve validar versão/sintaxe antes de promover a atualização
e reter a última versão nativa aprovada. Não confundir o cache de dados com
recuperação automática do código.

## Verificações

`npm run test:scripting` verifica estados, privacidade, percentuais, fontes
ausentes, expiração, três destinos específicos e ausência do rodapé. `npm run build:scripting` verifica sintaxe,
descritor e ausência de `await` no nível superior dos arquivos de entrada. O comando
`npm run check:scripting` precisa das declarações `.d.ts`
enviadas pelo Scripting ao conectar o iPhone; sem elas não há confirmação dos
tipos específicos da versão instalada. Não editar as declarações sincronizadas.

Documentação oficial consultada: índice `https://scriptingapp.github.io/llms.txt`,
Widget API, Storage, fetch, Dialog, HStack, VStack, ProgressView, Image,
Text View Modifiers, frame e widgetBackground. API Codex:
`https://learn.chatgpt.com/docs/app-server`. Padrões: GIT-FIRST 1.0.1,
WEBAPP-WORKFLOW 1.2.3, referência registrada no PROJECT.md do repositório.

