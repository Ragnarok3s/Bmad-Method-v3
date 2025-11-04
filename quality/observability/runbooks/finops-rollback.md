# Runbook: Automação de Rollback e Tagging FinOps

## Objetivo

Padronizar o uso da automação de rollback e tagging de custos para incidentes que impactam indicadores críticos.

## Ferramentas

- Script `scripts/finops/rollback_and_tag.py`.
- Terraform no diretório `platform/iac/terraform` para provisionar integrações FinOps.
- Secrets no GitHub Actions: `FINOPS_TOKEN`, `PAGERDUTY_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.

## Pré-requisitos

1. Terraform inicializado com `terraform init` em `platform/iac/terraform`.
2. Workspace correspondente (`staging`, `qa`, `production`) selecionado.
3. Releases registradas no arquivo `releases/ledger.json` (ver seção "Registro de Releases").

## Fluxo de Rollback Automatizado

```bash
scripts/finops/rollback_and_tag.py rollback \
  --environment staging \
  --release 2024.07.10-rc1 \
  --terraform-dir platform/iac/terraform \
  --dry-run
```

1. O script valida o release no ledger.
2. Executa `terraform apply` do módulo `finops_guardrail` com modo rollback.
3. Registra evidências em `artifacts/finops/rollback-<timestamp>.json`.
4. Retorna código de saída !=0 se o rollback falhar.

## Registro de Tags de Custo

```bash
scripts/finops/rollback_and_tag.py tag \
  --environment staging \
  --release 2024.07.10-rc1 \
  --owner squad-platform \
  --cost-center PLT01 \
  --ticket INCIDENT-123
```

- Atualiza arquivo `releases/ledger.json` com as tags informadas.
- Executa `terraform apply` para garantir propagação dos tags FinOps.
- Gera evidências em `artifacts/finops/tagging-<timestamp>.json`.

## Registro de Releases

- Os releases ativos devem ser registrados via:
  ```bash
  scripts/finops/rollback_and_tag.py record-release \
    --release 2024.07.10-rc1 \
    --environment staging \
    --artifact sha256:abcd...
  ```
- O comando cria/atualiza `releases/ledger.json`.

## Checks na Pipeline

- Workflow `.github/workflows/deploy.yml` executa `scripts/finops/rollback_and_tag.py validate` garantindo que:
  - Ledger existe e tem release ativo para o deploy.
  - Todos os recursos Terraform possuem tags `cost_center`, `owner`, `environment`.
  - Rollback automatizado está configurado.

## Evidências

- Arquivos em `artifacts/finops/` para cada execução.
- Registros do Terraform (`terraform.tfstate` e logs) versionados em bucket remoto.
- Check `FinOps Guardrails` marcado como obrigatório na pipeline.
