# Revisão de Documentação – 28/10/2025

## 1. Atualizações aplicadas
- **Plataforma & stack**: `platform-architecture-decisions.md` agora descreve a arquitetura real (Next.js 14 + FastAPI único, OTLP e GitOps com Argo CD), removendo referências a microserviços NestJS e serviços AWS que não existem no repositório.【F:platform-architecture-decisions.md†L3-L54】【F:services/core/main.py†L1-L24】【F:apps/web/telemetry/init.ts†L1-L79】
- **Scripts de infraestrutura**: `docs/observabilidade/setup.md` documenta as validações atuais dos scripts de provisionamento/reset, citando manifests versionados e o fluxo de seed automatizado recentemente adicionado.【F:docs/observabilidade/setup.md†L1-L51】【F:scripts/infra/provision-dev.sh†L7-L61】【F:scripts/infra/reset-staging.sh†L4-L29】
- **Stack de observabilidade**: `docs/observability-stack.md` foi alinhado à stack LGTM (Loki/Grafana/Tempo/Prometheus) e à instrumentação OTEL existente, substituindo a dependência antiga de Logstash/Elastic.【F:docs/observability-stack.md†L33-L64】【F:services/core/observability.py†L1-L120】
- **Runbook operacional**: `docs/runbooks/observabilidade-servicos.md` aponta para Grafana Explore/Loki e orienta o uso dos quality gates para evidências, removendo menções a Kibana e Logstash.【F:docs/runbooks/observabilidade-servicos.md†L8-L37】

## 2. Lacunas identificadas
- Execução real dos scripts (`provision-dev.sh`, `reset-staging.sh`) ainda depende de ambiente com Docker/Kubernetes; a revisão de 28/10/2025 foi estática e precisa de validação prática com artefactos anexados ao pipeline.【F:docs/observabilidade/setup.md†L44-L51】
- Alertas para disponibilidade/SLA continuam centralizados em Grafana mas requerem confirmação de que os pipelines do Collector incluem destinos Loki/Tempo; abrir follow-up para auditar manifestos de infraestrutura.
- Algumas integrações (pagamentos, automações externas) permanecem em descoberta; recomenda-se registar decisões assim que novos conectores forem priorizados para garantir consistência com o roadmap.【F:platform-architecture-decisions.md†L36-L54】

## 3. Entrevistas com responsáveis
- Entrevistas com owners de módulos (ex.: Bruno Carvalho – plataforma; Luís Ferreira – operações) não foram realizadas nesta rodada. Agendar sessões síncronas antes do próximo checkpoint para confirmar owners e SLIs referenciados em `docs/observability-stack.md` e `docs/runbooks/observabilidade-servicos.md`.

## 4. Próximos passos sugeridos
- [ ] Executar `scripts/infra/provision-dev.sh docker` e `scripts/infra/reset-staging.sh` em ambiente preparado, anexando logs/resultados ao repositório (`artifacts/observability/`).
- [ ] Revisar manifestos do Collector para garantir pipelines `logs -> loki` e `traces -> tempo` publicados junto com dashboards.【F:docs/observability-stack.md†L35-L58】
- [ ] Atualizar roadmap/ADRs caso novas integrações OTA ou de billing avancem, mantendo consistência com as decisões documentadas.【F:platform-architecture-decisions.md†L31-L54】
- [ ] Documentar resultados das entrevistas e ajustar owners/cadências nos runbooks conforme feedback dos responsáveis.【F:docs/runbooks/observabilidade-servicos.md†L12-L37】
