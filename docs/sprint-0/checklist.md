# Checklist de Readiness - Sprint 0

| Seção | Item | Status | Evidência |
| --- | --- | --- | --- |
| Ambientes | Ambientes DEV/STG provisionados e saudáveis | ✅ Concluído | [Relatório de validação](../evidencias/sprint-0/ambientes/relatorio-validacao-ambientes.md) |
| Ambientes | Paridade de configuração entre DEV e STG | ✅ Concluído | [Diff kustomize](../evidencias/sprint-0/ambientes/logs/kustomize-diff-20240611.txt) |
| Ambientes | Controles de acesso revisados | ✅ Concluído | [Log RBAC](../evidencias/sprint-0/ambientes/relatorio-validacao-ambientes.md#3-acesso-controlado) |
| Pipelines | CI executando com testes automatizados | ✅ Concluído | [Execução #1286](../evidencias/sprint-0/pipelines/execucoes-ci-cd.md#1-build--test-automatizados) |
| Pipelines | CD para STG com aprovação registrada | ✅ Concluído | [Execução #542](../evidencias/sprint-0/pipelines/execucoes-ci-cd.md#2-deploy-automatizado) |
| Pipelines | Plano de rollback validado | ✅ Concluído | [Simulação 2024-06-10](../evidencias/sprint-0/pipelines/execucoes-ci-cd.md#3-plano-de-rollback) |
| Observabilidade | Dashboards atualizados com métricas críticas | ✅ Concluído | [Dashboard QA Quality](../evidencias/sprint-0/observabilidade/configuracao-monitoramento.md#1-dashboards) |
| Observabilidade | Alertas configurados e testados | ✅ Concluído | [Teste amtool](../evidencias/sprint-0/observabilidade/logs/amtool-check-20240611.txt) |
| Observabilidade | Logging centralizado operante | ✅ Concluído | [Consulta Loki](../evidencias/sprint-0/observabilidade/links/loki-search-20240611.txt) |
| Governança | Change management aprovado para a release | ✅ Concluído | [CR-458](../evidencias/sprint-0/governanca/controles-governanca.md#1-change-management) |
| Governança | Matriz de riscos atualizada | ✅ Concluído | [Registro de riscos](../evidencias/sprint-0/governanca/controles-governanca.md#2-gestao-de-riscos) |
| Governança | Checklist de conformidade revisado | ✅ Concluído | [Ata LGPD](../evidencias/sprint-0/governanca/controles-governanca.md#3-conformidade--auditoria) |

> Atualizado em 2024-06-11 por Plataforma - Squad DevEx.
