# Checklist de Disaster Recovery por Release

| Release | Data | Responsável | Status | Observações |
|---------|------|-------------|--------|-------------|
| v1.3.0  | 2024-05-10 | Joana Lima (Suporte) | ✅ Validado | Teste de restauração parcial em staging concluído. |
| v1.4.0  | 2024-06-07 | Carlos Mendes (SRE) | ✅ Validado | Execução completa do runbook `quality/observability/runbooks/disaster-recovery.md`. |
| v1.5.0  | 2024-07-05 | Ana Rocha (Plataforma) | ⏳ Em andamento | Necessário revisar comunicação automática com stakeholders. |

## Itens Obrigatórios por Release
- [ ] Rastrear impacto dos serviços críticos listados em `docs/observability-stack.md`.
- [ ] Validar integridade de backups conforme `docs/observability/setup.md` (seção "Reset Staging e Backups").
- [ ] Executar simulação do runbook de DR (`quality/observability/runbooks/disaster-recovery.md`).
- [ ] Revisar critérios de escalonamento L2 (`quality/observability/runbooks/escalation-l2.md`).
- [ ] Atualizar lições aprendidas em `quality/reports/` e anexar evidências no ticket da release.
- [ ] Registrar aprovação do time de suporte em `docs/support/approvals/`.

## Histórico de Atualizações
- **2024-06-08**: Checklist inicial criado com cobertura mínima de DR.
- **2024-07-06**: Incluído vínculo com runbooks de observabilidade e requisito de aprovação formal.
