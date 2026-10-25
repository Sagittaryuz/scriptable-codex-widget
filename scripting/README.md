## Atualização 1.5.0

Remove o trapézio e devolve toda a altura ao conteúdo. Margens externas usam o mesmo contrato do Ativos: 8pt acima/abaixo e ajuste horizontal pela mesma largura lógica/escala em cada família. Os quatro quadros crescem para incluir nomes acima dos ícones. Só os ícones navegam; as três tarefas passam a ser botões de atualização de dados, sem abrir os chats. Atualização solicita todas as timelines do Scripting.

Notificações de resposta pronta habilitadas por padrão (chave própria, sem alterar os alertas de pendências). Primeiro snapshot estabelece baseline silencioso; somente mudança observada de estado conhecido para ready, com dados recentes, notifica. Deduplicação, tentativa após falha e opção de desligar. Payload genérico sem título da tarefa. Ao abrir o projeto, agenda uma confirmação de ativação uma única vez; permissão do Scripting/iOS continua necessária. Verificação ocorre nas execuções/consultas; não é push remoto imediato nem garantia de frequência em segundo plano. Pronta significa resposta disponível, não conclusão de todo o projeto.

Testes locais: quatro dimensões, nomes dentro das molduras, margens iguais às do Ativos, três botões de refresh e somente quatro links, dados privados/cache/Cloud, baseline, transição recente, duplicatas, falha de entrega, rejeição de dados antigos e desligamento de avisos. Aparência e entrega de notificações no aparelho pendentes. Coletor, credenciais e demais configurações preservados. Reversão: scripting-v1.4.2.

## Atualização 1.4.2 — atalhos no topo e tarefas ampliadas

Quatro quadros individuais com fundo escuro e borda discreta, cantos arredondados e ícones sem nomes. O início dos quadros usa diretamente a margem superior comum do conteúdo (8pt pequeno/médio, 16pt grande), sem centralização em uma faixa alta. As margens laterais continuam 8/10pt. O raio adapta a referência do Calendar: 52 unidades-base com escala vertical 510/484, convertidas pela largura lógica de 1092. É uma aproximação visual ao perfil iPhone, não um raio universal nativo.

A barra e o texto de redefinição sobem com o cabeçalho. Margem acima da barra de 5pt no pequeno e 8pt nos demais; abaixo, 3/5pt até o resumo branco. Após o resumo, 5/8pt até a área das tarefas. Mantém a barra com a largura dos separadores, cores por percentual e identificação de dados antigos.

As três tarefas ganham alturas iguais no espaço recuperado. No grande, título passa de 13.5 para 15.5pt, metadados de 10.5 para 11.5pt e ícone de 38 para 40pt. Fontes se ajustam proporcionalmente nos tamanhos menores para preservar título, origem e estado. Fundo, rodapé e comportamento de atualização permanecem iguais. Sem novas dependências ou rede no cabeçalho.

Validação local: quatro dimensões, molduras/raios, alinhamento pelo topo, respiros da barra, ganho de altura das três tarefas, cores, fontes dentro das linhas, links, cache e refresh. Build/imports e tipos do núcleo aprovados. Aparência, compilação e toques nativos continuam pendentes de confirmação no aparelho. Prévia com dados ilustrativos.

Atualização pelo Git no projeto existente, preservando Storage/Keychain. Reversão: scripting-v1.4.1.

## Atualização 1.4.1 — barra no centro e ícones ampliados

Remove os nomes visíveis e amplia os quatro ícones, mantendo rótulos de acessibilidade e links. O centro vertical da barra de uso fica exatamente em altura total / 2, incluindo o rodapé. A largura da barra é igual à das duas linhas entre tarefas. Não existe mais separador adicional entre a barra e a primeira tarefa.

Logo abaixo da barra, percentual e redefinição usam texto pequeno branco. A parte preenchida da barra mantém a escala por percentual restante: verde >=70%, azul >=40%, amarelo >=20%, vermelho abaixo de 20%; dados antigos/indisponíveis ficam neutros. A redefinição usa o timestamp real no fuso do dispositivo.

O espaço inferior acomoda as três tarefas com alturas e fontes proporcionais. Metadados de origem continuam visíveis; nos widgets pequenos/médios, a divisão pela metade exige texto bastante compacto. Fundo e trapézio permanecem intactos. Ícones locais de 256px sustentam até 72pt sem novas consultas de rede, com 1MiB somado de pixels RGBA antes de custos do SDK.

Build e regressões locais passaram em quatro dimensões: centro exato, largura, ausência de nomes/divisor extra, quatro faixas de cor, texto branco, janela ausente/antiga, três tarefas sem ultrapassar o footer, links e refresh. Compilação, renderização e toques no iPhone ainda não confirmados. Prévia com dados ilustrativos.

Atualização pelo mesmo Git, preservando Storage/Keychain. Reversão: scripting-v1.4.0.

## Atualização 1.4.0 — quatro ícones e limite compartilhado

Cabeçalho com ChatGPT, Codex, Voice Mode e Dots em quatro colunas iguais. Cada nome fica acima do ícone preparado a partir das referências enviadas. Abaixo de todos, uma única barra mostra o limite do Codex, percentual restante e dia/horário real de redefinição. Os demais atalhos não exibem cotas inventadas. Dados antigos continuam identificados; ausência de limite ou de data não é convertida em zero ou sete dias.

Links diretos: ChatGPT usa https://chatgpt.com/#native; Codex, Voice e Dots mantêm os destinos da 1.3.0. A associação iOS oficial inclui a raiz com fragmento native para uma nova conversa. Os quatro atalhos não executam Scripting. A abertura efetiva em cada função do iPhone depende da associação/configuração do app e ainda não foi confirmada no aparelho.

Mantém exatamente as árvores, posições e margens das tarefas, o fundo Popular e o trapézio. O novo símbolo colorido do Codex substitui o branco somente no cabeçalho, conforme a nova referência. Ícones incorporados de 96px são decodificados uma vez por execução, sem requisições de imagem; cerca de 46KB em PNG e 144KiB de pixels RGBA somados. Nenhuma dependência foi adicionada ao projeto.

Build e testes locais passaram em quatro dimensões, incluindo largura das quatro colunas, ordem nome/ícone, barra compartilhada, links, data real no fuso de São Paulo, integridade dos assets e regressões de cache/refresh/Cloud. A comparação com a árvore anterior confirma tarefas, fundo e rodapé intactos. Compilação, tipografia e toques nativos continuam pendentes de validação no iPhone. Prévia com dados ilustrativos não é captura do aparelho.

Atualize o projeto Codex existente pelo mesmo Git, preservando Storage/Keychain. Reversão: scripting-v1.3.0. Coletor, homepage e outros widgets mantidos.

## Atualização 1.3.0 — cabeçalho com três atalhos

Implementa a opção visual 1 escolhida: Codex com limite/barra e data real de redefinição; ChatGPT Voice em ciano; Dots em roxo, lado a lado. A célula do Codex recebe mais largura para conservar a leitura. Mantém a altura original do cabeçalho e todas as dimensões, conteúdo, posições e links das tarefas; fundo, símbolo Codex e trapézio originais intactos.

Destinos diretos via Link, sem executar Scripting: https://chatgpt.com/app/codex , https://chatgpt.com/voice e https://chatgpt.com/dots . A associação iOS oficial servida pelo CDN Apple inclui /app/*, /voice e /dots para com.openai.chat. O wrapper /app/codex respondeu HTTP 302 para https://chatgpt.com/codex. Evidência pública limitada em validation/header-shortcuts-1.3.0.json. A confirmação dos destinos em um iPhone ainda está pendente; a associação e o redirect não são um teste físico e preferências do iOS podem afetar a abertura.

A primeira célula conserva dados reais do snapshot, cor por limite e estado antigo. O rótulo de reset usa o timestamp verdadeiro no fuso local (exemplo ilustrativo: Sex., 19:32), em vez do arredondamento para dias. No tamanho pequeno, o percentual fica compacto; o rótulo de acessibilidade conserva o significado completo. Voice e Dots são somente atalhos, sem percentuais inventados.

Testes locais: build/imports, quatro dimensões, três destinos independentes sem scripting://, limites/cores, fonte estimada no cabeçalho, data de reset, cache/offline, ponte Cloud/local e regressões de refresh. A árvore real dos três itens, fundo e footer foi comparada com c5cfa42 e permaneceu idêntica. Tipografia, contornos e toques nativos desta versão ainda exigem confirmação no aparelho. Não há novas dependências, consulta de rede ou coleta adicional no cabeçalho.

Atualize o projeto Codex existente pelo mesmo Git, preservando Storage/Keychain. Reversão disponível na release scripting-v1.2.1. Homepage, coletor Cloud, demais widgets e seus repositórios permanecem independentes.

## Atualização 1.2.1 — preservar dados privados sem a conexão GitHub

Se a API GitHub ficar indisponível na extensão, o widget mantém o snapshot privado anterior. O canal público anônimo não substitui as tarefas guardadas, salvo desativação explícita dos dados privados. Mantém a integração Cloud, o painel separado e o visual da 1.2.0. Regressão exercita indisponibilidade da conexão além de falha de uma consulta.

## Atualização 1.2.0 — Codex Cloud e painel separado

O widget consulta data/scripting.json (locais) e data/cloud.json (nuvem) em paralelo pela conexão privada nativa do GitHub. Mantém datas e caches separados: observar a nuvem não renova estados locais. Consultas simultâneas da mesma instância compartilham a operação; leitura pública tem limite também no corpo. Falha de uma fonte conserva sua última versão sem eliminar a outra. URLs oficiais task_e também aceitas. Filtros de execução/pendência não tratam registros antigos como atuais.

O coletor Cloud está no Git privado Sagittaryuz/codex-widget-private-data; job Linux de até um minuto a cada 30 minutos (13 e 43), sujeito ao agendador e franquia de Actions. Uma execução manual também está disponível no GitHub. Não inicia tarefas/modelos. A nuvem atualiza tarefas e limites sem depender do Windows; tarefas locais conservam a última observação do PC. Refresh do widget busca os dados publicados, não dispara outra coleta.

Autenticação própria autorizada pelo usuário, isolada do desktop. Credenciais em Secrets/cache privado cifrado, sem tokens em código, logs, releases ou backups. Duas execuções GitHub consecutivas aprovadas; a segunda restaurou o cache cifrado, consultou os metadados e verificou a publicação. Revogação, expiração ou perda do cache podem exigir novo login. Não houve teste físico com o computador desligado.

A homepage foi retirada do pacote e movida para o Git privado Sagittaryuz/scripting-home. Este script só publica um resumo local limitado em Storage shared: total, limite e até oito tarefas com estado/data. Não importa o painel nem outro motor. O armazenamento compartilhado é acessível aos outros scripts instalados; notas, mensagens e credenciais não são incluídas. Alertas e publicação local ocorrem antes de Widget.present encerrar o contexto. Visual, fundo, símbolo e trapézio intactos e comparados com a base.

Testes de sintaxe, transporte, privacidade, falhas parciais, anti-regressão temporal, cache, deduplicação, filtros, links, layout e footer aprovados. Aparência/toques físicos desta versão pendentes. Atualize pelo mesmo projeto; instale Meu Painel separadamente.

## Atualização 1.1.9 — fundo do Popular e círculos explícitos

Restaurado o mesmo PNG de fundo do widget de ativos, cobrindo toda a área, e a mesma cor-base #1E1E1E. Arquivos comparados diretamente: bytes idênticos, SHA-256 5d0fc7f05533af6534525cf8f86484028614a01587b717fa7d99836b9c00c094.

Cada tarefa agora tem ZStack com Circle nativo preenchido e o SF Symbol branco por cima. Não depende mais de background/shape no componente Image, que não produziu o círculo esperado no aparelho do usuário. Cores seguem estado real: pronta azul, ociosa cinza, erro vermelho e demais cores existentes; dados antigos continuam neutros. Não inventa estado para reproduzir a referência.

Símbolo do Codex e refresh-footer.tsx preservados. Testes de estrutura real confirmam três círculos, cores por estado e símbolos brancos; verificações de links, geometria, consulta/cache e recarga aprovadas. Resultado visual físico desta correção ainda pendente.

## Atualização 1.1.8 — composição da imagem de referência

Cabeçalho com símbolo atual à esquerda e coluna à direita com Codex em negrito, limite, barra larga arredondada e reinício. Três tarefas com ícones circulares, título/origem/estado, etiquetas de estado em cápsula e chevron. Fundo escuro e separadores no cabeçalho/entre tarefas; não há separador depois da última tarefa. Pequeno/médio/grande adaptam fonte e densidade à área disponível.

O símbolo em codex-symbol.ts e refresh-footer.tsx foram preservados sem mudanças de conteúdo. Trapézio, base, horário e atualização global permanecem iguais. A referência visual substitui o contrato anterior de margens iguais ao Popular; os dados e links não mudam. O 64% e os estados da imagem não são fixados no widget: continuam vindo do snapshot real, e dados antigos mantêm indicação de idade.

Testes locais: sintaxe/importações, quatro dimensões, três linhas/cápsulas, links, estados atuais/antigos, preservação do símbolo/rodapé, consulta/cache e recarga. Comparação Canvas local com o mesmo estado visual da referência, usando dados de demonstração; fontes/ícones aproximados nessa prévia. Renderização e toque físicos desta versão pendentes. Referência e capturas com nomes de tarefas não são publicadas no Git.

## Atualização 1.1.7 — mesmas margens do Popular

O conteúdo passa a usar o mesmo contrato geométrico do Popular: largura lógica 146/304 e altura 146/201 conforme tamanho, mesma escala limitada pela área acima do trapézio e margens simétricas. Título, limites e três tarefas são redistribuídos dentro desses limites. Fontes e hierarquia do Codex preservadas proporcionalmente; rodapé e dados continuam iguais.

Testes da árvore real em quatro dimensões comparam larguras, alturas e margens à fórmula do Popular, preservam links e ausência do separador final. Consulta/cache/recarga continuam cobertos. Visual e toque físicos desta versão ainda pendentes.

## Atualização 1.1.6 — centralização e texto do rodapé

Data/hora deslocada 2 pontos para baixo: centro vertical da área pintada de 17 pontos (trapézio de 13 + base de 4). Texto passa de 8,5 para 9,5 pontos; forma, gradiente, largura e altura do trapézio preservados. A área de toque acompanha o rodapé inteiro central.

Conteúdo centralizado entre o topo do widget e o topo da faixa pintada, com margens superior/inferior iguais. A última linha divisória abaixo da última tarefa foi removida; separadores entre tarefas permanecem.

Atualização global mantém Widget.reloadAll(). Testes locais de consulta/cache, chamada global, formato/fuso, centro do texto, margens iguais, links e dimensões aprovados. Não existe recibo remoto que comprove a simultaneidade do toque nos três widgets físicos. Codex usa horário da coleta publicada; Popular, horário da consulta, preservando observações por indicador.

## Atualização 1.1.5 — espaço recuperado e recarga global

Reserva inferior reduzida de 36 para 23 pontos: devolve 13 pontos ao conteúdo. Trapézio mantém altura 13 e cantos curvos; os 4 pontos abaixo dele, até a borda inferior e nas laterais, usam a continuação do mesmo gradiente. Não pinta a faixa toda acima dessa base.

O botão consulta os dados deste projeto e, em seguida, usa Widget.reloadAll() para solicitar a recarga de todos os widgets criados no Scripting (usuário/desenvolvimento), incluindo Calendar. Botões da Central de Controle também mantêm sua recarga existente. A solicitação não impõe execução imediata ao iOS e não invalida caches de outros scripts; cada projeto conserva seu próprio comportamento de consulta. Calendar 0.3.10 remove apenas o ícone de refresh visível, mantendo navegação e caminho de atualização por intenção/atalho.

Data/hora local preservada: Codex indica coleta publicada; Popular indica consulta às fontes. Sem recibo remoto do toque/visual destes dois widgets. Testes locais comprovam chamada global real do helper em vez da API restrita a widgets de usuário, atualização/cache em sucesso e falha, base/gradiente contínuo e redistribuição. Renderização/toque simultâneo em todos os widgets no aparelho ainda pendentes.

## Atualização 1.1.4 — rodapé discreto com gradiente

Trapézio com 13 pontos de altura (antes 26), quatro cantos suavizados com curvas quadráticas, gradiente vermelho #9B2B37 → #521720 e texto cinza-claro menor. Mantém a reserva inferior de 36 pontos e o mesmo botão de atualização. Gradiente desenhado em faixas explícitas sob recorte curvo, sem depender de objetos de gradiente do host.

A data/hora é local: testado UTC 12:05 → 09:05h | 24/10 em America/Sao_Paulo. Codex indica a coleta publicada e conserva sua data ao usar cache; Popular indica consulta, sem substituir as datas reais dos indicadores. Não há recibo remoto do toque nesses dois projetos. A execução no aparelho e o horário visível no dispositivo ainda não foram confirmados remotamente.

Testes locais: consulta forçada por AppIntent, cache/recarga, sucesso/falha, geometria em quatro tamanhos, curvas/gradiente, fuso, formato e data inválida. No Codex, integração da intenção com o repositório e armazenamento reais do projeto, usando transporte nativo simulado. Prévia Canvas local; visual nativo pendente.

## Atualização 1.1.3 — trapézio de atualização

Rodapé centralizado em trapézio, topo mais estreito que a base, fundo vermelho #B3262E e texto cinza-claro #D1D1D6. Mostra HH:MMh | DD/MM e o símbolo de atualizar. Toda a faixa aciona o mesmo AppIntent. Margem inferior reservada de 36 pontos (antes 24); composição, fontes de dados, cores do conteúdo e links preservados, com ajuste de altura para caber nos tamanhos fixos do iOS. Não altera o Calendar.

O horário usa o fuso local do aparelho e representa a coleta dos dados publicados, snapshot.generatedAt; conserva a data antiga quando a rede falha. Não usa a hora de renderização para fingir dados novos. Não há data fixa no produto.

Validação local: formato e virada do ano, data inválida, quatro dimensões, trapézio vermelho e texto cinza, botão sem sobreposição aos links/linhas, atualização e cache offline. Compilação/renderização/toque físicos desta versão ainda pendentes. Atualize o mesmo projeto pelo Git, preservando dados e permissões.

## Atualização 1.1.2 — botão de atualização

Botão pequeno de seta circular no canto inferior direito, usando AppIntent em segundo plano, sem solicitar abertura do app. O botão busca o snapshot mais recente no canal privado autorizado; não executa o coletor do computador. Foi corrigida a descoberta do executável GitHub CLI após desaparecer o atalho do WinGet, causa da publicação parada. O coletor voltou a publicar e a leitura privada confirmou 72% restantes em 24/10/2026; esse número não é fixado no código. O computador precisa continuar ligado e conectado para gerar novas observações.

Os widgets solicitam atualização após 1 minuto por padrão. O campo Parâmetro não altera a frequência. Codex/Popular permitem selecionar 1, 5 ou 15 minutos nas preferências do projeto. O iOS decide quando executar; a solicitação de 1 minuto não garante execução nesse intervalo. O botão pede dados atuais disponíveis e recarrega mesmo em falhas, preservando caches. Não altera o código instalado.

Testes locais de intenções, consulta forçada, sucesso/falha e geometria aprovados. Toque, renderização e execução nativa desta versão no iPhone/iPad ainda precisam de confirmação. Atualize o mesmo projeto pelo Git, preservando dados, permissões e pareamento.

# Codex no Scripting

**Atual: 1.1.1 — Scripting Pro.** Lista e filtros, assistente, alertas, Central de
Controle, painel Início, exportação e canal privado de tarefas/limites. Solicitação
de atualização em 1 minuto. Instalação, ativação, testes e limites: [PRO.md](PRO.md).
As seções de versões anteriores abaixo preservam o histórico; o canal público
atual não contém tarefas nem limites pessoais.

Versão 1.0.9. Widget nativo `widget.tsx`, em TypeScript/TSX. A versão Scriptable e
os widgets Glance existentes não são alterados. A composição segue o código do
[Popular Scripting](https://github.com/Sagittaryuz/popular-scripting/tree/main/scripts/Popular%20Scripting),
commit `d24c9a2b153fc8b7b9733bf123e10382bcd58abd`. O pequeno usa conteúdo central
de 138 pt; os demais usam até 304 pt. Na versão 1.0.8, o cabeçalho passou a uma
única linha com símbolo maior, nome e percentual restante. A janela “Semanal”
não é desenhada. O limite muda entre verde, azul, âmbar e vermelho conforme o
percentual restante, e a altura liberada é distribuída entre as três tarefas.
O PNG do fundo é exatamente o mesmo arquivo da referência, confirmado pelo
SHA-256 `5d0fc7f05533af6534525cf8f86484028614a01587b717fa7d99836b9c00c094`.

| Família | Tamanho pedido | Itens |
|---|---|---:|
| systemSmall | 2×2 | até 3 |
| systemMedium | 2×4 horizontal (4×2 no iOS) | até 3 |
| systemLarge | 4×4 | até 3 |

O tamanho vem do iOS, não de um parâmetro. O cabeçalho usa a janela com menos
percentual restante e mostra símbolo Codex, nome, percentual, barra colorida e
tempo até o reinício. Valores ausentes
aparecem como indisponíveis. Os títulos originais são
preservados e truncados visualmente. As três linhas têm altura uniforme e o
bloco é centralizado; no tamanho grande a altura é limitada para evitar linhas
esticadas. Não há rodapé de atualização. Aprovações, pedidos de resposta e erros
têm prioridade na lista, seguidos por tarefas em execução e demais tarefas.

Na versão 1.0.9, a legenda abaixo de cada título identifica a origem. Os valores
renderizados são `ChatGPT`, `Codex · Nuvem`, `Codex · <máquina>` ou
`Codex · Máquina remota`. No widget pequeno, o estado vem depois da origem; nos
demais tamanhos, o estado continua na coluna direita. O coletor local usa o nome
real do computador, limitado a 40 caracteres e sem caminhos, mensagens ou
credenciais. Como o snapshot está no Git público, esse nome também fica público.

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
Quando a fonte remota não fornece um nome de máquina, o widget informa apenas
`Máquina remota`. A cobertura efetiva aparece no diagnóstico. Não há resumo por IA, previsão de
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

