# Roadmap – Riscos e Mitigações

## Visão Geral
Atualização de 09/07/2024 consolidando riscos críticos do roadmap Sprint 0 / preparação Sprint 1, conforme decisões do steering operacional e readiness review. Cada risco inclui impacto esperado, plano de ação, responsáveis e checkpoints para acompanhamento semanal.

## Matriz de Riscos Prioritários
| Risco | Impacto Potencial | Probabilidade | Plano de Ação | Owner | Próximo Checkpoint | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Atraso na integração com gateway de pagamentos | Postergar go-live do fluxo de billing e impedir validação de cobranças na Sprint 1 | Alta | Disponibilizar massa de dados mascarada, executar smoke tests E2E e registrar evidências em `docs/integracoes/2024-07-10-pagamentos.md`. Escalar suporte de segurança se houver falhas de compliance. | Camila Duarte (Security Lead) | 11/07/2024 | Em andamento |
| Falta de evidência de retenção automatizada no staging | Risco de não conformidade com LGPD/PCI e bloqueio do gate de Kick-off | Média | Revisar pipelines de retenção, anexar evidências em `docs/evidencias/compliance/privacy-readiness.yaml` e validar com jurídico. | Ana Souza (SRE Lead) | 12/07/2024 | ✅ Concluído em 07/11/2025 (parecer jurídico anexado) |
| Ausência de automação de rollback e tagging de custos | Aumento de MTTR em incidentes e falta de visibilidade financeira para FinOps | Média | Concluir scripts de rollback no Terraform, habilitar tagging automático e validar logs em `docs/evidencias/sla-operacionais-2024-07.md`. | Pedro Barros (DevOps) | 10/07/2024 | ✅ Concluído em 07/11/2025 (artefatos `validation-20251107T155607Z.json`/`rollback-20251107T161307Z.json`) |
| Thresholds de observabilidade desatualizados para serviços críticos | Alarmes falsos e possível perda de incidentes reais, afetando SLA operacional | Baixa | Ajustar thresholds conforme baseline de tráfego, executar revisão no `docs/runbooks/qa-observability-review.md` e registrar aprovação no próximo standup de observabilidade. | Júlia Martins (Operations Manager) | 15/07/2024 | ✅ Concluído em 07/11/2025 (runbook `quality/observability/runbooks/critical-alerts.md` revisto) |

## Indicadores de Impacto
- **Readiness geral estimado em 75%**: impacto direto dos riscos de integrações e compliance.
- **Tolerância máxima**: nenhum risco pode permanecer em status "Em andamento" além de dois checkpoints consecutivos sem atualização de plano.

## Planos de Contingência
- Se o risco de pagamentos persistir após 11/07, considerar fallback com mock de gateway e limitar escopo de billing na Sprint 1.
- **Status 10/07:** Flag `BILLING_GATEWAY_ENABLE_REAL=0` ativada e backend apontando para o mock descrito em [`docs/feature-flags/billing-gateway-mock.md`](feature-flags/billing-gateway-mock.md); cenários reais suspensos até novo checkpoint do steering.
- Para não conformidade de retenção, bloquear deploys que envolvam dados sensíveis até que as evidências estejam anexadas e validadas.
- Caso automações de rollback não estejam prontas até 10/07, agendar janela adicional de infraestrutura em 13/07 com suporte do time de FinOps.

## Registro de Atualizações
- 08/07/2024: inclusão dos riscos de retenção e observabilidade após revisão de readiness.
- 09/07/2024: steering operacional priorizou integração de pagamentos como risco #1 e validou cadência semanal de acompanhamento.
- 07/11/2025: Comitê de readiness notificado sobre a conclusão das ações A2 (retenção automatizada com parecer jurídico) e A4 (observabilidade/FinOps), com evidências anexadas ao dossiê.
- 07/11/2025: Checklist compartilhado com Operações e FinOps após ajuste de retenção (runbook `finops-rollback.md` + manifests Grafana atualizados).
