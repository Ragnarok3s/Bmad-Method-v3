# Terraform FinOps Guardrails

Este pacote define integrações de rollback e tagging utilizados pelo script `scripts/finops/rollback_and_tag.py`.

## Uso

```bash
terraform -chdir=platform/iac/terraform init
terraform -chdir=platform/iac/terraform apply \
  -var="environment=staging" \
  -var="release=2024.07.10-rc1" \
  -var="finops_mode=validate"
```

O módulo `modules/finops` cria evidências locais em `artifacts/finops/` permitindo que o pipeline do GitHub Actions anexe registros do rollback/tagging.
