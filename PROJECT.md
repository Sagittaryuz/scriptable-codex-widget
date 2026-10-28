# Registro do projeto

## Linha2 alinhada ao Ativos e atualização real -1.6.15 -28/10/2026

Referência somente leitura: Sagittaryuz/popular-scripting0.2.21, commit
3cf7267cf3bb7dab48e22ce58afc6b017d6a90b5. draw.js define linha de códigos em
y28,height8 dentro da linha36pt; view.tsx coloca unit/time com essa geometria.
Captura mínima do código público e política temporal em
validation/popular-task-reference-0.2.21.json. Nenhum arquivo daquele repo alterado.

No pequeno, origem e data/hora ficam centradas em y32*scaleY, exatamente na
altura dos códigos das duas últimas linhas do Ativos. Isso substitui a regra
anterior de centralizar título+origem no círculo. Título ocupa y2..26, fonte13
na escala-base em vez de11; linha2 ocupa y28..36. Seu texto passa sob a região
do badge, sem colisão, enquanto título conserva largura reservada ao status.
48pt proporcionais à direita pertencem ao horário, como no Ativos. Origem e
horário usam a mesma fonte/peso/cor; corpo é limitado pela altura disponível.
Ícones/círculos/divisórias/header/cápsulas/pontos/toques permanecem iguais.
Médio/grande recebem somente a data/hora ao fim da origem, sem mover suas linhas.

Novo campo opcional schema2: Task.updatedAt, ISO, representa a atualização
persistida da tarefa. Task.observedAt continua sendo a observação do produtor.
O método thread/list já autorizado retorna thread.updatedAt em Unix segundos,
contrato confirmado por leitura mínima sem títulos/IDs/conteúdo. O produtor
converte somente inteiro positivo válido e não posterior à observação; nunca
substitui ausência/futuro/formato inválido pela hora de coleta/renderização.
Validação preserva o ISO válido; caches/schema antigos continuam compatíveis.

taskUpdatePresentation segue timePresentation do Ativos: fuso America/Sao_Paulo,
HH:mm para o dia atual, DD/MM para outro dia, † quando observação é histórica
ou atualização tem mais de24h. Sem updatedAt comprovado, data futura/inválida
ou posterior à própria observação, mostra —. Descrição acessível conserva ISO
completo. Isso não transforma último estado em execução atual nem reordena tarefas.
O timestamp da nuvem atualmente não está no snapshot existente: mostra — até
essa fonte fornecer updatedAt real; observedAt não é substituto autorizado.

O coletor local existente precisa receber por fast-forward o commit desta revisão
e reiniciar a mesma tarefa, sem instalador/credencial/trigger novo. O campo segue
somente no canal privado; publicSnapshot já zera tasks e não exporta atualizações
pessoais. Nenhuma nova consulta ou permissão foi acrescentada.

QA: comparação independente das fórmulas capturadas, diferença0pt nos centros
da linha2 em158×158,158×170,170×170; títulos longos/hierarquia e faixa do status;
fonte idêntica origem/horário; hoje/ontem/virada do dia Brasília/stale/ausente/futuro;
producer muda observedAt sem mudar updatedAt, campos inválidos/segundos versus
milissegundos/schema2 antigo; privacidade e regressões das demais funções.
Prévias públicas usam árvores reais e geometria Ativos, dados/ícones/curvas
ilustrativos e fontes Windows aproximadas. Sem teste físico iOS; não confirma
resolução física de círculos além do caminho direto preservado da1.6.14.

## Recuperação1.6.14 - dados parados, círculos e rodapé - 28/10/2026

Relato físico da1.6.13: região dos círculos vazia, apesar de títulos/origens e
ícones principais visíveis. O mock de createElement havia resolvido componentes
e passado todos os testes; não reproduziu a omissão física. Não foi possível
confirmar neste executor o mecanismo exato do SDK. A menor recuperação restaura
Circle/Image diretamente em SmallTaskRow/TaskRow, como no caminho1.6.12 que
precede a extração TaskStatusCircle. Remove o componente intermediário e seus
spreads de modificadores; conserva símbolo conhecido/relógio histórico da1.6.13.
Novo teste estrutural exige os nós nativos diretos e posição explícita, além da
árvore simulada. Confirmação no iPhone continua pendente; não declarar correção
física validada apenas porque o mock voltou a passar.

Captura nova após restaurar dados mostrou cota atual e badges Pronta, mas ainda
sem círculos. Isso ocorreu antes de publicar1.6.14: não comprova falha da nova
recuperação. A frase antiga também desaparecia quando tudo ficava recente;
essa ausência na captura não comprovava remoção de código. Remoção incondicional
é testada nesta revisão também para snapshots históricos. Nenhum runtime iOS
ou simulador está acessível neste executor Windows; não há reprodução nativa.

Frase de rodapé removida por instrução direta. Nenhuma frase/data substituta
ocupa a margem inferior. Cota sem observação atual ganha somente um relógio
discreto dentro da cápsula, sem mudar suas dimensões/textos/datas; acessibilidade
preserva usageObservedAt exato. Círculos históricos mantêm relógio e descrição
Último estado observado. Informação desconhecida não vira estado/cota atual.

Diagnóstico privado: snapshot local e nuvem estavam sem observação recente;
mergeSources selecionava corretamente a cota da fonte mais recente disponível.
A execução agendada existente estava Ready, com último resultado0xC000013A;
nenhuma causa externa específica de interrupção foi confirmada. Foi reiniciada
somente CodexWidget-Scripting-Collector, no caminho e ação já conferidos, sem
instalador, token, cópia de credencial, trigger ou configuração nova. Nova
publicação real foi verificada no canal privado, sem forçar saldo ou timestamps.
Detalhes reais da conta ficam somente na evidência ignorada/local, nunca em Git.

Cache de toque só reutiliza observação preparada por5segundos, não explica horas
de atraso. Cache/dados/modelo/coletor não mudaram nesta revisão. Teste sintético
reproduz cota antiga de uma fonte, substituição por observação nova confirmada e
falha offline subsequente preservando dados/datas; passar resetsAt nunca infere
100%. iOS ainda decide quando atende a recarga da timeline; PC desligado não
produz observações locais novas. Não há serviço permanente nem acesso novo.

QA: estados Pronta/Ociosa diretos em quatro dimensões, símbolos históricos,
origens coloridas e quatro links, ausência de frase/rodapé, sinal discreto de
idade, dados e geometria1.6.13 preservados. Comparativo usa somente dados
sintéticos, inclusive100% ilustrativo. A captura foi inspecionada pelo pai;
a leitura Library neste executor não retornou pixels utilizáveis.

## Revisão1.6.13 - estado histórico, números e espaçamento - 27/10/2026

O contrato/cache preservava task.state; apenas taskPresentation o trocava por
unknown após15min. A apresentação do círculo passa a reutilizar o símbolo do
estado normalizado conhecido, em círculo neutro com pequeno relógio interno,
somente quando observedAt é passado válido e antigo. Descrição acessível:
Último estado observado + rótulo + observedAt original + aviso de que não
confirma o estado atual. Unknown/data inválida/futura continuam desconhecidos;
detail nunca é detector e não se recupera um estado anterior sobre unknown novo.
Aviso datado, layouts, prioridade, filtros e alertas permanecem independentes.

Correção adicional: um único intervalo g entre molduras dos ícones, pontos,
cápsulas e divisória, medido por bordas visuais, não caixas invisíveis. A medida
inicial por frame foi refinada para incluir0,3pt externos do contorno0,6pt.
O tamanho158×158 não comportava três intervalos originais e duas linhas legíveis.
Foi autorizada a menor flexibilização: mover somente os pontos quando faltar
altura. Regra central quotaSummaryLayout: g é o menor entre o intervalo visual
original e (espaço entre ícone/divisória menos altura dos pontos e altura mínima
legível da cápsula)/3. O mínimo proporcional é15,5*(largura útil/146 limitada a1).
Não há teste por modelo/tamanho nem offsets mágicos. Ícones/divisórias/tarefas
e geometria horizontal dos23pontos preservados; só a posição vertical dos pontos
pode ceder ao encaixe, sem alterar frações/cores/datas.

Medidas locais finais:158×158 g=2,869824pt nos três intervalos, cápsula15,075342pt,
pontos1,209682pt acima do anterior.158×170 e170×170 g=4,019773pt, cápsula16,478628pt,
sem mover pontos. Tipografia de referência146pt: número7,5pt bold, rótulo4,5pt,
data4,2pt, escalados igualmente pela largura útil. Duas linhas centradas nas duas
cápsulas simétricas, com corpo menor que a altura disponível. O contorno centrado
é o modelo geométrico de stroke; raster nativo ainda não confirmado fisicamente.
Regra de projeto: centralizar espaçamento repetido em um token mensurável,
verificar bordas visuais e documentar qualquer flexibilização de encaixe.

Regressão física1.6.12 reportada: percentual virou reticências apesar do saldo
mantido na escala. O teste aproximado Arial não previu a compressão nativa.
Removida largura numérica calculada por média de glifos: valor passa a usar
[fixedSize horizontal](https://scriptingapp.github.io/guide/View%20Modifiers/fixedSize)
e [layoutPriority1](https://scriptingapp.github.io/guide/View%20Modifiers/layoutPriority),
sem frame.width estimado. Texto auxiliar tem prioridade0 e pode reduzir antes
dos dígitos; mesma regra para contagem. Teste estrutural inclui8%, unknown,
zero e inteiros longos, preservando os dados. Confirmação física ainda pendente.
Captura Library identificada corretamente, mas materialização oficial falhou
em Windows os.setxattr antes de instalar o arquivo; sem inspeção própria de pixels.

QA: estados conhecidos/unknown com data recente/antiga/futura/inválida; relógio
dentro do círculo; contraste glifo/círculo5,70:1 e relógio/fundo10,18:1; sem inferir
detail. Igualdade das demais árvores fora das cápsulas/posição autorizada dos
pontos; prioridades e regras globais conservadas. Testes específicos de valores
intrínsecos, três intervalos e alturas, além da suíte Scripting/tipos do núcleo/build.
Comparação pública sintética em validation/historical-circles-comparison-1.6.13.png.
Sem teste físico iOS ou garantia de equivalência das fontes Windows ao SF nativo.

## Blocos, cápsulas e saldo proporcional - Scripting 1.6.12 - 27/10/2026

Regra corrigida no pequeno: título e origem compõem um único bloco com gap
de 1,5 pt, cujo centro vertical coincide com o centro do círculo de status.
O alinhamento isolado do título à referência de ativos separava as duas linhas.
Fontes de título/origem aumentam 10%/15%; origem conhecida tem símbolo colorido
Local roxo, Nuvem azul, Remoto laranja. São procedência, nunca conexão ao vivo.
Origem ausente permanece incerta. Círculos, duas tarefas, prioridade, divisórias,
links diretos, PNG transparente e limites externos dos pontos ficam preservados.

Duas cápsulas simétricas ocupam a reserva existente. Cada uma contém duas linhas
centralizadas: valor destacado com unidade; abaixo, Renova DD/MM HH:mm para a
cota e Até DD/MM HH:mm para a expiração comprovada do crédito único. Datas usam
o fuso local do widget; mudança de ano inclui ano. A quantidade usa a mesma
tipografia do percentual, sem atribuir a ela uma cor de saldo de cota. Ausência
de quantidade/data conserva fallback; múltiplos créditos não recebem expiração
singular inferida. Não há renovação redundante fora das cápsulas.

Diagnóstico do relato de 8%: a versão anterior já acendia dois pontos com saldo
atual; o cinza integral com indicação Antigo vinha da neutralização após 15 min,
não de arredondamento a zero. Faltava, independentemente, a fração da fronteira.
Agora cada ponto representa 100/23%; a soma pintada é 23*saldo/100. Em 8%, um
ponto completo e 84% do seguinte; máscara à esquerda dentro do quadradinho,
sem barra contínua. Percentual e escala consultam a mesma janela/snapshot e
quotaDots.balanceColor usa o último ponto pintado (vermelho no saldo baixo).
Máscara VirtualNode confirmada na documentação oficial de
[mask](https://scriptingapp.github.io/guide/View%20Modifiers/mask), com quadros
iguais e máscara interna alinhada à esquerda; não altera geometria externa.

Saldo conhecido histórico mantém proporção com paleta atenuada. Informação
ausente/futura permanece neutra. No pequeno, o aviso único Há dados históricos
com data/hora substitui os badges Antigo repetidos: libera largura dos títulos
sem fingir atividade atual. Círculos históricos seguem desconhecidos e a
acessibilidade conserva a data original. Nenhum timestamp é renovado no cache.
Créditos antigos continuam desconhecidos; não há contagem histórica apresentada
como disponível. Médio/grande mantêm as demais árvores, com escala fracionária.

QA: três dimensões pequenas, igualdade de centros e posições preservadas,
simetria/tipografia/cortes, 0/1/muitos/ausente, datas locais e virada de dia,
frações mínimas/8/9/fronteiras/50/100, futuro/desatualizado/ausente, janelas
independentes, Pergunta/aprovação, igualdade de fontes/dados/coletor com1.6.11.
Comparação pública usa somente dados sintéticos e árvores TSX compiladas;
fontes e símbolos Windows aproximados. Sem teste físico iOS ou SDK completo.
Pixels do mockup Library original não foram materializáveis por falha técnica
Windows os.setxattr; implementação segue os pedidos textuais explícitos.
Nenhum coletor, permissão, Storage, Keychain, pareamento ou fonte nova alterado.
Offline: a fonte deixa de receber observações quando o produtor não está ativo;
o cache existente preserva títulos e datas, mas o TTL elimina certeza de estado
atual. Não implementado serviço permanente nem fallback autenticado ChatGPT.

## Créditos reais no produtor privado - Scripting 1.6.11 - 27/10/2026

O método account/rateLimits/read já usado pelo coletor fornece o objeto
rateLimitResetCredits no CLI instalado0.165.0-alpha.1.2. O diagnóstico somente
leitura confirmou o contrato gerado desse CLI. O mapeamento agora preserva
availableCount em resetCredits.availableCount, junto da data da observação
e fonte Codex App Server account/rateLimits/read. Nunca conta elementos da
lista credits, que pode vir ausente ou truncada conforme o schema nativo.
Ausência/null/formato inválido conserva o fallback desconhecido da UI.

Expiração só é convertida de Unix segundos para ISO quando availableCount=1,
credits contém exatamente um item, status available, resetType codexRateLimits
e a data numérica é válida. Não agrega datas de vários créditos nem atribui
expiração observada numa lista parcial ao saldo completo. Sem associação
exata, expiresAt fica null. A UI já existente recusa observações futuras,
antigas ou expiradas. Créditos de consumo balance/hasCredits e renovação
de Window.resetsAt não são fonte da quantidade de redefinições.

Proteção pública aplicada antes de habilitar o produtor: publicSnapshot usa
lista explícita somente de schema/datas/coverage e arrays tasks/windows vazios,
sem espalhar o objeto privado. resetCredits, unreadCounts e campos pessoais
futuros não entram nessa projeção. Ela é preparada antes de qualquer escrita.
O saldo real segue somente em data/scripting.json no repositório privado já
usado pelo coletor. Nenhum valor real da conta, ID de crédito ou expiração
pessoal é incluído nos testes, fixtures ou registro público.

Mudança operacional: atualizar por fast-forward o checkout limpo da branch
scripting que o agendamento existente realmente executa e reiniciar a mesma
tarefa. Não executar instalador, criar tarefa, copiar token ou pedir grant.
A verificação de implantação deve confirmar leitura privada atual e ausência
do campo no snapshot público; sua evidência fica privada. UI/contratos1.6.10
preservados byte a byte, exceto manifesto1.6.11 para rastreabilidade.

QA sintético: ausente/null/inválido/zero/plural, contagem oficial com lista
parcial, detalhes nulos, associação única, tipo/status desconhecido, datas
inválidas/múltiplas, expiração/stale/futuro, metadados mínimos e allowlist
pública. Suíte Scripting, tipos do núcleo e build; sem resgatar crédito,
consulta de conteúdo de conversa, credencial ou permissão nova. Não há
teste físico iOS. Evidência pública sem valores pessoais:
validation/reset-credit-producer-1.6.11.json.

## Opção 1 - cota e redefinições - Scripting 1.6.10 - 27/10/2026

Pequeno 2×2: a antiga linha de resumo dá lugar a duas colunas compactas,
Limite da cota / % restante à esquerda e Redefinições / quantidade à direita.
Uma terceira linha discreta Renova ... conserva a data da janela de cota.
Quantidade desconhecida é —, nunca zero ou um inferido. Os quatro links
HTTPS, ícones/PNG,23 pontos, duas tarefas completas, origem/estados/prioridade,
divisórias e suas posições permanecem iguais. Árvores médio/grande idênticas
à 1.6.9. Nenhum botão inferior foi introduzido.

Fonte real verificada: o produtor scripts/scripting-model.cjs, schema 2 e
merge anterior só tinham windows com resetsAt e nenhum saldo/validade de
créditos. A captura anterior e o 1 disponível do mockup não são observações
atuais de máquina. Não foi criado leitor autenticado, permissão, token ou
novo acesso. Nenhuma redefinição foi consumida nem conta modificada.
Com as fontes atuais, a quantidade mostrada é sempre —.

Contrato aditivo preparado: resetCredits?: {availableCount: inteiro seguro
não negativo, observedAt: data ISO, source: texto não vazio, expiresAt?: ISO|null}.
Validação descarta a observação opcional inválida sem rejeitar snapshots
schema 2 anteriores. Cada fonte pode trazer uma observação, e o merge mantém
a mais recente por observedAt independentemente da janela de cota. A UI só
aceita saldo observado há até15min, sem horário futuro e sem validade expirada.
0 disponíveis só aparece quando zero vem explicitamente numa observação
válida; 1 disponível e plurais são formatados sem contagem ilustrativa fixa.
Window.resetsAt continua significando apenas renovação automática da cota.
O produtor existente NÃO preenche resetCredits; falta fonte autorizada
confiável para o saldo real. Isso não impede o fallback honesto da UI.

Referência: libfile_6e57b70b2ba881918f2dc1bd8a18c892, opção 1 descrita pelo
usuário/pai e texto obtido por Library image read. A imagem original não foi
inspecionada em pixels: materialização oficial não instalou arquivo local
porque os.setxattr não existe neste Windows. Não foi remendado o helper ou
usado download alternativo. Portanto não se declara equivalência pixel a pixel.
PNG comparativo antes/depois e galeria zero/um/muitos usam árvores TSX reais,
assets existentes e dados sintéticos; fontes Windows/SF Symbols aproximados.
Arquivos validation/quota-reset-columns-comparison-1.6.10.png e
validation/quota-reset-columns-fixtures-1.6.10.png. Evidência numérica e
limites: validation/quota-reset-columns-1.6.10.json.

Testes: ausente/0/1/muitos/quantidade longa, plural, inválido/stale/futuro/
expirado, schema anterior, merge independente, falta de janela, percentual0,
renovação visível, limites sem sobreposição nos pequenos158×158/158×170,
tarefas/divisórias/ícones/pontos iguais e árvores maiores iguais. Suíte,
tipos do núcleo e build local. Sem teste físico iOS; SDK completo indisponível.

## Pequeno 2×2 com duas tarefas - Scripting 1.6.9 - 27/10/2026

Pedido: reduzir somente o pequeno de três para duas tarefas e espelhar as
métricas de nome/sigla/ícone/linha do Popular/Ativos. Fonte pública confirmada:
Sagittaryuz/popular-scripting main, commit 765dc09480b4a0e508b6e80d38f426f5fd0adf32,
script.json 0.2.13. Trechos de draw.js e Label de view.tsx preservados em
validation/popular-small-reference-0.2.13.json. Nenhum arquivo do Popular foi
alterado. Uma cópia local antiga recusou leitura; ela não foi usada como fonte.

A fonte define coluna 146, linha 36, gap 2/3, ícone 26, texto em x30;
nome 10 semibold branco, caixa 17/min8; sigla 6 regular #96969C, y28,
caixa 8/min5. Escalas horizontal/tipográfica e vertical são as da referência.
O círculo mantém diâmetro 26×scale, igual à largura do ícone do ativo,
e permanece circular; seu centro usa a mesma posição vertical da referência.
As tarefas ocupam as duas posições inferiores da grade Popular. Divisória
no centro exato e outra entre tarefas, com espessura e limites da fonte.
Cabeçalho e posições das quatro URLs diretas, ícones, pontos e cotas intactos.
O intervalo depois do cabeçalho até a divisória central fica vazio.

158×158: margens 8, diâmetro25.2877, título9.7260, origem5.8356;
linha35.0137, passo35.6621; divisórias y79 e114.6621; vazio y73.65..79.
158×170: margens6, diâmetro26, título10, origem6;
linha37.9726, passo38.6758; divisórias y85 e123.6758; vazio y74.65..85.
As dimensões são pontos lógicos, não medições de captura física.

Somente slice de exibição passa a duas no pequeno. A ordenação anterior
foi preservada, todos os registros continuam no snapshot/tela. Médio/grande
mantêm três tarefas e árvores nativas completas idênticas à 1.6.8. Pergunta,
aprovação, demais estados, stale, cápsulas, fontes de dados e pareamentos
preservados. Nenhuma informação de redefinições foi implementada.

Testes executam os trechos capturados do Popular independentemente das
fórmulas Codex e comparam posições/fontes/cores dos nós reais. Incluem dois
pequenos, títulos longos/truncamento, prioridade/contagem0/1/2/100, estados
atuais/antigos, cabeçalho igual e árvores completas médio/grande iguais.
Comparação lado a lado: validation/small-two-tasks-comparison-1.6.9.png,
gerada das árvores reais dos dois projetos com dados sintéticos. Fonte
Windows, SF Symbols e Canvas aproximados; não é screenshot nem teste iOS.
Relatório: validation/small-two-tasks-1.6.9.json. SDK nativo completo continua
indisponível; build local é validação de sintaxe/bundle, tipos do núcleo separados.

## Hotfix dos quatro destinos - Scripting 1.6.8 - 27/10/2026

Relato físico: tocar os quatro ícones abre apenas Scripting. A versão instalada
não foi confirmada; 1.6.7 publicada é hipótese principal. Diff comprova a
regressão arquitetural introduzida: quatro Link antes diretos passaram a
exigir run URL -> index/onResume -> consulta -> Safari.openURL. O ponto
exato da falha nativa não foi reproduzido neste executor Windows sem runtime
ou logs do iPhone. Documentação confirma as assinaturas usadas; não há erro
de encoding, query, nome ou precedência da configuração comprovado.

Solução mínima autorizada: header.tsx restaurado byte a byte do commit
5e1330c (1.6.5), incluindo os quatro destinos HTTPS e todo o visual. Novos
links dispensam Script.name/run URL, parsing, index/onResume, consulta e
Safari.openURL em código. Handlers antigos ficam só por compatibilidade
com timelines antigas. Tarefas/ControlWidget e abertura normal preservam
refresh existente. Os quatro Link diretos NÃO executam refresh adicional.
PNG transparente, pontos, Pergunta, fontes, Storage/Keychain e rodapé sem
botão foram preservados. Nenhuma redefinição foi acionada.

Falha na validação anterior: mocks substituíam createRunURLScheme e Safari,
e invocavam index/onResume diretamente. Não executavam o parser nativo nem
o handoff real entre apps. Sucesso dos mocks não comprovou funcionamento
físico da rota; este registro separa o diff confirmado do mecanismo nativo
que segue desconhecido. A correção restaura o caminho anterior em vez de
publicar outra hipótese de redirecionamento.

Configuração informada pelo pai: Abrir App selecionado, Atalho 1–4 vazios.
Library libfile_a2b7d5fa090881919bab54b27ae1cf25 e
libfile_cc385e3c3c4081919d12859c2b8bbca3. Isso não prova sobreposição de
Link internos. Docs Link dizem que widgetURL é ignorado quando há Link,
mas não esclarecem precedência das opções do editor. O código usa quatro
Link e três Button/AppIntent, sem widgetURL global. Não foi solicitada
mudança de configuração nem criação de quatro atalhos externos.

Teste novo: fonte do header idêntica a 1.6.5, bundle real em quatro dimensões,
quatro tokens finais via Node URL, sem acesso permitido a Script, consulta,
timers ou reload no harness. Estado frio/aberto/rede pendente/rejeitada são
cenários simulados; parser nativo e handoff iOS não foram executados.
Suíte Scripting, tipos do núcleo e build de 22 arquivos passaram. Sem teste
físico do hotfix ou confirmação da versão instalada. Evidência:
validation/direct-shortcut-hotfix-1.6.8.json. Notas 1.6.7 abaixo são históricas;
a estratégia intermediária foi retirada dos quatro ícones.

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
