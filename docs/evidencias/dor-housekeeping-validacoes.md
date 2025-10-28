# Evidências de Validação DoR — Housekeeping

## BL-HK01 Housekeeping Móvel
- **Checklist funcional**: critérios de sincronização offline, atualizações em lote e fallback manual aprovados em 2024-07-22 no board `MVP-Hospitality`, com ligação direta aos cartões HKM-*.
- **Dependências técnicas**: APIs de inventário e endpoint de sincronização `v2` homologados em staging com contrato publicado em `../integracoes/housekeeping-sync-v2.md`.
- **Ready de UX e treinamento**: protótipo mobile revisado com o time de operações e manual rápido documentado no guia [`runbooks/housekeeping-onboarding.md`](../runbooks/housekeeping-onboarding.md).
- **SLOs validados**: métricas de latência e sucesso de sincronização registradas no dashboard `Housekeeping Sync`, com limites aprovados por Platform Engineering e refletidos em `../metricas-kpis-dashboard.md`.

## BL-HK02 Integrações Housekeeping-Parceiros
- **Contratos e SLAs**: anexos assinados com parceiros de lavanderia e manutenção atualizados em 2024-07-22, com janelas de coleta documentadas em `sla-operacionais-2024-07.md`.
- **Integrações técnicas**: webhooks de parceiros homologados e monitorados via runbook `../runbooks/monitoracao-webhooks-parceiros.md`.
- **Matriz de riscos**: avaliação de falhas e plano de contingência formalizados em `../security/stride-integracoes-housekeeping.md`.
- **Governança de dados**: revisão de compartilhamento de dados pessoais aprovada pelo Privacy Officer, registrada em `sprint-0/governanca/controles-governanca.md`.
