# Runbook de Dashboards e Alertas

## Objetivo
Garantir que os dashboards e alertas críticos estejam operacionais, alinhados às métricas de negócio e atualizados após cada execução de scripts de infraestrutura.

> Consulte o inventário completo de painéis, logs e alertas em `docs/observabilidade/dashboards-e-logs.md` antes de iniciar a revisão.

## Frequência
- Revisão completa: após cada janela de execução listada em `docs/infra/runbook.md`.
- Monitoramento contínuo: verificação rápida diária às 10h.

## Procedimento de Verificação
1. **Dashboards Principais (Grafana):**
   - Acessar `Observabilidade > Saúde da Plataforma`.
   - Checar painéis de capacidade de cluster, latência de APIs e fila de deploys.
   - Validar se últimas atualizações refletem a execução do script correspondente.
2. **Alertas Ativos (PagerDuty/Slack):**
   - Revisar incidentes abertos nos últimos 7 dias.
   - Garantir que alertas silenciosos temporários possuem data de expiração registrada.
3. **Métricas Críticas:**
   - Atualizar planilha de métricas compartilhada (`Observabilidade - Métricas Críticas`) com status `OK`, `ATENÇÃO` ou `FALHA`.
   - Gerar nota resumida no card da sprint se algum indicador ficar em `ATENÇÃO` ou `FALHA`.
4. **Configuração de Alertas:**
   - Confirmar que thresholds refletem as últimas mudanças de capacidade (vide `observability-stack.md`).
   - Registrar alterações de thresholds na seção de follow-ups em `docs/riscos/observabilidade.md`.

## Atualização de Métricas
- Atualizar KPIs em `docs/metricas-kpis-dashboard.md` quando houver alteração relevante.
- Registrar evidências (prints ou links) na pasta `docs/evidencias/observabilidade/`.

## Comunicação
- Enviar resumo no canal `#observabilidade-daily` com status dos dashboards, alertas e métricas até às 11h.
- Escalar problemas críticos para o gerente de plataforma.

## Checklist Rápido
- [ ] Dashboards atualizados sem erros.
- [ ] Alertas ativos revisados e contextualizados.
- [ ] Métricas críticas atualizadas.
- [ ] Follow-ups registrados quando necessários.
