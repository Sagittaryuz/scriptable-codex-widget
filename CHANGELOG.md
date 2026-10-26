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
