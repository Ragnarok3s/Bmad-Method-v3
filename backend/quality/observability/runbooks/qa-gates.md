# Runbook: Monitoramento dos Gates de Qualidade QA

## Objetivo

Garantir resposta rápida quando o gate crítico de QA reprovar em ambiente QA e orientar ações de rollback/tagging necessárias.

## Métricas

- `quality_gate_status{gate="critical", environment="qa"}`: métrica binária (1 aprovado, 0 reprovado) exportada pelos pipelines de validação.
- Avaliada via expressão `last_over_time(...[5m]) < 1` no alerta `QualityGateCritical` (`grafana/alerts/qa-observability.yaml`).
- Gate específico `billing_gateway_smoke` monitora a suíte `pytest tests/e2e/payments -m "e2e and payments"` com idempotência habilitada.

## Fluxo de Resposta

1. Receber notificação no Slack `#qa-reviews` e confirmar se há build associado (label `build_id`).
2. Consultar o dashboard "QA Gates" no Grafana para entender o contexto do gate e logs de falha.
3. Se a reprovação estiver vinculada a regressões críticas, executar:
   ```bash
   scripts/finops/rollback_and_tag.py rollback --environment qa --release "$BUILD_ID"
   ```
4. Verificar se o build possui artefatos de aprovação em `docs/compliance/releases/<release>/` antes de executar rollback.
5. Abrir ticket no Jira do time de QA com captura de tela e logs anexos.
6. Após correção, rodar novamente o pipeline de QA e confirmar que o alerta foi resolvido.
7. Registrar tags de custo com:
   ```bash
   scripts/finops/rollback_and_tag.py tag --environment qa --owner squad-qa --cost-center QA01
   ```
8. Atualizar `releases/ledger.json` se houver mudança de estado (ativação/cancelamento do release).

## Escalonamento

- Persistência acima de 2 execuções consecutivas: envolver gerente de QA.
- Impacto em release programada: comunicar Release Manager e avaliar congelamento de deploy.

## Evidências

- ID do pipeline e commit associado.
- Saída dos comandos de rollback/tagging anexada ao ticket.
- Atualização do status do gate após correção.
- Link para o sumário executivo em `releases/<release>/README.md` quando aplicável.
