# DPIA – Atualização Billing Gateway (15/07/2024)

## Escopo

- Tokenização e armazenamento seguro de identificadores de cartão.
- Execução de pré-autorização, captura e estorno.
- Processamento de webhooks assinados.

## Avaliação de Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Exposição de PAN em logs | Baixa | Alta | Máscara automática e verificação em `services/billing/api/routes.py`. |
| Estorno indevido acima do valor capturado | Baixa | Média | Validação na camada de driver (`InMemoryGatewayDriver.refund`). |
| Replay de pré-autorização | Média | Alta | Exigência de `idempotency_key` registrada na auditoria. |
| Webhook spoofing | Baixa | Alta | Verificação HMAC com segredo individual por gateway. |

## Decisão

- ✅ Risco residual aceitável para ambiente sandbox / staging.
- ✅ Nenhuma ação adicional necessária antes do go-live planejado.
- ➡️ Revisar novamente após integração com gateway externo real.

## Anexos

- Evidências de testes: [`smoke-tests.md`](./smoke-tests.md)
- Checklist PCI: [`../../checklists/payment-gateway.md`](../../checklists/payment-gateway.md)
- Contrato de API: [`../../pci/payment-gateway-contract.md`](../../pci/payment-gateway-contract.md)
