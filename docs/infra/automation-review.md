# Revisão de Automação de Infraestrutura

## Inventário de Scripts
| Script | Finalidade | Dependências/Notas | Uso em Pipelines |
| --- | --- | --- | --- |
| `scripts/generate-changelog.sh` | Gera seção de changelog agrupando commits por tipo. | Requer Git CLI e escreve em `CHANGELOG.md`. | Execução manual antes de releases. |
| `scripts/test-unit.sh` | Orquestra testes unitários Python e frontend. | `pytest`, `npm`, diretório `tests/`, gera cobertura e JUnit em `artifacts/`. | Etapa "Run Unit Tests" do workflow `ci.yml`. |
| `scripts/test-integration.sh` | Executa testes de integração Python com cobertura. | `pytest`, arquivos em `tests/integration/`. | Etapa "Run Integration Tests" do workflow `ci.yml`. |
| `scripts/test-e2e.sh` | Executa testes E2E Python e Playwright. | `pytest`, `npm`, Playwright navegadores. | Etapa "Run E2E Tests" do workflow `ci.yml`. |
| `scripts/run-quality-gates.sh` | Dispara bandit e validações de qualidade/observabilidade. | `bandit`, Python 3 com dependências `pyyaml`; falha sem `bandit`. | Etapa "Execute Quality Gates" do workflow `ci.yml`. |
| `scripts/verify_quality_gates.py` | Valida cobertura, backlog de bugs e evidências de segurança/privacidade. | Exige artefatos em `artifacts/` e `docs/evidencias/`; hoje falta importar `json` e `sys`. | Invocado por `run-quality-gates.sh`. |
| `scripts/verify_observability_gates.py` | Confere dashboards, alertas e runbooks de observabilidade. | Requer YAMLs em `grafana/` e `docs/runbooks`; falta importar `argparse`, `json` e `shutil`. | Invocado por `run-quality-gates.sh`. |
| `scripts/governanca/auditar-permissoes.py` | Compara agentes expostos pela API com planilha de RH. | Necessita `requests`, `csv`, `argparse`; imports `argparse`/`csv` ausentes atualmente. | Uso manual por Governança. |
| `scripts/infra/provision-dev.sh` | Provisiona ambiente dev via Docker Compose e/ou Kustomize. | Docker CLI, kubectl/kustomize, manifests em `design/`; cálculo de `REPO_ROOT` está incorreto (usa `../` em vez de `../../`). | Etapas "Validar composição Docker e manifests K8s" em `deploy-staging.yml`. |
| `scripts/infra/reset-staging.sh` | Reinicia recursos staging e chama seed sintético. | kubectl, `seed-staging-data.sh`; também impactado pelo `REPO_ROOT` incorreto. | Workflow agendado `reset-staging.yml`. |
| `scripts/infra/seed-data.sh` | Valida datasets sintéticos e aplica em bancos relacional/NoSQL. | Python 3, `psql`, `mongoimport`/`mongosh`, variáveis `*_RELATIONAL_URL`/`*_NOSQL_URL`; falha localizar datasets por causa de `REPO_ROOT`. | Chamado por wrappers `seed-dev-data.sh`, `seed-staging-data.sh`, pipelines `deploy-staging.yml` e `reset-staging.yml`. |
| `scripts/infra/seed-dev-data.sh` / `seed-staging-data.sh` | Wrappers convenientes para `seed-data.sh`. | Herda dependências; sofrem com `REPO_ROOT` incorreto. | Usados em pipelines e operações manuais. |

## Workflows CI/CD
- **`.github/workflows/ci.yml`** – Executa lint, testes (unitário, integração, E2E) e quality gates em pushes/PRs para `main` e `develop`. Publica artefatos de QA e observabilidade. Principais dependências: Node 20, Python 3.14, `bandit`, Playwright, pytest.【F:.github/workflows/ci.yml†L1-L53】【F:.github/workflows/ci.yml†L55-L79】
- **`.github/workflows/deploy-staging.yml`** – Em push para `main` ou manual, roda prechecks equivalentes à CI, valida Docker/K8s via `provision-dev.sh docker/k8s`, prepara manifests, valida datasets e publica pacotes para aprovação manual.【F:.github/workflows/deploy-staging.yml†L1-L63】【F:.github/workflows/deploy-staging.yml†L64-L96】
- **`.github/workflows/reset-staging.yml`** – Agendado diariamente 05:00 UTC ou via dispatch. Executa `reset-staging.sh` com `SEED_MODE=validate` usando secrets de banco e publica evidências.【F:.github/workflows/reset-staging.yml†L1-L21】

## Dependências Externas, Secrets e Variáveis de Ambiente
- **Ferramentas de CLI**: Docker Compose, kubectl/kustomize, `psql`, `mongoimport`/`mongosh`, Playwright, Git, pytest, npm, bandit.【F:scripts/infra/provision-dev.sh†L12-L49】【F:scripts/infra/seed-data.sh†L98-L197】【F:scripts/test-e2e.sh†L9-L37】【F:scripts/run-quality-gates.sh†L9-L25】
- **Variáveis obrigatórias**: `DEV_RELATIONAL_URL`, `DEV_NOSQL_URL`, `STAGING_RELATIONAL_URL`, `STAGING_NOSQL_URL`, `SEED_MODE` (opcional) para controlar seeds.【F:scripts/infra/seed-data.sh†L120-L182】【F:scripts/infra/reset-staging.sh†L5-L24】
- **Secrets em pipelines**: `STAGING_RELATIONAL_URL` e `STAGING_NOSQL_URL` fornecidos no workflow de reset agendado.【F:.github/workflows/reset-staging.yml†L13-L20】
- **Artefatos esperados**: `artifacts/coverage/*.xml`, `artifacts/seed/*.json|*.prom`, `docs/evidencias/*` (bug-dashboard, privacy readiness, DAST) e dashboards em `grafana/`. Ausência impede validações de gates.【F:scripts/verify_quality_gates.py†L6-L54】【F:scripts/verify_observability_gates.py†L13-L79】

## Simulações/Dry-Run
- `./scripts/infra/seed-staging-data.sh --mode validate` falhou ao localizar datasets porque `REPO_ROOT` aponta para `scripts/` em vez do diretório raiz; caminho resolvido incorretamente (`scripts/tests/...`).【f1fb19†L1-L3】【F:scripts/infra/seed-data.sh†L86-L118】
- `./scripts/infra/provision-dev.sh docker/k8s` não localizou `design/docker-compose.dev.yml` pelo mesmo bug de `REPO_ROOT`, interrompendo a validação de Docker/Kustomize.【fed2a1†L1-L3】【F:scripts/infra/provision-dev.sh†L5-L49】

## Fragilidades e Recomendações de Refatoração
1. **Corrigir cálculo de `REPO_ROOT` nos scripts shell em `scripts/infra/`** (`provision-dev.sh`, `reset-staging.sh`, `seed-data.sh` e wrappers) para usar `../..` ou `git rev-parse --show-toplevel`, garantindo acesso aos manifests e datasets.【F:scripts/infra/provision-dev.sh†L5-L16】【F:scripts/infra/reset-staging.sh†L1-L21】【F:scripts/infra/seed-data.sh†L71-L105】
2. **Adicionar imports ausentes em scripts Python**: `json`/`sys` em `verify_quality_gates.py`; `argparse`/`json`/`shutil` em `verify_observability_gates.py`; `argparse`/`csv` em `auditar-permissoes.py` para evitar exceções imediatas ao executar.【F:scripts/verify_quality_gates.py†L1-L54】【F:scripts/verify_observability_gates.py†L1-L87】【F:scripts/governanca/auditar-permissoes.py†L1-L86】
3. **Automatizar verificação de pré-requisitos** (docker, kubectl, banco) antes de rodar pipelines críticos para fornecer mensagens claras e permitir modo `validate` sem dependências completas.【F:scripts/infra/provision-dev.sh†L17-L63】【F:scripts/infra/seed-data.sh†L140-L205】
4. **Versão dos dashboards/alertas**: garantir tokens obrigatórios citados nos scripts de observabilidade permaneçam atualizados e versionar instruções de atualização nos runbooks para reduzir falsos positivos.【F:scripts/verify_observability_gates.py†L19-L79】【F:grafana/alerts/staging.yaml†L1-L87】
