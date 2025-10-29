# Mapeamento de Controles SOC 2 e ISO 27001

Este documento consolida os requisitos prioritários de SOC 2 (Trust Services Criteria) e ISO/IEC 27001:2022 e indica
os controles implementados na plataforma Bmad Method. Cada controle está relacionado aos componentes técnicos que
materializam o requisito, bem como às evidências geradas automaticamente.

## Visão Geral

- **Owner:** Plataforma & Security Engineering
- **Scripts de apoio:** `scripts/compliance/collect_evidence.py`
- **Relatórios automatizados:** `docs/compliance/reports/`
- **Dashboards:** `grafana/compliance`

## SOC 2 Trust Services Criteria

| Requisito | Controle | Implementação | Evidências Automatizadas |
| --- | --- | --- | --- |
| CC6.1 – Controle de Acesso Lógico | IAM centralizado com MFA obrigatório e trilha de auditoria de decisões de acesso. | `services/core/security/__init__.py` (`assert_role`, `assert_permission`, `SecurityService._log`) integrado a `services/core/observability.py` via `register_control_checkpoint`. | Eventos de auditoria e checkpoints registrados por `scripts/compliance/collect_evidence.py` (`iam_access_control`), exportados para `docs/compliance/reports` e painel "Access Control posture" no dashboard `grafana/compliance/compliance-overview.json`.
| CC6.6 – Controle de privilégios e segregação | Catálogo de permissões versionado com aprovação explícita e monitoramento de alterações. | `services/core/security/__init__.py` (`DEFAULT_PERMISSION_CATALOG`, `SecurityService.create_permission/update_role` com checkpoint `iam_policy_change`). | Relatório mensal `docs/compliance/reports/compliance-<AAAA-MM>.md` consolida alterações; script coleta hashes dos arquivos de políticas; alertas visíveis em `grafana/compliance/policy-drift.json`.
| CC7.2 – Monitoramento e alerta de atividades | Registro centralizado de eventos críticos com correlação observabilidade/compliance. | `services/core/observability.py` (`record_critical_alert`, `register_control_checkpoint`, `get_compliance_snapshot`). | Painel "Critical Control Events" em `grafana/compliance/compliance-overview.json`; pipeline `compliance-checks.yml` publica artefato `compliance-report.json`.
| CC8.1 – Gestão de mudanças | Auditoria e versionamento de pipelines que executam checagens de compliance. | `.github/workflows/compliance-checks.yml` garante lint e coleta de evidências a cada push/PR. | Saída do job "Publish compliance report" (artefato) + histórico em `docs/compliance/reports`.

## ISO/IEC 27001:2022 Annex A

| Controle | Descrição | Implementação | Evidências |
| --- | --- | --- | --- |
| A.5.9 – Atribuição e remoção de direitos de acesso | Fluxo automatizado de concessão, revisão e revogação documentado. | `services/core/security/__init__.py` (`SecurityService.ensure_bootstrap`, `list_roles`, `_register_access_checkpoint`). | Relatório de auditoria gerado por `scripts/compliance/collect_evidence.py` (`governance_audit_log`) e dashboards `grafana/compliance/compliance-overview.json`.
| A.5.17 – Autenticação da informação | Enforce de MFA e monitoramento de sessões. | `services/core/security/auth.py` (MFA enrolment, verificação e alertas) com checkpoints registrados por `services/core/security/__init__.py`. | Painel "MFA posture" em `grafana/compliance/policy-drift.json`; exportações mensais `docs/compliance/reports`.
| A.8.16 – Monitoramento de atividades | Instrumentação OTEL com rastreabilidade de controles. | `services/core/observability.py` (`mark_signal_event`, `register_control_checkpoint`, `get_compliance_snapshot`). | Artefatos `compliance-report-<AAAA-MM>.json` e alertas de integridade dos sinais OTEL.
| A.12.1 – Registro e monitorização de eventos | Correlação entre eventos de segurança e observabilidade. | Integração entre `record_audit_event`, `register_control_checkpoint` e pipeline `compliance-checks.yml`. | Scripts geram `hashes.json` de arquivos críticos e disponibilizam no relatório mensal.

## Controles Complementares

1. **Dashboards de Conformidade:**
   - `grafana/compliance/compliance-overview.json` – visão executiva (MFA, IAM, alertas críticos, pendências).
   - `grafana/compliance/policy-drift.json` – foco em deriva de políticas, comparando baseline vs. estado atual.

2. **Pipeline de Compliance:**
   - Workflow `.github/workflows/compliance-checks.yml` executa `python scripts/compliance/collect_evidence.py lint` e `collect`.
   - Artefato `compliance-report.zip` inclui JSON e Markdown consolidados.

3. **Evidências Automatizadas:**
   - `scripts/compliance/collect_evidence.py` gera hashes e metadados dos arquivos críticos.
   - Exportação mensal `docs/compliance/reports/compliance-<AAAA-MM>.md` descreve status dos controles e links para dashboards.

## Próximos Passos

- Expandir coleta de evidências para integrações externas (ex.: provedores de identidade SSO).
- Incluir testes de restauração (ISO 27001 A.5.30) e relatórios de continuidade.
- Automatizar geração de tickets de follow-up para controles em estado "attention".
