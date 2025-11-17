# Roadmap MVP — Visão Executiva

Este documento resume o estado de readiness das iniciativas prioritárias e aponta dependências, responsáveis e pendências para follow-up imediato. Para detalhes completos consulte [`docs/product-roadmap.md`](product-roadmap.md).

## Status DoR e Dependências (Atualizado em 2024-07-26)
| ID | Epic | Dependências-Chave | Owner (Squad) | Evidências DoR |
|----|------|--------------------|---------------|----------------|
| BL-HK01 | Housekeeping Móvel | Sync v2 (`integracoes/housekeeping-sync-v2.md`), onboarding operacional (`runbooks/housekeeping-onboarding.md`), métricas `Housekeeping Sync` | Squad Field Ops — Mariana Lopes / Bruno Carvalho | [DoR Housekeeping](evidencias/dor-housekeeping-validacoes.md#bl-hk01-housekeeping-movel) |
| BL-HK02 | Integrações Housekeeping-Parceiros | SLAs 2024-07 (`evidencias/sla-operacionais-2024-07.md`), runbook de monitoramento (`runbooks/monitoracao-webhooks-parceiros.md`), STRIDE (`security/stride-integracoes-housekeeping.md`) | Squad Field Ops — Gabriela Nunes / Thiago Ramos | [DoR Housekeeping](evidencias/dor-housekeeping-validacoes.md#bl-hk02-integracoes-housekeeping-parceiros) |
| BL-01 | Onboarding | UX hand-off, APIs de cadastro, smoke tests Sprint 1 | Squad Core Platform — Laura Pinto / Rafael Monteiro | [DoR Sprint 1](evidencias/dor-sprint1-validacoes.md#bl-01-onboarding) |
| BL-04 | Observabilidade | Dashboards seed, SLAs operacionais, alertas revisados com Platform Engineering | Squad Platform — Bruno Carvalho / Bianca Souza | [DoR Sprint 1](evidencias/dor-sprint1-validacoes.md#bl-04-observabilidade-fundacional) |
| BL-05 | Governança | Matriz STRIDE identitária, runbooks de acesso, owners confirmados | Squad Security & Access — Carlos Mendes / Ana Ribeiro | [DoR Sprint 1](evidencias/dor-sprint1-validacoes.md#bl-05-governança-perfis-básicos) |
| BL-PAY01 | Pagamentos PCI Ready | Drivers `backend/services/payments/gateways` (Stripe/Adyen), cofre de tokens (`SecureTokenVault`), suíte de testes PCI, reconciliação 30/07 (`docs/integracoes/2024-07-30-pagamentos-recon.md`) | Payments & Security — Rafael Monteiro / Camila Duarte | [Controles PCI](compliance/controles.md#pci-dss-—-tokenização-e-fluxo-de-pagamentos) |

## Responsáveis e Próximos Marcos
- **Product Owner (Ana Ribeiro)**: mantém prioridade dos épicos BL-HK01/02 e aprova alterações via RFCs `RFC-2024-07-22-HK-SYNC` e `RFC-2024-07-22-PARTNER-WEBHOOKS`.
- **Tech Lead (Rafael Monteiro)**: garante readiness técnico dos componentes de sync, observabilidade e governança, além de liderar o tiger team de pagamentos.
- **Operations Manager (Mariana Lopes)**: conduz treinamento de campo e monitora SLAs de parceiros com suporte do canal `#ops-sla`.
- **Security Lead (Camila Duarte)**: coordena reconciliação do gateway de pagamentos, evidências PCI e alinhamento com compliance.

### Checkpoints até início da Sprint 1
1. Atualizar quadro de planning com owners e dependências confirmadas (ver `comms/sprint-1-planning.md`).
2. Validar execução dos runbooks de monitoramento e onboarding com squads (owners listados acima).
3. Resolver pendências documentadas nas RFCs antes da cerimônia de kick-off.
4. Executar `scripts/payments/run_reconciliation.py` com gateways homologados até **30/07** e anexar logs em `docs/integracoes/2024-07-30-pagamentos-recon.md`.
5. Publicar evidência do relatório DPIA automatizado até **31/07** (`docs/evidencias/compliance/dpia-2024-07.md`) e atualizar o painel `SLO Health` com captura até **02/08** (`docs/evidencias/observability/slo-health-2024-07.png`).

## Indicadores Operacionais (Readiness)
| Data do Checkpoint | % Backlog Prioritário | % Ambientes Configurados | % Integrações Testadas | % Alertas dentro do SLA (<48h) | Fonte |
| ------------------ | --------------------- | ------------------------ | ----------------------- | ------------------------------ | ----- |
| 12/07/2024 | 88% | 85% | 65% | N/D | `docs/atas/checkpoints-semanais.md`
| 19/07/2024 | 92% | 88% | 72% | 96% | `docs/evidencias/readiness-dashboard-2024-07-26.md`
| 26/07/2024 | 95% | 92% | 81% | 98% | `docs/evidencias/readiness-dashboard-2024-07-26.md`
