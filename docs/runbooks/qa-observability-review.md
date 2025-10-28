# Runbook - Revisão de QA e Observabilidade

## Objetivo

Garantir que os alertas provenientes do dashboard `QA-Quality` (`grafana/staging/qa-quality-dashboard.json`) sejam analisados nas cerimônias semanais de QA e no steering mensal descrito em `docs/observability-stack.md`.

## Frequência

- **Daily**: monitoramento dos alertas críticos no canal Slack `#qa-reviews` (configurado em `grafana/alerts/qa-observability.yaml`).
- **Weekly QA Review**: consolidação de métricas e bugs usando `docs/evidencias/qa/bug-dashboard.json`.
- **Monthly Steering**: reporte cruzado com indicadores de privacidade (`docs/evidencias/compliance/privacy-readiness.yaml`).

## Procedimento

1. Abrir o dashboard `QA-Quality` no Grafana e validar:
   - Tendência de cobertura ≥ 75% (unit) e ≥ 60% (integração).
   - Bugs críticos = 0.
   - Contagem de alertas de segurança = 0 nas últimas 24h.
2. Registrar as notas da reunião no template de ata em `docs/atas/`.
3. Caso algum gate falhe:
   - Abrir incidente no Jira com link para o alerta correspondente.
   - Atribuir investigação ao responsável do módulo impactado.
   - Atualizar `docs/revisao-validacao-artefatos.md` com plano de ação.
4. Confirmar que o `scripts/run-quality-gates.sh` está integrado ao pipeline `ci.yml` para bloqueio automático.
