# Ata – Observability Standup
- **Data/Horário**: 05/07/2024 16:00 BRT
- **Facilitador**: Thiago Ribeiro (Observability Lead)
- **Participantes**: Ana Souza (SRE), Pedro Barros (DevOps), Júlia Martins (Analytics), Rafael Nogueira (QA Lead)

## Agenda
1. Revisar alertas ativos e cobertura de dashboards
2. Validar métricas obrigatórias para Sprint 0
3. Planejar integração de logs com pipelines CI/CD

## Decisões
- Dashboard de readiness será publicado em `docs/metricas-kpis-dashboard.md` até 08/07 com métricas de ambientes, integrações e qualidade. (Owner: Júlia Martins — Due: 08/07/2024)
- Alertas críticos de disponibilidade serão configurados no stack de observabilidade antes do smoke test do dia 06/07. (Owner: Ana Souza — Due: 06/07/2024)
- Logs de pipelines serão centralizados no bucket `observability-sprint0` com retenção de 30 dias. (Owner: Pedro Barros — Vigência imediata)

## Ações e Responsáveis
- [ ] Atualizar runbook `docs/runbooks/qa-observability-review.md` com o novo fluxo de alertas e owners. — Owner: Thiago Ribeiro — Due: 09/07/2024
- [ ] Enviar resumo das métricas ao canal `#platform-ops` após publicação do dashboard. — Owner: Júlia Martins — Due: 08/07/2024
- [ ] Confirmar integração de logs com pipeline GitOps e anexar evidências em `docs/evidencias/observability/2024-07-05.md`. — Owner: Pedro Barros — Due: 07/07/2024

## Follow-ups Anteriores
- [x] Definição de KPIs críticos aprovada no kick-off (01/07); nenhuma pendência adicional.
