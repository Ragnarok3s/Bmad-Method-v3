# Readiness Meetings – Release 2024-07-15 Billing Gateway

## Sessão de Go/No-Go – 2024-07-15 14:00 BRT
- **Objetivo:** validar readiness cruzando QA, compliance, FinOps e riscos residuais antes da promoção para produção.
- **Facilitador:** Marina Lopes (FinOps / Platform Ops)

### Participantes confirmados
- Produto: Lucas Azevedo (PM Billing)
- Segurança: Camila Duarte (Security Lead)
- Suporte: Rafaela Moura (Support Manager)
- Finanças: Guilherme Prado (Controller)
- Observadores: Ana Souza (SRE Lead), Júlia Martins (Operations Manager)

### Agenda da sessão
1. Resumo das métricas QA (E2E, contratos, acessibilidade, performance pendente).
2. Revisão de evidências de compliance (DPIA, PCI, KPIs pós-release).
3. Situação dos guardrails e custos FinOps.
4. Avaliação dos riscos residuais e plano de mitigação.
5. Decisão final e próximos passos.

### Ata e decisões
- **Decisão principal:** consenso pelo **GO** condicionado à execução do check `BILL-230` antes da janela de deploy e confirmação dos dashboards de retenção.
- **Ação A1:** Ana Souza irá reexecutar o script `k6` e anexar resultados no relatório QA até 16/07. *(Owner: Ana Souza – SRE Lead)*
- **Ação A2:** Camila Duarte coordenará validação jurídica das evidências de retenção e atualizará o dossiê de compliance até 17/07. *(Owner: Camila Duarte – Security Lead)*
- **Ação A3:** Lucas Azevedo acompanhará a integração do gateway externo (`BILL-230`) e comunicará conclusão no canal `#billing-launch` até 18/07. *(Owner: Lucas Azevedo – PM Billing)*
- **Ação A4:** Marina Lopes revisará retenção de métricas de observabilidade e publicará recomendação FinOps até 19/07. *(Owner: Marina Lopes – FinOps / Platform Ops)*
- **Monitoramento pós-go-live:** Rafaela Moura manterá o runbook de suporte atualizado nas primeiras 24h e registrará incidentes em `quality/observability/runbooks/disaster-recovery.md`. *(Owner: Rafaela Moura – Support Manager)*

### Evidências vinculadas
- Resumo completo do go/no-go: `releases/2024-07-15-billing-gateway/go-no-go.md`.
- Relatório QA: `releases/staging/2024.07.10-rc1/quality/test-report.md`.
- Dossiê de compliance: `docs/compliance/releases/2024-07-15-billing-gateway/`.
- Relatório FinOps: `analytics/finops/reports/2025-11.md`.
- Matriz de riscos: `docs/roadmap-riscos.md`.
