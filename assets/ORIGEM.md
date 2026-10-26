# Fundo original do Popular

## Símbolo ChatGPT transparente - 1.6.5

`header-chatgpt.png` é o PNG 256×256 embutido em
`app/resources/chatgpt-app-dark.ico` do aplicativo oficial instalado
`OpenAI.Codex_26.1021.3705.0_x64__2p2nqsd0c76g0`.
O diretório ICO aponta diretamente para um PNG; esses bytes foram copiados
sem transformação, remoção de fundo, redesenho ou geração de imagem.

- SHA-256 do ICO original: `7c4bd139c305ac4de332c12cf4a3b10184715990afcf48b49f2478fbd1b0e19e`.
- SHA-256 do PNG original/final: `2b001fb1f4e7d76e4d459c2ad8f9739e963ffc1c2137abcfffe8da3ee7775f7c`.
- Alpha 0…255, bordas/cantos transparentes; pixels visíveis RGB 255/255/255,
  incluindo antialiasing, sem matte preto. O ativo anterior era inteiramente
  opaco, com fundo escuro incorporado à referência fornecida.
- `CHATGPT_GLYPH_SCALE=210/254` compensa a margem interna menor do arquivo
  oficial e mantém a largura visual anterior do desenho branco. A escala
  é uniforme e o frame externo permanece igual. Altura visual difere menos
  de um pixel da imagem fonte, sem deformar o logotipo.

Os outros três ícones continuam byte a byte iguais. Provas de integridade:
`validation/header-icons-1.6.5.json` e `validation/chatgpt-alpha-1.6.5.json`.
Logo original pertence à OpenAI; é usado para identificar o atalho ChatGPT.
Referência de marca: https://openai.com/brand/.

Imagem extraída sem modificação de `ICON_DATA['widget-background-v8']` de
`Sagittaryuz/scriptable-popular-widget`, `Popular.js`, commit
`b1325fd8ec676d887a5ba972a1a9a39766f65dd9`.

SHA-256 do PNG: `5d0fc7f05533af6534525cf8f86484028614a01587b717fa7d99836b9c00c094`.
Dimensões: 474 × 474 pixels. É um degradê escuro; a referência de tarefas orienta
os textos e a organização. O fundo solicitado prevalece sobre o cinza da captura.

O carregador foi adaptado de `Popular-Auto.js` 1.4 do mesmo commit.
No Codex, falhar a atualização de código permite tentar a rede para os dados;
os dois caches são independentes. Credenciais nunca fazem parte dos arquivos.

## Símbolo do Codex

`codex-symbol-white.png` deriva do ativo
`webview/assets/codex-app-ga-logo-3e5209898ca3.png` incluído no aplicativo
oficial instalado `OpenAI.Codex_26.1016.8622.0`. Para corresponder à referência
fornecida pelo usuário, foram preservados o contorno da nuvem e o terminal `>_`
em branco, removendo apenas o preenchimento colorido. SHA-256 do PNG final:
`283d9f0164bf6526f1d390fd88cb787d9a936fc390fc7c2f68d6cb988e15f732`.
