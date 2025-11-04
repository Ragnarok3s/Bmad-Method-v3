# DPIA – Atualização Billing Gateway (15/07/2024)

## Escopo

- Tokenização e armazenamento seguro de identificadores de cartão.
- Execução de pré-autorização, captura e estorno.
- Processamento de webhooks assinados.
- Replicação de dados para o data warehouse antifraude.

## Avaliação de Riscos

| Risco | Probabilidade | Impacto | Mitigação | Status |
| --- | --- | --- | --- | --- |
| Exposição de PAN em logs | Baixa | Alta | Máscara automática e verificação em `services/billing/api/routes.py`. | ✅ Validado em 2024-07-15 pelo script `verify_masks.py`. |
| Estorno indevido acima do valor capturado | Baixa | Média | Validação na camada de driver (`InMemoryGatewayDriver.refund`). | ✅ Casos de teste automatizados `tests/e2e/payments/test_refund.py`. |
| Replay de pré-autorização | Média | Alta | Exigência de `idempotency_key` registrada na auditoria. | 🔄 Monitoramento contínuo via alerta `BillingGatewayIdempotency`. |
| Webhook spoofing | Baixa | Alta | Verificação HMAC com segredo individual por gateway. | ✅ Segredos rotacionados em 2024-07-12 (vault change request #451). |
| Vazamento no data warehouse antifraude | Baixa | Alta | Segmentação de acesso e mascaramento de colunas sensíveis. | ✅ Auditoria concluída por Data Platform em 2024-07-14. |

## Avaliação Residual

- Riscos residuais aceitos após mitigação, com exceção do monitoramento de replay que permanece em observação até integração com gateway externo real.
- Plano de revisão trimestral para confirmar efetividade das salvaguardas.

## Decisão

- ✅ Risco residual aceitável para promoção a produção condicionada ao monitoramento ativo do alerta `BillingGatewayIdempotency`.
- ✅ Nenhuma ação adicional necessária antes do go-live planejado além da verificação do ticket `BILL-230`.
- ➡️ Revisar novamente após integração com gateway externo real.

## Assinaturas

- Helena Prado (Security & Privacy Officer) – 2024-07-15T14:35:00Z
- Marcos Teles (Compliance Lead) – 2024-07-15T14:42:00Z

## Anexos

- Evidências de testes: [`smoke-tests.md`](./smoke-tests.md)
- Checklist PCI: [`../../checklists/payment-gateway.md`](../../checklists/payment-gateway.md)
- Contrato de API: [`../../pci/payment-gateway-contract.md`](../../pci/payment-gateway-contract.md)
- Relatório final de conformidade: [`./final-report.md`](./final-report.md)
