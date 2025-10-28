# Registro de Assinaturas de SLAs Operacionais (Junho/2024)

## Contexto
Após a revisão trimestral dos artefatos do MVP, foi realizada reunião de alinhamento com os parceiros operacionais críticos para validar e formalizar os SLAs de suporte e de integrações externas.

- **Data da reunião**: 2024-06-03
- **Facilitador**: Luís Ferreira (Operations Manager)
- **Participantes externos**: AirLaundry, FixItNow, Partner-OTA Hub
- **Participantes internos**: Ana Ribeiro (PO), Bruno Carvalho (Platform Engineer), Carlos Mendes (QA Lead)

## Resultados
1. Assinaturas coletadas digitalmente através da plataforma interna de contratos (DocuSeal) e armazenadas no diretório `artefatos/sla/2024-06/`.
2. Atualização dos tempos de resposta prioritários e janelas de manutenção conjunta com cada parceiro:
   - **AirLaundry**: SLA P1 ≤ 2h, janelas de manutenção às terças das 22h às 00h.
   - **FixItNow**: SLA P1 ≤ 4h, manutenção extraordinária comunicada com 48h de antecedência.
   - **Partner-OTA Hub**: SLA P1 ≤ 1h para indisponibilidades de API, manutenção mensal no primeiro domingo.
3. Integração dos novos SLAs no playbook operacional (`docs/playbook-operacional.md`) e na matriz de readiness de integrações (`docs/plano-kickoff-mvp.md`).

## Próximos Passos
- Registrar os SLAs no catálogo de integrações e anexar métricas de cumprimento trimestral.
- Validar durante o checkpoint de 2024-07-15 se as métricas de uptime foram incorporadas aos dashboards de observabilidade.
- Atualizar o quadro de ações corretivas caso algum parceiro apresente desvios nos primeiros 30 dias.

## Evidências Arquivadas
- `artefatos/sla/2024-06/airlaundry-sla-assinado.pdf`
- `artefatos/sla/2024-06/fixitnow-sla-assinado.pdf`
- `artefatos/sla/2024-06/partner-ota-hub-sla-assinado.pdf`
- Transcript da reunião e checklist de validação: `artefatos/sla/2024-06/reuniao-assinaturas-sla-2024-06.md`
