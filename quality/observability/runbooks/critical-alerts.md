# Runbook: Alertas Críticos de Observabilidade (Staging)

## Objetivo

Descrever a resposta operacional para alertas críticos configurados nos painéis de observabilidade de staging, incluindo limites revisados de erro, disponibilidade, falhas de pipeline e engajamento.

## Alertas Monitorados

| Alerta | Métrica | Limite Crítico | Ação Primária |
| --- | --- | --- | --- |
| `PlaybookErrorRate` | Taxa de respostas 5xx vs total de requisições | > 0,8% com pelo menos 250 requisições em 5 minutos | Engajar SRE on-call e iniciar checklist de mitigação |
| `AvailabilityDrop` | Disponibilidade derivada de requisições 2xx-4xx | < 99,7% sustentados por 10 minutos e volume ≥ 400 requisições | Avaliar rollback automático e validar impacto de usuários |
| `PipelineFailureBurst` | Falhas acumuladas de pipelines de deploy em 10 minutos | ≥ 3 falhas | Acionar time DevOps e interromper deploy até estabilidade |
| `EngagementDrop` | Page views agregados em 30 min vs média da última hora | Queda ≥ 25% | Confirmar origem (incidente, experimento, release) e notificar produto |
| `LatencySloBreach` | Latência HTTP P95 (histogram_quantile 0.95) | > 450 ms por 5 minutos consecutivos | Investigar regressão de performance e acionar rollback |

## Procedimento Geral

1. Validar painel Grafana correspondente (`grafana/alerts/staging.yaml`).
2. Consultar logs no Loki/Elastic para correlacionar eventos de erro.
3. Atualizar status no canal `#incident` e abrir incidente no PagerDuty se ainda não existir.
4. Seguir ação primária do alerta. Em caso de `AvailabilityDrop`, `PlaybookErrorRate` ou `BillingGatewayIdempotency`, executar `scripts/finops/rollback_and_tag.py rollback` com o release afetado para iniciar reversão automatizada.
5. Registrar aprendizados e tags de custo do incidente com `scripts/finops/rollback_and_tag.py tag --environment staging` ao estabilizar.

## Indicadores de Recuperação

- Taxa de erro < 0,8% por ao menos 15 minutos.
- Latência HTTP P95 < 450 ms em três janelas consecutivas de 5 minutos.
- Disponibilidade ≥ 99,7% por 2 janelas consecutivas de 10 minutos.
- Pipelines executando com sucesso por pelo menos uma hora.
- Engajamento retomando 95% da média anterior à queda.
- Para `BillingGatewayIdempotency`, contagem de duplicidades = 0 por 30 minutos.

## Escalonamento

- Persistência acima de 30 minutos: escalar para gerente de plataforma.
- Ocorrência repetida em 24h: envolver FinOps para avaliar custo de mitigação e necessidade de capacity planning.

## Evidências

- Screenshot do painel correspondente.
- Número do incidente PagerDuty.
- Saída dos comandos de rollback/tagging anexada ao ticket.

## Auditoria de 07/11/2025

- Limites recalibrados para reduzir MTTR: erro crítico agora dispara a 0,8% com 250+ requisições, disponibilidade alerta abaixo de 99,7% e latência P95 a partir de 450 ms.
- Burst de falhas de pipeline ajustado para ≥3 ocorrências em 10 minutos, enquanto o alerta de engajamento monitora queda ≥25% para alinhar com baseline pós-experimentos.
- Execuções `python scripts/finops/rollback_and_tag.py validate --environment staging --dry-run` e `python scripts/finops/rollback_and_tag.py rollback --environment staging --dry-run` confirmaram geração dos artefatos `validation-20251107T155607Z.json` e `rollback-20251107T155611Z.json` em `artifacts/finops/`, documentando readiness para automação de resposta.
