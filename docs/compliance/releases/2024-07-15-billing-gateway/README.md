# Release 2024-07-15 – Billing Gateway

## Resumo

- Endpoints críticos (`tokenize`, `authorizations`, `captures`, `refunds`, `reconciliation`, `webhooks`) publicados.
- Cobertura E2E automatizada para autorização, captura, estorno e falhas.
- Checklist PCI atualizado em [`docs/compliance/checklists/payment-gateway.md`](../../checklists/payment-gateway.md).
- Evidências anexadas neste diretório e exportadas pelo workflow `payments.yml`.

## Evidências Incluídas

| Documento | Descrição |
| --- | --- |
| [`smoke-tests.md`](./smoke-tests.md) | Resultado dos testes E2E executados na data da release. |
| [`dpia.md`](./dpia.md) | Atualização do Data Protection Impact Assessment para o fluxo de billing. |
| [`controls-summary.md`](./controls-summary.md) | Mapeamento de controles PCI e status pós-implementação. |

## Próximos Passos

- Monitorar execução diária da conciliação até o go-live.
- Revisar indicadores de fraude após habilitar captura automática.
- Planejar onboard de parceiros externos utilizando o contrato publicado.
