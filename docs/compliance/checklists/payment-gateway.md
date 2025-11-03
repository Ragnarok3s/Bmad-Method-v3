# Checklist – Billing Gateway Readiness (PCI DSS)

- [x] Tokenização armazena apenas PAN mascarado e fingerprint com HMAC dedicado.
- [x] Pré-autorização exige `idempotency_key` e registra metadados de origem.
- [x] Captura bloqueia múltiplas liquidações simultâneas para a mesma autorização.
- [x] Estorno valida que o valor não ultrapassa o total capturado.
- [x] Webhooks exigem assinatura HMAC e descartam payloads inválidos.
- [x] Logs e métricas mascaram identificadores sensíveis (PAN, CVV, fingerprint bruto).
- [x] Conciliação gera volume bruto, taxas e volume líquido para evidência financeira.
- [x] Smoke tests E2E executados e anexados em `docs/compliance/releases/2024-07-15-billing-gateway/`.
- [x] DPIA revisada e publicada na mesma pasta de release.
- [x] Evidências de execução arquivadas no workflow `payments.yml` (artefato `payments-e2e`).
