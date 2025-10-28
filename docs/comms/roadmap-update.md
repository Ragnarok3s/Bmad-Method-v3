# Atualização de Roadmap — Sprint 1 (Fundamentos)

## Resumo
- Revalidamos em 2024-07-22 os itens BL-HK01/02, BL-01, BL-04 e BL-05 com evidências consolidadas em [`docs/evidencias/dor-housekeeping-validacoes.md`](../evidencias/dor-housekeeping-validacoes.md) e [`docs/evidencias/dor-sprint1-validacoes.md`](../evidencias/dor-sprint1-validacoes.md).
- Dependências e stakeholders consultados permanecem rastreados em [`docs/stakeholders/dependencias.csv`](../stakeholders/dependencias.csv) e foram destacadas no quadro de planning da Sprint 1.
- RFCs abertas (`RFC-2024-07-22-HK-SYNC`, `RFC-2024-07-22-PARTNER-WEBHOOKS`) concentram decisões remanescentes para início da Sprint.

## Dependências Confirmadas
| Item | Stakeholders | Dependências validadas | Evidências |
| --- | --- | --- | --- |
| BL-HK01 Housekeeping Móvel | Ana Ribeiro (PO), Mariana Lopes (Operations), Bruno Carvalho (Platform) | Sync v2 homologado, onboarding operacional, métricas Housekeeping Sync | [DoR Housekeeping](../evidencias/dor-housekeeping-validacoes.md#bl-hk01-housekeeping-movel) |
| BL-HK02 Integrações Parceiros | Ana Ribeiro (PO), Gabriela Nunes (Parcerias), Thiago Ramos (Facilities), Privacy Officer | SLAs 2024-07, runbook de monitoramento, matriz STRIDE | [DoR Housekeeping](../evidencias/dor-housekeeping-validacoes.md#bl-hk02-integracoes-housekeeping-parceiros) |
| BL-01 Onboarding | Ana Ribeiro (PO), Laura Pinto (Design Lead), Rafael Monteiro (Tech Lead) | Hand-off de UX aprovado e APIs de cadastro estabilizadas com smoke tests em staging | [DoR Sprint 1](../evidencias/dor-sprint1-validacoes.md#bl-01-onboarding) |
| BL-05 Governança (perfis básicos) | Ana Ribeiro (PO), Rafael Monteiro (Tech Lead), Carlos Mendes (QA Lead) | Critérios de acesso, exceções e rollback formalizados com runbooks publicados | [DoR Sprint 1](../evidencias/dor-sprint1-validacoes.md#bl-05-governança-perfis-básicos) |
| BL-04 Observabilidade fundacional | Bruno Carvalho (Platform Engineer), Rafael Monteiro (Tech Lead), Bianca Souza (Data & Analytics Lead) | Dashboards seed, alertas e SLAs anexados para agentes críticos | [DoR Sprint 1](../evidencias/dor-sprint1-validacoes.md#bl-04-observabilidade-fundacional) |

## Planejamento Sprint 1
- Quadro atualizado com prioridades e responsáveis: [`docs/comms/sprint-1-planning.md`](sprint-1-planning.md).
- Owners confirmados para follow-up de SLAs, onboarding e governança antes do kick-off.

## RFCs e Follow-up
| RFC | Decisão pendente | Owner | Deadline |
| --- | ---------------- | ----- | -------- |
| RFC-2024-07-22-HK-SYNC | Escolha da arquitetura de fila dedicada de sincronização offline | Rafael Monteiro | 2024-07-24 |
| RFC-2024-07-22-PARTNER-WEBHOOKS | Política de retries e comunicação com parceiros | Gabriela Nunes | 2024-07-25 |

## Próximos Passos
1. Revisar possíveis impactos cruzados com os épicos BL-02 e BL-03 na preparação da Sprint 2.
2. Atualizar o canal `#steering-bmad` com o link para esta nota e confirmar que as squads acessaram o CSV de dependências e o quadro de planning.
3. Monitorizar ajustes solicitados por compliance e parceiros técnicos no acompanhamento semanal, atualizando as RFCs conforme necessário.
