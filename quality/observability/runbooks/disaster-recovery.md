# Runbook: Recuperação de Desastres

## Objetivo
Documentar os passos operacionais para restaurar os serviços críticos após um incidente de indisponibilidade prolongada.

## Pré-requisitos
- Time de suporte L1 notifica imediatamente os responsáveis listados na Matriz RACI.
- Ferramentas de monitoramento com alertas confirmando o incidente.
- Inventário de serviços atualizado no CMDB.
- Última release registrada no `releases/ledger.json` com aprovações arquivadas (`docs/compliance/approvals/`).

## Etapas de Recuperação
1. **Classificar severidade** utilizando o playbook de incidentes (`docs/runbooks/ota/incident-response.md`).
2. **Acionar comunicação**: enviar broadcast via Slack #suporte-oncall e abrir bridge no Teams.
3. **Validar artefatos da release vigente**: conferir permissões com `scripts/compliance/lock_permissions.sh check --release <id>` e consultar `docs/compliance/releases/<id>/final-report.md`.
4. **Ativar plano de dados**: restaurar backups mais recentes seguindo `quality/pci.py` para validar integridade.
5. **Restaurar serviços críticos** seguindo ordem de prioridade definida em `docs/observability-stack.md`.
6. **Executar automações FinOps quando aplicável** com `scripts/finops/rollback_and_tag.py rollback --environment <env> --release <id>`.
7. **Validar saúde** com dashboards de observabilidade (Grafana folder `observabilidade/core`).
8. **Registrar lições aprendidas** em até 24h no repositório `quality/reports/`.

## Critérios de Saída
- Todos os serviços listados na Matriz RTO cumpridos.
- Monitoramento sem alertas críticos por 60 minutos, incluindo `BillingGatewayIdempotency`.
- Comunicação final enviada para stakeholders e cliente com link para o ticket de release.

## Contatos
- Gerente de Incidentes: incident.manager@bmad.io
- Engenheiro de Plataforma (On-call): platform.oncall@bmad.io
- Responsável Segurança: security@bmad.io
