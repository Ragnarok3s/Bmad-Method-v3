# Checklist de Disaster Recovery por Release

| Release | Data | Responsável | Status | Observações |
|---------|------|-------------|--------|-------------|
| v1.3.0  | 2024-05-10 | Joana Lima (Suporte) | ✅ Validado | Teste de restauração parcial em staging concluído. |
| v1.4.0  | 2024-06-07 | Carlos Mendes (SRE) | ✅ Validado | Execução completa do runbook `quality/observability/runbooks/disaster-recovery.md`. |
| v1.5.0  | 2024-07-05 | Ana Rocha (Plataforma) | ⏳ Em andamento | Necessário revisar comunicação automática com stakeholders. |
| v1.5.1  | 2024-07-15 | Joana Lima (Release Manager) | ✅ Assinado | Evidências anexas na release [`2024-07-15-billing-gateway`](../compliance/releases/2024-07-15-billing-gateway/). |

## Itens Obrigatórios por Release
- [x] Rastrear impacto dos serviços críticos listados em `docs/observability-stack.md`.
- [x] Validar integridade de backups conforme `docs/observability/setup.md` (seção "Reset Staging e Backups").
- [x] Executar simulação do runbook de DR (`quality/observability/runbooks/disaster-recovery.md`).
- [x] Revisar critérios de escalonamento L2 (`quality/observability/runbooks/escalation-l2.md`).
- [x] Atualizar lições aprendidas em `quality/reports/` e anexar evidências no ticket da release.
- [x] Registrar aprovação do time de suporte em `docs/support/approvals/` e arquivar aprovação formal em `docs/compliance/approvals/`.

## Histórico de Atualizações
- **2024-06-08**: Checklist inicial criado com cobertura mínima de DR.
- **2024-07-06**: Incluído vínculo com runbooks de observabilidade e requisito de aprovação formal.
- **2024-07-15**: Adicionada linha da release 2024-07-15 com status assinado e verificação de permissões.
