# Registro do projeto

## Atualização ao tocar - Scripting 1.6.7 - 27/10/2026

Os quatro atalhos usam o run do próprio projeto, gerado por
Script.createRunURLScheme, com fallback no formato documentado. O parâmetro
transporta apenas chatgpt/codex/voice/dots; cada chave mantém sua URL final.
Antes de sair do Scripting, consulta os snapshots existentes com prazo de
1.500 ms, preserva o cache em timeout/offline, solicita Widget.reloadAll e
faz uma única tentativa de Safari.openURL. Não inicia coleta nova. A passagem
pelo Scripting é necessária para executar a ação; iOS decide app/navegador.
Falhas na consulta ou recarga não impedem a tentativa de abrir o destino.

Um marcador separado da data de observação permite à timeline reutilizar
por cinco segundos o resultado preparado pelo toque, evitando uma segunda
consulta logo após abrir o outro app. Toques concorrentes compartilham a
consulta; depois desse intervalo consultam novamente as mesmas fontes.
Resultado de transporte que chega depois de seu timeout não substitui cache.
Não existe polling ou recarga recursiva; há apenas timers de prazo limitado.
Cache e datas originais não são rejuvenescidos pelo marcador de consulta.

Script.onResume atende novos toques explícitos na instância já aberta,
sem reiniciar a UI. Retomadas comuns não reabrem links nem criam ciclos.
Abrir a tela normal solicita recarga; previews não. Tarefas e ControlWidget
preservam RefreshCodex: consulta existente, cache em falha, recarga ao fim.
O rodapé segue sem botão/trapézio de refresh. PNG transparente, pontos,
margens, Pergunta, pareamentos, fontes e permissões foram preservados.
Tela e diagnóstico leem a versão de script.json em vez do antigo 1.6.0 fixo.

Testes do bundle real com bindings simulados verificam prazo, persistência,
cache preparado, resultado tardio, offline, concorrência, reentrada, destinos,
quatro dimensões e ausência de alterações nos nós visuais exceto URLs.
Suíte Scripting, tipos do núcleo e build local passaram. Registro:
validation/tap-refresh-1.6.7.json. Não houve teste físico iOS, nem confirmação
da versão instalada. WidgetKit pode adiar/agrupar a solicitação; a idade real
dos dados depende do produtor existente. O limite é um prazo de código,
sujeito ao escalonamento do runtime, não garantia física de 1.500 ms.

A 1.6.6 chegou à branch como etapa intermediária, sem release. A 1.6.7
incorpora o prazo antes da navegação e evita ambiguidade de atualização.
Distribuição: branch scripting; rollback estável: 1.6.5.

O contrato atual não contém quantidade de redefinições disponíveis nem
expiração desses créditos. Window.resetsAt é somente a renovação normal
da janela de uso. Nenhuma redefinição foi acionada e nenhuma UI desses
créditos foi implementada neste escopo.

## ChatGPT transparente - Scripting 1.6.5 - 26/10/2026

O PNG ChatGPT anterior era opaco (alpha 255 inclusive nos cantos). Substituído
pelo PNG branco/transparente original, 256×256, embutido no ICO oficial do app
instalado OpenAI.Codex 26.1021.3705.0. Extração byte a byte, sem editar raster,
remover fundo por código ou redesenhar. Procedência/hashes em `assets/ORIGEM.md`.
Não foi necessário gerar uma imagem: o original oficial já tinha alpha.

Somente a escala interna do glyph ChatGPT passa a 210/254 para preservar a
largura visual anterior de 210 pixels da fonte; mantém proporções e frame
externo, nomes, margem, links e badges. A diferença de altura é menor que
um pixel da fonte 256px. Outros ícones, pontos 1.6.4, percentual, Pergunta,
coleta, Storage e pareamentos intactos. Resolução preservada em 256×256.

Validação portátil do PNG via zlib: alpha das bordas/cantos, regiões vazias,
antialiasing branco sem matte preto; comparação byte a byte com o PNG do ICO;
integridade do asset incorporado, demais três assets e comparação da árvore
do cabeçalho em quatro dimensões. Suíte Scripting completa, tipos do núcleo
e compilação aprovados. Previews usam assets reais sobre claro/escuro/xadrez
e árvore real com dados sintéticos; fontes/SF Symbols aproximados, sem teste
físico iOS. Backup Drive anteriormente negado não será tentado nesta versão.
Atualização na branch `scripting` e pacote 1.6.5; rollback em 1.6.4.

## Gradiente invertido e margens - Scripting 1.6.4 - 26/10/2026

Instrução direta mais recente substitui a cor uniforme da 1.6.3: gradiente
fixo por posição, **vermelho intenso à esquerda, amarelo no meio, verde à
direita**. Ao consumir, apaga da direita para a esquerda e preserva os pontos
vermelhos da esquerda em saldos baixos. Mantém 23 quadradinhos arredondados,
contagem proporcional, cinza apagado, unknown/stale neutros, percentual,
Pergunta, coleta e armazenamento. Nenhum outro projeto alterado.

Medição direcionada das bordas externas preenchidas na árvore TSX real:

| Família/dimensão | Esquerda | Direita | Comprimento | Margens laterais |
| --- | ---: | ---: | ---: | ---: |
| Small 158×158 | 8 | 150 | 142 | 8 |
| Small 158×170 | 6 | 152 | 146 | 6 |
| Medium 338×170 | 17 | 321 | 304 | 17 |
| Large 338×360 | 17 | 321 | 304 | 17 |

Valores em pontos lógicos. Pontos, quadros dos quatro ícones e duas divisórias
coincidem nos mesmos limites, com erro numérico menor que 1e-9 pt. Não há
padding na ancestralidade. `23*larguraDoPonto + 22*spacing = larguraÚtil`;
o raio fica dentro do frame e não altera a borda externa. A geometria já era
idêntica na 1.6.3 e não foi corrigida sem necessidade. Bordas arredondadas
simuladas em escalas 2x/3x produzem diferença de 0 px. Antialiasing iOS e o
contorno decorativo 0,6 pt dos quadros não foram medidos fisicamente.

Evidência em `validation/quota-margins-1.6.4.json`; previews sintéticos com
guias em `quota-margins-1.6.4.png` (comparação horizontal de quatro tamanhos)
e `quota-widget-margins-1.6.4.png` (widget completo). Suíte Scripting, cores
100/86/50/20/10/1/0%, tipos do núcleo e compilação aprovados. Versão final no
manifesto `scripting/scripts/Codex/script.json`; atualizar código pelo Git na
branch `scripting` ou pacote 1.6.4. A versão instalada no iPhone não foi lida.
Rollback preservado em `scripting-v1.6.3`; teste físico iOS pendente.

## Cor pelo saldo - Scripting 1.6.3 - 26/10/2026

Correção explícita do usuário após a release 1.6.2: o verde indica saldo alto;
ao cair, a cor dos pontos acesos passa suavemente por amarelo até vermelho.
Todos os acesos usam a mesma cor atual do saldo, com interpolação RGB entre
100% `#30d158`, 50% `#ffd60a` e 0% `#ff453a`. Não há gradiente espacial.
Em 0% nenhum ponto fica aceso. Ausentes/antigos seguem neutros, sem inventar zero.

Geometria 23 quadradinhos arredondados, quantização, apagamento da direita para
a esquerda, texto abaixo, fontes, observações, coleta, janelas independentes,
Pergunta, Storage, Keychain e pareamentos preservados. A única mudança de
comportamento é a cor produzida pelo helper de pontos; nenhuma alteração em
outros projetos. Rollback disponível em `scripting-v1.6.2`.

Regressões: 100/86/50/20/10/1/0%, monotonicidade dos pontos e suavidade da cor,
unknown/stale/ausentes, janelas e quatro dimensões; suíte Scripting, tipos do
núcleo e compilação. Previews novos `validation/quota-dots-1.6.3.png`,
`quota-widget-full-1.6.3.png` e `quota-dots-86-detail-1.6.3.png`: árvore real,
dados sintéticos e fontes/SF Symbols aproximados. Não comprovam teste físico
iOS nem equivalência pixel a pixel do widget completo.

## Limite em pontos - Scripting 1.6.2 - 26/10/2026

Somente o indicador da linha de limite muda: 23 quadradinhos arredondados,
com proporção medida pelo pai de 31×29 por linha de 971 px e raio de 10 px
nessa escala. Na largura lógica 304, cada ponto mede 9,7×9,1 e raio 3,1 pt;
espaçamento distribuído entre os limites externos aprovados. A altura maior
cabe nas folgas acima/abaixo da linha, sem mover a posição central, o texto
ou as tarefas; testes verificam ausência de sobreposição. Sem mudar fontes, margens,
percentual, reinício, atalhos, tarefas ou cápsula Pergunta.

Cada ponto representa aproximadamente 4,35%: `round(23*restante/100)`, com
mínimo de um ponto e máximo de 22 para saldo estritamente entre 0 e 100%.
Todos acesos somente em 100%; nenhum em 0%; em 86%, 20 acesos e três apagados.
O percentual numérico preserva seu arredondamento existente e informa o saldo
com mais precisão que os pontos. O gradiente vai da esquerda verde,
passando por amarelo e laranja, até vermelho no último ponto aceso; é
redistribuído entre os pontos acesos para reproduzir o exemplo de 86% com
20 acesos terminando em vermelho e três apagados. Não há cor uniforme de
faixa por saldo. O consumo apaga pontos da direita para a esquerda, em cinza
escuro. Ausência de limite gera pontos neutros mais claros e texto
`Limite indisponível`, sem saldo zero inventado. Observação antiga conserva
seu percentual/data, mostra `Antigo` e neutraliza todos os pontos.

Coleta, schema 2 e seleção existente da janela com menor saldo preservados;
as janelas não são somadas nem promediadas. `usageObservedAt` continua sendo
a data da observação de limites do snapshot; não há nova fonte ou timestamp.
Storage, Keychain e pareamentos intactos. Sem imagem de bateria ou redesenho
dos ícones; essa referência não integra este pedido de código.

Validação: suíte Scripting completa (incluindo Pergunta), TypeScript do modelo
e helper, compilação de 20 arquivos TS/TSX e hashes dos ativos aprovados.
`scripts/test-quota-dots.cjs` verifica limites, monotonicidade, ausência,
expiração, ordem das janelas, quatro dimensões e igualdade dos demais filhos
do cabeçalho com 1.6.1. Preview em `validation/quota-dots-1.6.2.svg` e `.png`:
simulação da linha real compilada, dados sintéticos e fonte Arial aproximada,
sem renderização iOS. Visual/toques físicos e tipos do SDK instalado pendentes.
Referência `libfile_492d267a1be48191bc58e17948a5a4f2`: materialização oficial
falhou em Windows (`os.setxattr` indisponível); arquivo final não criado e pixels
originais não inspecionados neste executor. Revisão feita pelo briefing visual
explícito do pai, que inspecionou a imagem. Comparação independente pelo pai
necessária antes de criar release; o commit uniforme anterior foi preservado
no histórico. Preview da revisão na branch `scripting`; release ainda pendente.
Rollback aprovado anterior em `scripting-v1.6.1`.
Previews adicionais: `validation/quota-widget-full-1.6.2.png` (widget completo
systemLarge 338×360, ampliado para linha de 971 px; tamanho total da referência
não disponível neste executor) e `validation/quota-dots-86-detail-1.6.2.png`.
Renderizadores de simulação em `scripts/preview-quota-widget.cjs` e
`scripts/render-quota-preview.py`; imagens reais incorporadas do projeto,
fontes/SF Symbols aproximados e dados inteiramente sintéticos.

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
