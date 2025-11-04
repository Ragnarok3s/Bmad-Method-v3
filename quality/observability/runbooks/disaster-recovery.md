# Runbook: Recuperação de Desastres

## Objetivo
Documentar os passos operacionais para restaurar os serviços críticos após um incidente de indisponibilidade prolongada.

## Pré-requisitos
- Time de suporte L1 notifica imediatamente os responsáveis listados na Matriz RACI.
- Ferramentas de monitoramento com alertas confirmando o incidente.
- Inventário de serviços atualizado no CMDB.

## Etapas de Recuperação
1. **Classificar severidade** utilizando o playbook de incidentes (`docs/runbooks/ota/incident-response.md`).
2. **Acionar comunicação**: enviar broadcast via Slack #suporte-oncall e abrir bridge no Teams.
3. **Ativar plano de dados**: restaurar backups mais recentes seguindo `quality/pci.py` para validar integridade.
4. **Restaurar serviços críticos** seguindo ordem de prioridade definida em `docs/observability-stack.md`.
5. **Validar saúde** com dashboards de observabilidade (Grafana folder `observabilidade/core`).
6. **Registrar lições aprendidas** em até 24h no repositório `quality/reports/`.

## Critérios de Saída
- Todos os serviços listados na Matriz RTO cumpridos.
- Monitoramento sem alertas críticos por 60 minutos.
- Comunicação final enviada para stakeholders e cliente.

## Contatos
- Gerente de Incidentes: incident.manager@bmad.io
- Engenheiro de Plataforma (On-call): platform.oncall@bmad.io
- Responsável Segurança: security@bmad.io
