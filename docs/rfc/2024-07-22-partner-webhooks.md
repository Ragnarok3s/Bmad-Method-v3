# RFC-2024-07-22-PARTNER-WEBHOOKS — Estratégia de retries para integrações

## Contexto
Integrações com parceiros de lavanderia e manutenção utilizam webhooks síncronos. Durante testes de carga observou-se 2% de falhas por timeout, exigindo definição de política de retries resiliente.

## Decisão a Tomar
- Definir janela e backoff de retries para cada parceiro.
- Estabelecer responsabilidades de monitoração e comunicação em incidentes.

## Opções
1. **Retries automáticos (exponencial)** — 3 tentativas com backoff exponencial (10s, 30s, 60s).
2. **Retries híbridos** — 2 tentativas automáticas + acionamento manual via runbook.

## Dados de Suporte
- Relatório de falhas coletado em `docs/integracoes/2024-07-03-smoke.md`.
- Runbook `docs/runbooks/monitoracao-webhooks-parceiros.md` requer atualização conforme decisão.

## Responsáveis
- **Owner**: Gabriela Nunes (Parcerias).
- **Apoiadores**: Thiago Ramos (Facilities), Bruno Carvalho (Platform Engineering), Privacy Officer.

## Próximos Passos
1. Validar aderência dos parceiros ao modelo proposto até 24/07.
2. Atualizar runbook e dashboards com nova estratégia.
3. Comunicar decisão no canal `#hk-ops` e anexar evidências no board Jira.
