# Integração Gateway de Pagamentos – Evidências 10/07/2024

## Escopo

- Tokenização, pré-autorização, captura, estorno e conciliação via serviço `services/billing`.
- Validação de webhooks assinados.

## Evidências

1. Testes automatizados executados (`pytest tests/e2e/payments -m "e2e and payments"`).
2. Contrato atualizado em [`docs/compliance/pci/payment-gateway-contract.md`](../compliance/pci/payment-gateway-contract.md).
3. Checklist PCI validado em [`docs/compliance/checklists/payment-gateway.md`](../compliance/checklists/payment-gateway.md).
4. Release documentada em [`docs/compliance/releases/2024-07-15-billing-gateway/`](../compliance/releases/2024-07-15-billing-gateway/).

## Próximos Passos

- Sincronizar credenciais com gateway externo e substituir driver InMemory.
- Ativar monitoramento de métricas de autorização/captura no Grafana.
