## 1.6.15 - 2026-10-28

- Alinha linha2 das duas tarefas pequenas aos códigos do Ativos0.2.21, com referência de commit fixada; amplia título e reserva a faixa do status.
- Acrescenta atualização real por tarefa à direita, na fonte da origem: HH:mm hoje/DD/MM em outro dia/† histórico. Ausência/futuro mostra —; nunca usa coleta/render como atualização.
- Preserva Task.updatedAt opcional ISO a partir do thread.updatedAt Unix segundos já fornecido por thread/list. Schema2/caches antigos compatíveis; somente canal privado.
- Círculos/ícones/divisórias/cotas/cápsulas/pontos e ações preservados. Médio/grande recebem somente o horário. Comparação sintética lado a lado e testes; sem validação física iOS.

## 1.6.14 - 2026-10-28

- Restaura Circle/Image diretamente nas linhas após relato físico de desaparecimento dos círculos1.6.13; conserva último símbolo conhecido e relógio histórico. Mock anterior não reproduziu a falha física; confirmação no iPhone pendente.
- Remove a frase do rodapé. Observação antiga da cota fica sinalizada por relógio discreto dentro da cápsula e timestamp acessível, sem mudar saldo/datas ou layout.
- Restaura execução da tarefa coletora já instalada e interrompida; confirma publicação real privada. Sem instalador, credenciais/triggers novos ou mudança de fonte/cache/coletor.
- Regressões estruturais de nós nativos diretos, transição de snapshot antigo para observação nova e preservação offline. Saldo100% aparece somente em fixtures sintéticas ou observação real, nunca inferido do horário de renovação.

## 1.6.13 - 2026-10-27

- Preserva o símbolo do último estado conhecido em círculos históricos neutros com relógio; unknown/futuro/inválido continuam desconhecidos. Helpers globais, filtros e alertas intactos.
- Protege percentual e contagem contra compressão: tamanho intrínseco horizontal, prioridade superior ao rótulo e nenhuma largura estimada de dígitos. Corrige a estrutura associada às reticências físicas relatadas; validação física da revisão pendente.
- Reduz cápsulas com três intervalos visuais iguais, incluindo contorno dos ícones. Ajusta apenas a altura dos pontos no menor tamanho para preservar duas linhas legíveis; ícones, divisórias, tarefas e fontes de dados preservados.
- Testes de estado/datas, valores protegidos, medidas reais das árvores e comparação sintética. Sem coleta, cache ou permissões novas.

## 1.6.12 - 2026-10-27

- Pequeno: título e origem maiores, agrupados e centralizados no círculo; símbolos de origem coloridos e um aviso datado para informações históricas, sem badge Antigo repetido.
- Duas cápsulas simétricas com valores destacados, renovação da cota e expiração comprovada do crédito em duas linhas internas. Datas no fuso local; fallbacks e quantidade real preservados.
- Escala de23 pontos com fração de fronteira:8%=1 completo+84% do próximo. Percentual usa a mesma cor da escala; saldo histórico atenuado e datado, ausente nunca vira zero.
- Preserva divisórias, círculos, links/PNG, Pergunta, dados e coletor. Comparativo sintético e testes; sem validação física iOS.

## 1.6.11 - 2026-10-27

- Encaminha availableCount do método existente account/rateLimits/read ao contrato privado resetCredits; não infere contagem da lista de detalhes.
- Converte expiração para ISO somente com associação singular comprovada; sem agregação de datas parciais/múltiplas.
- Troca a projeção pública por allowlist explícita antes de publicar: nenhum saldo de créditos, tarefas, limites ou campos pessoais novos passam ao canal público.
- UI/contratos1.6.10 preservados. Testes sintéticos de dados ausentes/zero/plural, listas parciais, idade/expiração e privacidade. Sem resgate ou acesso novo.

## 1.6.10 - 2026-10-27

- Implementa opção 1 no pequeno: duas colunas Limite da cota/Redefinições, mantendo a renovação da janela em linha discreta.
- Quantidade desconhecida mostra —. Contrato opcional schema 2 preparado, com observação/proveniência e validade independentes; coletor atual não fornece créditos e não ganhou acesso novo.
- Preserva tarefas, posições/divisórias, quatro links, PNG e pontos; médio/grande inalterados. Nenhuma redefinição consumida.
- QA de ausente/zero/um/muitos/plural/truncamento, stale/expiração, schema e geometria; comparativos sintéticos. Sem teste físico iOS nem inspeção dos pixels do mockup original por falha de materialização Windows.

## 1.6.9 - 2026-10-27

- Somente o pequeno 2×2 exibe duas tarefas, mantendo todos os registros e a ordenação anterior.
- Copia métricas reais do Popular 0.2.13 para círculo, título, origem, espaçamento e divisórias; linha central em altura/2.
- Preserva cabeçalho, cotas, pontos, quatro links diretos, Pergunta e pareamentos. Reserva vazia; redefinições adiadas.
- Médio/grande preservados integralmente. Comparação sintética das árvores reais e testes numéricos contra fonte upstream; sem teste físico iOS.

## 1.6.8 - 2026-10-27

- Restaura o header exato de 1.6.5 e as quatro URLs finais diretas após relato físico de abertura apenas do Scripting na rota intermediária.
- Ícones deixam de depender de coleta, run URL, index/onResume e Safari.openURL em código; consulta/recarga existente em tarefas e ControlWidget preservada.
- Refresh adicional nos quatro links diretos não é garantido. Sem botão novo, alteração visual, redefinições, fontes ou permissões novas.
- Registra falha da validação anterior e configuração observada sem atribuir causalidade não comprovada. Suíte e igualdade de header/URLs validadas localmente; confirmação física do hotfix pendente.

## 1.6.7 - 2026-10-27

- Consulta os snapshots existentes com prazo de 1,5 segundo antes de solicitar recarga e abrir cada destino original uma vez; timeout/offline conserva cache e datas.
- Deduplica consulta concorrente e reutiliza resultado preparado por cinco segundos para evitar consulta imediata duplicada na timeline.
- Trata toques na instância aberta por Script.onResume, preservando ações de tarefas/ControlWidget, layout sem botão inferior, PNG, pontos, Pergunta e pareamentos.
- Testes simulados de prazo, resultado tardio, falhas, reentrada, fontes e nós visuais; suíte e build locais. Sem teste físico iOS ou promessa de atualização instantânea.
- Substitui a etapa 1.6.6 disponível na branch, que não teve release; versão real exibida a partir do manifesto.

## 1.6.5 - 2026-10-26

- Substitui o ChatGPT opaco pelo PNG branco/transparente original do aplicativo oficial, 256×256, sem edição de pixels ou redesenho.
- Compensa somente a margem interna do novo asset para preservar tamanho visual; quadros, alinhamentos, demais ícones e pontos 1.6.4 intactos.
- Verifica alpha, bordas/cantos, ausência de matte preto, bytes incorporados, quatro dimensões e previews claro/escuro. Suíte, tipos e compilação aprovados; iOS físico pendente.

## 1.6.4 - 2026-10-26

- Atende a correção mais recente: gradiente posicional fixo vermelho à esquerda → amarelo central → verde à direita; consumo apaga da direita para a esquerda.
- Confirma margens sem alterar geometria: bordas externas dos pontos, quadros de ícones e divisórias coincidem nos quatro tamanhos (diferença simulada 0 px em 2x/3x).
- Mantém 23 quadradinhos, percentual, Pergunta, coleta e pareamentos; desconhecido/antigo neutro.
- Regressões, tipos, compilação e previews sintéticos com guias aprovados localmente; versão instalada e aparência física iOS não confirmadas.

## 1.6.3 - 2026-10-26

- Corrige a cor para representar saldo: todos os pontos acesos verdes quando alto, amarelos no meio e vermelhos quando baixo, em transição suave entre 100/50/0%.
- Mantém os 23 quadradinhos arredondados e o consumo da direita para a esquerda; ausência/expiração neutras e percentual preservado.
- Testes 100/86/50/20/10/1/0%, regressões Scripting, tipos e compilação aprovados; previews sintéticos. Sem teste físico iOS.

## 1.6.2 - 2026-10-26

- Troca a barra por 23 quadradinhos arredondados na proporção 31×29 por linha de 971 px, em gradiente verde/amarelo/laranja até vermelho no último aceso. O consumo apaga da direita para a esquerda. Em 86%, 20 acesos terminando em vermelho e três apagados.
- Preserva o percentual; ausência/expiração neutras sem inventar zero.
- Mantém geometria, fontes, atalhos, Pergunta, coleta, janelas independentes e armazenamento.
- Suíte Scripting, tipos do núcleo, compilação e preview sintético nos tamanhos existentes aprovados; comparação da referência pelo pai antes da release e iOS físico pendentes. Executor sem inspeção da imagem original: helper Library incompatível com `os.setxattr` Windows; revisão pelo briefing visual autorizado.

## 1.6.1 - 2026-10-26

- Cápsula amarela de `input` passa a exibir “Pergunta”; lista: “Pergunta aguardando sua resposta”.
- Mantém layout, schema 2, aprovação prioritária, idade das observações, dados privados e armazenamento.
- Regressões de estados/transições e árvores reais simuladas nos três tamanhos. iOS físico pendente; sinal geral ChatGPT indisponível no coletor atual.

## 1.1.9 - 2026-10-24

- Restaura exatamente o fundo do Popular.
- Desenha círculos nativos preenchidos atrás dos ícones das tarefas, substituindo o modificador de fundo da imagem.
- Símbolo do Codex e trapézio preservados; testes locais aprovados, visual nativo pendente.

## 1.1.8 — 2026-10-24

- Composição baseada na referência: cabeçalho maior, barra ao lado do símbolo e cápsulas de estado nas tarefas.
- Fundo escuro, ícones circulares e separadores do cabeçalho/entre tarefas.
- Símbolo existente e trapézio intactos; valores/estados reais e links preservados.
- Testes e comparação local aprovados; visual nativo pendente.

## 1.1.7 — 2026-10-24

- Usa as mesmas margens/limites de conteúdo do Popular em pequeno, médio e grande.
- Redistribui cabeçalho e tarefas preservando links e rodapé.
- Testes locais aprovados; visual nativo pendente.

## 1.1.6 — 2026-10-24

- Centraliza texto no rodapé estendido; fonte 9,5 sem mudar o trapézio.
- Equilibra margens superior/inferior do conteúdo.
- A última linha divisória abaixo da última tarefa foi removida; separadores entre tarefas permanecem.
- Recarga global preservada; testes locais aprovados, visual/toque nativos pendentes.

## 1.1.5 — 2026-10-24

- Pinta a base abaixo do trapézio com o gradiente contínuo até a borda.
- Devolve 13 pontos ao conteúdo (reserva de 23 pontos).
- Botão solicita recarga de todos os widgets Scripting via Widget.reloadAll().
- Testes locais aprovados; execução/visual globais no aparelho pendentes.

## 1.1.4 — 2026-10-24

- Rodapé com metade da altura, gradiente vermelho discreto e quatro cantos curvos.
- Validação de data/hora local e atualização com preservação do cache em falhas.
- Testes locais aprovados; renderização e toque no dispositivo pendentes.

## 1.1.3 — 2026-10-24

- Substitui botão circular por trapézio vermelho centralizado com data/hora e texto cinza-claro.
- Reserva inferior ampliada; mantém atualização por AppIntent e cache.
- Testes locais aprovados; visual nativo pendente.

## Codex 1.1.2 — 2026-10-24

- Botão de atualização por AppIntent no canto inferior direito, com cache preservado.
- O botão busca o snapshot mais recente no canal privado autorizado; não executa o coletor do computador. Foi corrigida a descoberta do executável GitHub CLI após desaparecer o atalho do WinGet, causa da publicação parada. O coletor voltou a publicar e a leitura privada confirmou 72% restantes em 24/10/2026; esse número não é fixado no código. O computador precisa continuar ligado e conectado para gerar novas observações.
- Testes locais aprovados; validação do toque nativo pendente.

# Histórico

## Scripting 1.1.1 — 23/10/2026

- Recupera automaticamente o executável local após atualização do app Codex.
- Lista local completa com paginação e conversas sem título, sem corte silencioso em 20.
- Limites de transporte recusam a atualização e preservam a captura anterior; alertas estabelecem nova linha de base sem disparos retroativos.

## Scripting 1.1.0 — 23/10/2026

- Dados novos de tarefas/limites no Git privado; distribuição pública sem dados pessoais.
- Lista disponível com filtros, assistente, alertas, Central de Controle e painel Início.
- Solicitação ao iOS em 1 minuto, opções 1/5/15; coletor com intervalo de 60 segundos.
- Push com texto genérico e chave send-only protegida por DPAPI, dependente de ativação.
- Preferências JSON e exportação para pasta autorizada; ativos do widget preservados.
- Testes locais aprovados. Tipos e execução no iPhone não confirmados.

Histórico anterior: `PROJECT.md`, `scripting/README.md` e tags Git existentes.
