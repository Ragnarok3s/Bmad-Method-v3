# Evidência - Observabilidade (Sprint 0)

- **Data/Hora:** 2024-06-11 08:45 BRT
- **Ferramentas:** Grafana Cloud, Loki, Prometheus

## 1. Dashboards
- Dashboard `QA Quality Overview` atualizado com painel de latência P95.
- Export JSON: `grafana/staging/qa-quality-dashboard.json`.

## 2. Alertas
- Regra `HighErrorRate` ativa no arquivo `grafana/alerts/qa-observability.yaml`.
- Teste de firing realizado via `amtool check-config` com resultado positivo.
- Log de teste: `logs/amtool-check-20240611.txt`.

## 3. Logging Centralizado
- Consulta Loki: `{app="platform-api", env="stg"}` nas últimas 24h retornou 2.1k eventos.
- Snapshot compartilhado: `links/loki-search-20240611.txt`.
