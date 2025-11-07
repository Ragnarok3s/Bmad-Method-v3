# Issue: Serviço Payments – status atualizado

## Resumo da implementação atual
- O serviço está consolidado em `services/payments`, com `PaymentGatewayService` orquestrando tokenização, autorizações e reconciliação (`api.py`).
- `drivers.py` expõe o registro de gateways e erros de driver, enquanto `gateways/` traz o driver em memória usado nos testes e base para integrações reais.
- `storage.py` implementa `SecureTokenVault` com criptografia simétrica e `webhooks.py` registra manipuladores com segredos por gateway.

## Evidências de funcionamento
- O teste de integração `tests/integration/test_payments_gateway.py` valida o fluxo ponta a ponta de tokenização, autorização, captura, reconciliação e tratamento de driver não registrado.
- A API de alto nível está disponível para serviços consumidores via `services/payments/__init__.py`, que reexporta `PaymentGatewayService`, `CardData` e erros relevantes.

## Próximos passos
1. Adicionar drivers concretos para gateways externos (Stripe, Adyen) aproveitando a abstração existente em `services/payments/gateways`.
2. Configurar testes de contrato com ambientes sandbox, reaproveitando os cenários do `test_payments_gateway.py` e expandindo para fluxos de estorno.
3. Publicar guia de integração e SLIs de conciliação para monitoramento financeiro.
