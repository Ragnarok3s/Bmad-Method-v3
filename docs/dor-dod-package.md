# Pacote Definition of Ready (DoR) e Definition of Done (DoD)

## Objetivo
Centralizar os critérios oficiais de pronto utilizados pelo time de produto/engenharia para o MVP de gestão hoteleira e fornecer referências únicas para revisão trimestral e gates de release.

## Estrutura do Pacote
1. **Critérios por fluxo/módulo** — extraídos do plano MVP (`docs/property-mvp-plan.md`) com ajustes aprovados em 2024-06.
2. **Checklist de validação** — matriz utilizada durante os gates para garantir cobertura de requisitos técnicos, de negócio e de conformidade.
3. **Histórico de atualizações** — evidências das revisões e responsáveis por aprovações.

## Critérios de DoR e DoD (Versão 2024-06)

| Fluxo / Módulo | DoR Consolidado | DoD Consolidado |
|----------------|-----------------|-----------------|
| Autenticação e Controlo de Acesso | Histórias com dependências de identidade aprovadas, fluxos de exceção documentados, ameaças priorizadas na matriz STRIDE e plano de rollback definido. | MFA opcional e recovery testados, auditoria de logs revisada, alertas críticos configurados e checklist LGPD/GDPR atualizado. |
| Inventário & Calendário | Dados de catálogo limpos em staging, integrações OTA com SLAs anexados e critérios de sincronia revistos com parceiros. | Sincronização < 2 min validada, retenção automatizada habilitada, dashboards de disponibilidade publicados. |
| Housekeeping Móvel | Personas confirmadas, wireframes aprovados e dependências móveis (MDM, push) prontas, com riscos operacionais registrados. | App responsivo/offline em staging, monitorização ativa com SLAs de parceiros, runbook atualizado com fluxos de contingência. |
| Pagamentos PCI | Contratos PCI arquivados, cenários de falha e de chargeback descritos, segregação de ambientes aprovada pela segurança. | Tokenização ativa, reconciliação diária automatizada, relatório PCI anexado, testes de penetração aprovados. |
| Reservas & Relatórios | Dados sintéticos e métricas-alvo definidos, regras de negócio revisadas com stakeholders e dependências de BI mapeadas. | Fluxos de check-in/out estáveis, exportações CSV validadas, KPIs atingidos e documentação de suporte pronta. |

## Checklist de Validação
- [x] Critérios publicados no repositório (`docs/dor-dod-package.md`).
- [x] Link referenciado em `docs/plano-kickoff-mvp.md` e `docs/revisao-validacao-artefatos.md`.
- [x] Evidências anexadas na pasta `docs/evidencias/` e nos relatórios de revisão.
- [x] Owners confirmados: Ana Ribeiro (PO) e Carlos Mendes (QA Lead).
- [x] Próxima revisão agendada para Q3 2024 (checkpoint 2024-07-15) com convite enviado ao steering committee.

> **Assinatura 2024-07-08**: Ana Ribeiro (PO) e Carlos Mendes (QA Lead) confirmaram alinhamento deste pacote com o quadro de critérios publicado em `docs/property-mvp-plan.md`, mantendo-o como fonte oficial para auditorias DoR/DoD.

## Histórico de Atualizações
| Data | Responsáveis | Mudanças |
|------|--------------|----------|
| 2024-05-27 | Ana Ribeiro, Carlos Mendes | Publicação inicial no plano MVP e ata do kick-off. |
| 2024-06-03 | Ana Ribeiro, Carlos Mendes | Consolidação no pacote dedicado, inclusão dos SLAs OTA e atualização de critérios de segurança. |

## Próximas Ações
- Revisar métricas de aceitação após Sprint 1 e registrar ajustes neste documento.
- Anexar resultados de auditoria de acessibilidade às histórias de Housekeeping Móvel.
- Confirmar cobertura de testes de carga para o módulo de Reservas antes do gate Q4.
