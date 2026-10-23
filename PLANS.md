# Melhorias Scripting Pro — 23/10/2026

Escopo aprovado: preservar widget; lista completa e filtros; consultas pelo assistente;
alertas sem repetição; dados pessoais em Git privado; Central de Controle;
painel Início integrado; preferências exportáveis sem credenciais.

Arquitetura: manter TSX nativo. Git público distribui código e snapshot sem tarefas;
Git privado distribui metadados por API GitHub autenticada do Scripting.
O coletor local continua sem inferência e não passa a controlar o runtime desktop.
Push usa chave send-only armazenada por DPAPI no Windows, configurada pelo proprietário.

Aceite: testes de estados, expiração, rede/cache, privacidade, transições de alertas,
falhas/repetição e entradas inválidas; sintaxe de todos os pontos de entrada.
Tipos, permissões, toques, Home e recebimento de push exigem iPhone conectado.
Publicação autorizada nas branches existentes, com release e rollback.
