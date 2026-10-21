# Evidência de validação

- 59 verificações automatizadas em `result.json`, executadas em Node com mocks
  das APIs nativas do Scriptable. Cobertura funcional registrada no próprio JSON.
- `preview.png` usa a mesma imagem PNG e textos/estilos produzidos pelo script,
  com renderização aproximada no canvas do Windows. Ícones são aproximações
  vetoriais e a fonte não é a fonte nativa do iOS.
- Conferência de altura estimada para small 155×155, medium 329×155 e large
  329×329 pontos. A renderização nativa ainda precisa ser conferida no iPhone.
- Fundo original extraído de Popular.js: bytes e SHA-256 documentados em
  `assets/ORIGEM.md`; o teste compara a imagem incorporada à imagem original.
- GitHub real: repositório privado, branch main, push e leitura autenticada
  confirmados. O arquivo Codex.js remoto corresponde ao arquivo testado.
- Publicador de snapshot executado contra a API GitHub real, com commit e
  leitura do conteúdo de volta. O fluxo publicar → pull foi conferido.
- Horário do snapshot preserva a coleta, sem avançá-lo ao republicar dados antigos.
- Não foram executados testes no Scriptable/iPhone, instalação de widget,
  abertura de tarefa individual, garantia de refresh do iOS ou automação agendada.

O backup contém fonte, instruções, arquivo final e Git bundle verificável,
sem o arquivo temporário bruto de list_threads e sem credenciais.
