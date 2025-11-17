# Controles PCI – Billing Gateway

| Controle | Evidência | Status |
| --- | --- | --- |
| Segmentação de dados sensíveis | `backend/services/payments/storage.py`, máscara de PAN via checksum HMAC. | ✅ Implementado |
| Token Vault com chave >= 32 bytes | Instanciação `PaymentGatewayService(secret_key=token_bytes(32))`. | ✅ Implementado |
| Logs mascarados | Serialização em `TokenizedCardResponse` impede retorno de PAN. | ✅ Implementado |
| Limite de estorno | `InMemoryGatewayDriver.refund` bloqueia valores acima do capturado. | ✅ Implementado |
| Testes E2E recorrentes | Workflow `payments.yml` executa smoke tests e publica artefatos. | ✅ Implementado |
| Monitoramento de idempotência | Alerta `BillingGatewayIdempotency` em `grafana/alerts/production-billing.yaml`. | ✅ Configurado |
| Checklist PCI assinado | [`checklist-signoff.md`](./checklist-signoff.md). | ✅ Arquivado |
