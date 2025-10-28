# Runbook – Rollback de Deploy em Staging

## Objetivo
Restaurar versão estável do ambiente de staging utilizando fluxo GitOps documentado na Sprint 0.

## Pré-requisitos
- Acesso ao repositório de manifests (`bmad-method-manifests`).
- Permissão para aprovar ambiente `staging` no GitHub Actions.
- Kubectl configurado com contexto `staging`.

## Passos
1. **Abrir Incidente**
   - Notificar canal `#incident`.
   - Registrar ticket no ServiceNow (`INC-<número>`).
2. **Identificar Commit Saudável**
   - Rodar `git log --oneline` no repositório GitOps e localizar commit estável.
   - Validar hash na ata anterior (`docs/atas/ata-deploy-<data>.md`).
3. **Reverter via Git**
   - `git revert <commit-problematico>` e abrir PR `hotfix/rollback-<data>`.
   - Garantir aprovação de plataforma e produto.
4. **Executar Workflow**
   - Disparar `CD Staging` via `workflow_dispatch` selecionando branch revertido.
   - Aguardar aprovação manual do ambiente `staging`.
5. **Verificar Saúde**
   - Consultar dashboards Grafana `bmad-agents-001` e `bmad-ops-002`.
   - Validar logs no Kibana e testes de fumaça (`scripts/smoke-tests/` quando disponíveis).
6. **Comunicar Resultado**
   - Atualizar incidente com status `Resolved`.
   - Registrar na ata `docs/atas/ata-incident-<data>.md` a causa raiz e follow-ups.

## Métricas de Sucesso
- Tempo total de rollback < 20 minutos.
- Nenhum alerta crítico aberto após rollback.
- Documentação atualizada em até 24h.
