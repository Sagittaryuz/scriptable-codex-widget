# Codex no Glance

Extensão do projeto existente, sem alterar o widget Scriptable.

- Conta escolhida pelo usuário: conexão **Glance**.
- 2×2: quatro tarefas; 4×2: quatro tarefas; 4×4: oito tarefas.
- Tarefas reais de `list_threads`, normalizadas pela mesma política do Scriptable:
  só Codex, sem duplicatas, ordem decrescente de atividade recente.
- Toque no bloco: `chatgpt://`, abertura geral do aplicativo, sem selecionar tarefa.
  Não há fallback configurado para site. Aceitação pelo Glance não substitui teste
  de abertura no iPhone, que ainda precisa ser confirmado.
- O botão de recarregar que o próprio Glance sobrepõe continua sendo do Glance.
- Fundo nativo `#1E1E1E → #0D0D0D`, aproximando o degradê original do Popular.
  O original contém oito paradas; o componente Glance oferece duas. Não alegamos
  identidade de pixels. Nenhum asset privado foi tornado público.
- O rodapé relativo mostra a idade da **coleta**, não a hora de abrir o widget.
- Sem API do ChatGPT ou chave de escrita no layout.

## Atualizar os três widgets

Colete `list_threads` com limit 50 usando a ferramenta do Codex. Registre o horário
ISO real da coleta em `collectedAt` e salve o JSON temporariamente fora do Git.

```powershell
node glance/build.cjs caminho-list_threads.json
```

Para cada tamanho, leia `glance/generated/<size>.json` e envie o `content` usando
**Glance ingest**, a conexão escolhida, `feed_id` e `template_id` reais registrados
em `widgets.json`. Não faça POST com chave de escrita. Campos enviados devem ser
exatamente os bindings do layout. Não envie o JSON bruto de `list_threads`.

Os layouts e o gerador vêm deste Git. Mudanças de código/layout e atualizações de
dados são operações distintas. Gerar JSON local não atualiza o Glance: confira
`get_widget_status` depois do ingest.

A coleta automática foi autorizada pelo usuário e criada nesta conversa:
**Atualizar widgets Codex no Glance**, ID `atualizar-widgets-codex-no-glance`,
ativa, a cada hora. É uma automação do **Codex**, não um conector nativo do Glance.
Depende do computador, Codex, rede e sessão conectada; consome uso da conta.
A criação e o primeiro envio manual foram confirmados; a primeira execução
agendada ainda não ocorreu durante esta entrega.

A automação pode usar `node glance/build.cjs caminho-list_threads.json --stdout`
para obter somente os conteúdos, sem modificar arquivos rastreados. Ela chama
ingest pelo plugin e verifica o status dos três widgets. Se a coleta falhar,
preserva os dados anteriores. Recarregar o widget lê o último envio; não consulta
o Codex. O iOS determina quando redesenhar o widget depois do envio.

## Instalar no iPhone

1. Abra Glance usando a mesma conta da conexão **Glance**.
2. Na tela inicial do iPhone, mantenha uma área vazia pressionada, toque em
   Editar → Adicionar Widget e procure **Glance**.
3. Escolha Pequeno, Médio ou Grande. Toque no placeholder → **Select Widget** e
   selecione o Codex do tamanho correspondente.
4. Toque na lista para conferir a abertura do ChatGPT. Verifique os quatro/oito
   títulos, cortes, origem e rodapé no aparelho.

Fonte do fluxo: https://glance.cool/docs/pin-widget.
