# Setup de Observabilidade – Scripts de Infraestrutura

Este documento registra a validação realizada sobre os scripts `scripts/infra/provision-dev.sh` e `scripts/infra/reset-staging.sh`, além dos passos necessários para executá-los com segurança.

## Visão Geral
- **`provision-dev.sh`**: prepara o ambiente de desenvolvimento utilizando perfis `docker` (padrão) ou `k8s`.
- **`reset-staging.sh`**: recria recursos do ambiente de staging, gera snapshot de backup e executa _seed_ opcional.

## Pré-requisitos Comuns
- Docker CLI e Docker Compose instalados para o perfil `docker`.
- Acesso a cluster Kubernetes com `kubectl` configurado para os contextos `dev` e `staging`.
- Manifests disponíveis em `design/docker-compose.dev.yml`, `design/k8s/dev` e `design/k8s/staging`.
- Scripts auxiliares:
  - `scripts/infra/seed-staging-data.sh` para repovoamento opcional.
  - Fixture de dados descrita em `docs/playbook-operacional.md`.

## Validação – `provision-dev.sh`
1. Executar no repositório:
   ```bash
   scripts/infra/provision-dev.sh docker
   ```
2. O script tenta subir containers definidos em `design/docker-compose.dev.yml`. Caso o arquivo não exista, é exibido aviso informando a necessidade de gerar os manifests.
3. Para ambientes Kubernetes:
   ```bash
   scripts/infra/provision-dev.sh k8s
   ```
   - Aplica `kubectl apply -k design/k8s/dev`.
   - Emite erro amigável se o diretório estiver ausente.

## Validação – `reset-staging.sh`
1. Certifique-se de que `kubectl` possua contexto com permissão de escrita em `staging`.
2. Execute:
   ```bash
   scripts/infra/reset-staging.sh
   ```
3. O script:
   - Cria diretório de backup em `artifacts/backups` com carimbo de data/hora.
   - Recria jobs, deployments e services rotulados com `env=staging` usando `kubectl apply -k design/k8s/staging`.
   - Executa `scripts/infra/seed-staging-data.sh` se presente.
   - Exibe mensagens claras quando pré-requisitos não são encontrados.

## Observabilidade Pós-execução
- Após cada script, revisar dashboards e alertas documentados em `docs/observability-stack.md` para garantir que métricas e logs retornaram ao estado esperado.
- Registrar incidentes ou gaps detectados seguindo `docs/runbooks/qa-observability-review.md`.

## Próximos Passos
- Automatizar verificações de presença dos manifests no pipeline de CI.
- Incluir testes de fumaça para dashboards principais após o reset de staging.
