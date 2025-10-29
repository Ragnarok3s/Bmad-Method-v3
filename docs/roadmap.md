# Roadmap MVP — Visão Executiva

Este documento resume o estado de readiness das iniciativas prioritárias e aponta dependências, responsáveis e pendências para follow-up imediato. Para detalhes completos consulte [`docs/product-roadmap.md`](product-roadmap.md).

## Status DoR e Dependências (Atualizado em 2024-07-22)
| ID | Epic | Dependências-Chave | Evidências DoR |
|----|------|--------------------|----------------|
| BL-HK01 | Housekeeping Móvel | Sync v2 (`integracoes/housekeeping-sync-v2.md`), onboarding operacional (`runbooks/housekeeping-onboarding.md`), métricas `Housekeeping Sync` | [DoR Housekeeping](evidencias/dor-housekeeping-validacoes.md#bl-hk01-housekeeping-movel) |
| BL-HK02 | Integrações Housekeeping-Parceiros | SLAs 2024-07 (`evidencias/sla-operacionais-2024-07.md`), runbook de monitoramento (`runbooks/monitoracao-webhooks-parceiros.md`), STRIDE (`security/stride-integracoes-housekeeping.md`) | [DoR Housekeeping](evidencias/dor-housekeeping-validacoes.md#bl-hk02-integracoes-housekeeping-parceiros) |
| BL-01 | Onboarding | UX hand-off, APIs de cadastro, smoke tests Sprint 1 | [DoR Sprint 1](evidencias/dor-sprint1-validacoes.md#bl-01-onboarding) |
| BL-04 | Observabilidade | Dashboards seed, SLAs operacionais, alertas revisados com Platform Engineering | [DoR Sprint 1](evidencias/dor-sprint1-validacoes.md#bl-04-observabilidade-fundacional) |
| BL-05 | Governança | Matriz STRIDE identitária, runbooks de acesso, owners confirmados | [DoR Sprint 1](evidencias/dor-sprint1-validacoes.md#bl-05-governança-perfis-básicos) |
| BL-PAY01 | Pagamentos PCI Ready | Drivers `services/payments/gateways` (Stripe/Adyen), cofre de tokens (`SecureTokenVault`), suíte de testes PCI | [Controles PCI](compliance/controles.md#pci-dss-—-tokenização-e-fluxo-de-pagamentos) |

## Responsáveis e Próximos Marcos
- **Product Owner (Ana Ribeiro)**: mantém prioridade dos épicos BL-HK01/02 e aprova alterações via RFCs `RFC-2024-07-22-HK-SYNC` e `RFC-2024-07-22-PARTNER-WEBHOOKS`.
- **Tech Lead (Rafael Monteiro)**: garante readiness técnico dos componentes de sync, observabilidade e governança.
- **Operations Manager (Mariana Lopes)**: conduz treinamento de campo e monitora SLAs de parceiros.

### Checkpoints até início da Sprint 1
1. Atualizar quadro de planning com owners e dependências confirmadas (ver `comms/sprint-1-planning.md`).
2. Validar execução dos runbooks de monitoramento e onboarding com squads (owners listados acima).
3. Resolver pendências documentadas nas RFCs antes da cerimônia de kick-off.
4. Executar `scripts/payments/run_reconciliation.py` com gateways homologados para validar tokenização + reconciliação antes do go-live.
