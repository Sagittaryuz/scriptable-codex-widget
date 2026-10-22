# Codex no Scriptable

Também disponível no **Glance**, com abertura geral do ChatGPT e coleta a cada
hora: veja [instruções do Glance](glance/README.md).

Widget privado para iPhone, com títulos e origem das últimas tarefas do Codex,
ordenadas por atividade recente. Usa a imagem de fundo original do Popular.

| Widget iOS | Scriptable | Tarefas |
|---|---|---:|
| 2×2 | Pequeno / small | 4 |
| 4×2 | Médio / medium | 4 |
| 4×4 | Grande / large | 8 |

No pequeno, os textos ficam compactos e títulos longos são truncados para caber.
No grande, as oito tarefas aparecem em uma coluna, como na referência.
Tarefas ativas têm indicador estático de atividade, sem animação.
Conversas comuns do ChatGPT não entram na lista. Fixadas seguem a mesma ordem
de atualização das demais, sem prioridade artificial.

## Instalar pelo iPhone

1. Abra [Codex-Auto.js](https://github.com/Sagittaryuz/scriptable-codex-widget/blob/main/Codex-Auto.js)
   conectado à sua conta GitHub. Use **Raw** e copie somente o código.
2. No Scriptable, crie um script chamado **Codex-Auto** e cole o carregador.
3. Execute uma vez no app. Cole um token fine-grained do GitHub no campo seguro:
   Resource owner **Sagittaryuz**, repositório **scriptable-codex-widget**,
   Repository permissions → **Contents: Read-only**. Confira a validade.
   O token é salvo apenas no Keychain. Não envie o token pelo chat.
4. Escolha a prévia do tamanho desejado. Adicione um widget Scriptable à tela
   inicial e selecione **Codex-Auto** em **Script**.
5. Deixe o parâmetro vazio. O tamanho é detectado automaticamente.

Para visualizar no app, os parâmetros opcionais `small`, `medium` e `large`
selecionam o tamanho. No widget, sempre prevalece o tamanho real do iOS.

## Código, dados e atualização

- Código: o carregador busca **Codex.js** na branch **main** do repositório privado
  em cada execução. Valida URL fixa, HTTP, identidade, tamanho e sintaxe.
- Recuperação: só substitui `codex-github-last-good.js` depois de executar sem erro.
  Se o download ou a execução falhar, tenta o último código funcional.
- Dados: **data/tasks.json** é um snapshot privado publicado a partir da ferramenta
  **list_threads** do Codex. O Scriptable consulta esse arquivo separadamente e
  conserva `codex-tasks-last-good.json` se a rede/dados falharem.
- Conteúdo exportado: identificador, título, origem, rótulo do host, estado e horário
  de atividade de até 20 tarefas. Sem mensagens, resumos, diretórios ou credenciais.
- O rodapé mostra a hora de geração do snapshot, **Offline** quando usa cache e
  **Desatualizado** depois de 30 minutos. A consulta ao GitHub não torna um snapshot
  antigo mais recente.
- O widget solicita nova execução após 5 minutos; o iOS decide a frequência real.
  [Documentação oficial do Scriptable](https://docs.scriptable.app/listwidget/).
- Tocar em qualquer área do widget abre o aplicativo ChatGPT pelo link
  `chatgpt://`. Esse destino não seleciona uma conversa específica.
- O Scriptable solicita nova execução após 5 minutos e o iOS decide quando ela
  ocorrerá; o toque não é usado como atualização manual.

O Scriptable não recebeu acesso à sessão do ChatGPT. A lista precisa ser
republicada por uma coleta no Codex. Até uma automação ser autorizada e criada,
a atualização é manual: peça **atualize as tarefas do widget Codex** nesta conversa.
O primeiro snapshot real já está no repositório. Nenhuma automação recorrente
está implícita na instalação do carregador.

## Atualizar o snapshot no Codex

1. Execute `list_threads` com `limit: 50`. Combine `pinnedThreads` e `threads`;
   o script filtra apenas `kind: codex`, remove duplicatas e ordena `updatedAt`.
2. Acrescente `collectedAt` com o horário ISO real em que a coleta terminou.
   Salve o JSON completo em um arquivo temporário fora do Git. Não envie
   esse arquivo ao GitHub nem ao backup.
3. No checkout validado deste repositório, execute:

```powershell
node scripts/publish-snapshot.cjs caminho-list_threads.json --push
```

O publicador usa a sessão segura do `gh`, verifica remote/branch, envia apenas
os metadados permitidos via API de conteúdo do Git e confere o arquivo remoto.
Se algum host/fonte estiver indisponível, preserva o snapshot anterior e falha.
O envio cria um commit de dados; não altera o código. Depois, `git pull --ff-only`
alinha o checkout quando não houver mudanças locais. A publicação não altera
o arquivo local rastreado: evite confundir o momento de publicação com a coleta.

Uma automação nesta conversa pode executar esse procedimento a cada 15 minutos,
se autorizada. Depende do Codex no computador, da sessão GitHub e da rede e consome
uso da conta. O iPhone lê a última publicação mesmo com o computador desligado,
mas novas tarefas só aparecerão após nova coleta.

## Desenvolvimento e verificação

```powershell
git clone https://github.com/Sagittaryuz/scriptable-codex-widget.git
cd scriptable-codex-widget
node scripts/build.cjs
node scripts/test.cjs
```

Sem dependências para gerar o script ou executar testes. `Codex.template.js` é a
fonte editável; `scripts/build.cjs` incorpora o PNG original em `Codex.js`.
Os testes simulam as APIs do Scriptable; não substituem execução nativa no iPhone.
`validation/result.json` registra o resultado. Prévias são simulações, não capturas
de um iPhone. Confira cortes, tipografia e toque no aparelho após instalar.

Diagnóstico do carregador: `codex-auto-diagnostic.json`, no armazenamento local
do Scriptable. Para token inválido ou sem permissão, execute no app e escolha
**Trocar token**. Nenhuma credencial está incluída neste repositório.

Rollback: reverta o commit de código no GitHub; o carregador mantém a cópia local
funcional até conseguir executar a versão corrigida. Git é a fonte de atualização;
o pacote com Git bundle no Drive serve apenas como backup recuperável.
