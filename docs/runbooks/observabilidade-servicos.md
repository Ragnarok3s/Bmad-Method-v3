# Runbook – Observabilidade dos Serviços Core

## Objetivo
Garantir que backend (`services/core`) e frontend (`apps/web`) estejam a enviar métricas, logs e traces para a stack definida em `docs/observability-stack.md`, com evidências versionadas nos pipelines.

## Checklist Diário

1. **Validar Exporters**
   - Backend: confirmar variáveis `CORE_OTEL_*` no ambiente (collector gRPC `4317`).
   - Frontend: confirmar `NEXT_PUBLIC_ENABLE_TELEMETRY` habilitada e `NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT` configurada quando a exportação OTLP for necessária; se ausente, apenas instrumentação local (sem exportadores) será registrada.
   - API Core: verificar `GET /health/otel` com `status=ok` e `signals.metrics.last_event` preenchido.
2. **Confirmar Receção de Dados**
   - Métricas: painel Grafana `bmad-agents-001` (latência P95, throughput, erro 5xx) e `bmad-ops-002` (reservas, housekeeping, engajamento web). Utilize `scripts/run-quality-gates.sh` para exportar evidências automaticamente.【F:scripts/run-quality-gates.sh†L1-L20】
   - Logs: Grafana Explore (Loki) filtrando labels `service.name`, `deployment.environment`, `route`.
   - Traces: Tempo filtrado por `service.name = bmad-core-service` e `bmad-web-app`.
   - Smoke tests: executar `poetry run pytest -k observability_smoke` para confirmar ingestão automática.
3. **Reservas e Reconciliação (Novos sinais)**
   - API Core: validar `GET /properties/1/reservations?page=1` e `PATCH /reservations/{id}` usando `curl -sS -H 'x-tenant-id: <tenant>' -H 'x-actor-id: <agent>' http://localhost:8000/...` (substituir host pelo ambiente alvo).
   - Observabilidade: no Grafana Explore consultar `sum(increase(bmad_web_reservations_fetch_outcome_total[5m])) by (result)` e `sum(increase(bmad_web_reservation_view_total[5m])) by (workspace)` para confirmar tráfego.
   - Logs estruturados: em Loki filtrar `logfmt` com `message="reservations_listed"` e labels `service.name="bmad.core.services"` para validar contagem por `property_id`.
4. **Quality Gates**
   - Executar `scripts/run-quality-gates.sh` e anexar `artifacts/observability/manifest.json` ao pipeline.
   - Verificar se dashboards/alertas obrigatórios constam do artefacto.

## Procedimento em Caso de Falha

1. **Collector Inacessível**
   - Backend: conferir reachability `nc <collector-host> 4317`; habilitar logs debug em `CORE_OTEL_LOGS_ENABLED`.
   - Frontend: validar se `TelemetryProvider` foi carregado (console `TelemetryProvider configured`) e observar mensagens `console.info` indicando telemetria desativada (`NEXT_PUBLIC_ENABLE_TELEMETRY=false`) ou ausência de endpoint (`NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT` vazio).
   - API Core: `GET /health/otel` deve retornar `status=degraded`; avaliar `collector.endpoint` retornado.
2. **Métricas Ausentes**
   - Backend: revisar contador `bmad_core_reservations_confirmed_total` em Prometheus (`increase(...[5m])`).
   - Confirmar se `signals.metrics.last_event` foi atualizado após chamar `record_dashboard_request`.
   - Frontend: inspecionar contador `bmad_web_page_view_total` (confirmar que o app foi acedido após deploy).
   - Reservas: validar `bmad_web_reservations_fetch_outcome_total` (sem picos de `result="error"`) e `bmad_web_reservation_status_outcome_total` (erros de mutação devem ser transitórios).
3. **Logs/Traces**
   - Confirmar que `services/core/observability.py` adicionou handler de logging (verificar `service.instance.id` nos logs Loki).
   - Validar `signals.logs.last_event` e `signals.traces.last_event` via `/health/otel`.
   - Verificar se o Collector está encaminhando para Loki/Tempo conforme manifestos de infra (`logs -> loki`, `traces -> tempo`).
4. **Reprocessamento**
   - Reiniciar pods com `kubectl rollout restart deploy/core-api` e `deploy/web-app` para reexecutar inicialização do OTEL.
   - Reexecutar `scripts/run-quality-gates.sh` e anexar novo artefacto.

## Evidências a Arquivar

- Export do painel Grafana (`grafana/staging/*.json`).
- Arquivo `grafana/alerts/staging.yaml` e prints do canal `#incident`.
- Artefacto `artifacts/observability/manifest.json` gerado pelo pipeline.
- Logs de execução (`artifacts/observability/otel-health.log`).
- Output dos smoke tests (`pytest -k observability_smoke`).

## Próximos Passos Pós-Incidente

1. Atualizar `docs/revisao-validacao-artefatos.md` com ações corretivas.
2. Incluir verificação adicional nos pipelines (e.g. smoke test de `/metrics`).
3. Revisitar métricas SLO com o time de Produto no steering quinzenal.
