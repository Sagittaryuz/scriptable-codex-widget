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
