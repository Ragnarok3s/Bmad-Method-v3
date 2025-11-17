# Setup de Observabilidade – Scripts de Infraestrutura

Este documento acompanha a revisão contínua dos scripts `scripts/infra/provision-dev.sh` e `scripts/infra/reset-staging.sh`, responsáveis por inicializar ambientes locais/staging e garantir que a instrumentação OpenTelemetry permaneça operacional.

## Visão Geral
- **`provision-dev.sh`**: provisiona o ambiente de desenvolvimento em dois perfis – `docker` (padrão) ou `k8s` – validando previamente a existência de manifests necessários.【F:scripts/infra/provision-dev.sh†L7-L61】
- **`reset-staging.sh`**: reseta staging recriando recursos Kubernetes rotulados com `env=staging`, gera snapshot de backup e executa _seed_ automatizado quando disponível.【F:scripts/infra/reset-staging.sh†L4-L29】

## Pré-requisitos Comuns
- Docker CLI + Docker Compose para o perfil `docker`.
- `kubectl` (e opcionalmente `kustomize`) configurados com acesso aos clusters `dev` e `staging`.
- Manifests versionados em `design/docker-compose.dev.yml`, `design/k8s/dev` e `design/k8s/staging`.
- Scripts auxiliares de _seed_: `scripts/infra/seed-data.sh`, `seed-dev-data.sh` e `seed-staging-data.sh`. Estes preenchem bases com fixtures alinhadas ao `docs/playbook-operacional.md`.

## Validação – `provision-dev.sh`
1. **Modo docker (default)**
   ```bash
   scripts/infra/provision-dev.sh docker
   ```
   - O script verifica a presença do compose file e se `docker` está no `PATH` antes de executar `docker compose up -d`.
   - Em modo somente validação (`DEV_PROFILE=docker/k8s`) ele roda `docker compose config` para detectar erros de sintaxe sem subir containers.【F:scripts/infra/provision-dev.sh†L23-L55】
2. **Modo Kubernetes**
   ```bash
   scripts/infra/provision-dev.sh k8s
   ```
   - Exige diretório `design/k8s/dev`; renderiza manifests com `kubectl kustomize` ou `kustomize build` e aplica via `kubectl apply -k` quando em modo `apply`.
   - Falhas de dependência (kubectl ausente, manifests inexistentes) são reportadas de forma explícita, prevenindo estados parciais.

## Validação – `reset-staging.sh`
1. Confirme o contexto de Kubernetes (`kubectl config current-context`) com permissões de escrita em staging.
2. Execute o reset:
   ```bash
   scripts/infra/reset-staging.sh
   ```
   - Cria `artifacts/backups/<timestamp>` na raiz do repositório antes de aplicar qualquer alteração.
   - Reaplica `design/k8s/staging` após remover workloads existentes com o label `env=staging`.
   - Dispara `scripts/infra/seed-staging-data.sh`, que delega para `seed-data.sh` com parâmetros apropriados, garantindo consistência dos dados entre ambientes.【F:scripts/infra/reset-staging.sh†L4-L29】【F:scripts/infra/seed-staging-data.sh†L1-L6】

## Observabilidade pós-execução
- Validar `GET /health/otel` do backend para garantir que traces, métricas e logs continuam ativos (os sinais são atualizados por `backend/services/core/observability.py`).
- Conferir dashboards `grafana/staging/bmad-agents-001.json` e `bmad-ops-002.json`, além das regras `grafana/alerts/staging.yaml`, utilizando o script `scripts/run-quality-gates.sh` para capturar evidências de conformidade.【F:scripts/run-quality-gates.sh†L1-L20】【F:scripts/verify_observability_gates.py†L26-L107】
- Registrar anomalias seguindo `docs/runbooks/observabilidade-servicos.md`.

## Execuções de referência
- **Revisão estática 2025-10-28**: confirmada a existência dos manifests Docker/Kustomize e do script `seed-staging-data.sh`; garantias de fallback (`ensure_compose`, `ensure_kustomize_dir`) cobrem cenários de ausência de arquivos.【F:design/docker-compose.dev.yml†L1-L44】【F:design/k8s/base/backend-deployment.yaml†L1-L44】【F:scripts/infra/provision-dev.sh†L7-L61】
- Próximos passos incluem executar rotinas em ambiente com Docker/Kubernetes disponível para capturar artefactos de execução reais.

## Ações em Aberto
- Automatizar execução em CI (job noturno) para gerar backups e anexar `artifacts/observability/manifest.json` pós-reset.
- Adicionar smoke tests pós-`reset-staging.sh` (e.g., `pytest -k observability_smoke`) garantindo que a ingestão OTEL permanece operacional.
- Versionar manifests adicionais (Grafana, Collector) no diretório `design/k8s` para reduzir intervenção manual após o reset.
