# Runbook – Observabilidade dos Serviços Core

## Objetivo
Garantir que backend (`services/core`) e frontend (`apps/web`) estejam a enviar métricas, logs e traces para a stack definida em `docs/observability-stack.md`, com evidências versionadas nos pipelines.

## Checklist Diário

1. **Validar Exporters**
   - Backend: confirmar variáveis `CORE_OTEL_*` no ambiente (collector gRPC `4317`).
   - Frontend: confirmar `NEXT_PUBLIC_OTEL_*` expostas pelo `next.config.mjs` (collector HTTP `4318`).
2. **Confirmar Receção de Dados**
   - Métricas: painel Grafana `bmad-agents-001` (latência P95, throughput, erro 5xx) e `bmad-ops-002` (reservas, housekeeping, engajamento web).
   - Logs: Kibana indexado com labels `service.name`, `deployment.environment`, `route`.
   - Traces: Tempo filtrado por `service.name = bmad-core-service` e `bmad-web-app`.
3. **Quality Gates**
   - Executar `scripts/run-quality-gates.sh` e anexar `artifacts/observability/manifest.json` ao pipeline.
   - Verificar se dashboards/alertas obrigatórios constam do artefacto.

## Procedimento em Caso de Falha

1. **Collector Inacessível**
   - Backend: conferir reachability `nc <collector-host> 4317`; habilitar logs debug em `CORE_OTEL_LOGS_ENABLED`.
   - Frontend: validar se `TelemetryProvider` foi carregado (console `TelemetryProvider configured`).
2. **Métricas Ausentes**
   - Backend: revisar contador `bmad_core_reservations_confirmed_total` em Prometheus (`increase(...[5m])`).
   - Frontend: inspecionar contador `bmad_web_page_view_total` (confirmar que o app foi acedido após deploy).
3. **Logs/Traces**
   - Confirmar que `services/core/observability.py` adicionou handler de logging (verificar `service.instance.id` nos logs).
   - Verificar se o Collector está encaminhando para Logstash/Tempo conforme manifestos de infra.
4. **Reprocessamento**
   - Reiniciar pods com `kubectl rollout restart deploy/core-api` e `deploy/web-app` para reexecutar inicialização do OTEL.
   - Reexecutar `scripts/run-quality-gates.sh` e anexar novo artefacto.

## Evidências a Arquivar

- Export do painel Grafana (`grafana/staging/*.json`).
- Arquivo `grafana/alerts/staging.yaml` e prints do canal `#incident`.
- Artefacto `artifacts/observability/manifest.json` gerado pelo pipeline.
- Logs de execução (`artifacts/observability/otel-health.log`).

## Próximos Passos Pós-Incidente

1. Atualizar `docs/revisao-validacao-artefatos.md` com ações corretivas.
2. Incluir verificação adicional nos pipelines (e.g. smoke test de `/metrics`).
3. Revisitar métricas SLO com o time de Produto no steering quinzenal.
