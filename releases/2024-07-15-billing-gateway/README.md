# Release 2024-07-15 – Billing Gateway

## Sumário Executivo
- **Status:** Pronto para produção mediante execução do check `BILL-230`.
- **Ambiente validado:** production-candidate (infraestrutura espelho da produção).
- **Principais evidências:**
  - Testes de fumo aprovados, incluindo cenário de idempotência.
  - DPIA revisada e assinada por Security & Privacy.
  - Checklist PCI assinado e arquivado com aprovações formais.
  - Runbooks e manuais de suporte atualizados com as lições da release.
- **Flag operacional:** `BILLING_GATEWAY_ENABLE_REAL` mantido em `0`, direcionando o backend para o mock documentado em [`docs/feature-flags/billing-gateway-mock.md`](../../docs/feature-flags/billing-gateway-mock.md). Suites com `@pytest.mark.real_gateway` permanecem desativadas até novo go/no-go.

## Artefatos de Compliance e Suporte
- [`docs/compliance/releases/2024-07-15-billing-gateway/final-report.md`](../../docs/compliance/releases/2024-07-15-billing-gateway/final-report.md)
- [`docs/compliance/releases/2024-07-15-billing-gateway/dpia.md`](../../docs/compliance/releases/2024-07-15-billing-gateway/dpia.md)
- [`docs/compliance/releases/2024-07-15-billing-gateway/checklist-signoff.md`](../../docs/compliance/releases/2024-07-15-billing-gateway/checklist-signoff.md)
- [`docs/compliance/approvals/2024-07-15-billing-gateway.md`](../../docs/compliance/approvals/2024-07-15-billing-gateway.md)
- [`docs/support/user-manual.md`](../../docs/support/user-manual.md)
- [`docs/support/dr-checklist.md`](../../docs/support/dr-checklist.md)
- [`quality/observability/runbooks/disaster-recovery.md`](../../quality/observability/runbooks/disaster-recovery.md)
- [`quality/observability/runbooks/critical-alerts.md`](../../quality/observability/runbooks/critical-alerts.md)

## Versionamento
- Registro atualizado no [`releases/ledger.json`](../ledger.json) com artefato `sha256:billing-gateway-2024-07-15`.
- Permissões dos artefatos revisadas com `scripts/compliance/lock_permissions.sh` (modo check).

## Próximos Marcos
1. Monitorar alerta `BillingGatewayIdempotency` nas primeiras 24h pós deploy.
2. Validar integração com gateway externo antes de liberar para parceiros (`BILL-230`).
3. Atualizar indicadores de autorização e fraude nos dashboards de produto.
4. Rever decisão sobre ativação do PSP real após conclusão dos checkpoints de risco e execução das suítes `pytest -m real_gateway`.
