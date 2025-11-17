# Runbook: Billing Gateway — Falha Total de Autorização

## Objetivo
Restaurar a capacidade de autorizar transações quando todos os fluxos do billing gateway retornam erros (HTTP 5xx ou timeouts) ou quando a taxa de sucesso cai abaixo de 10% por mais de 2 minutos.

## Pré-requisitos
- Acesso ao Grafana (`Billing/Prod`) e Loki.
- Credenciais para `billing-gateway` no Kubernetes (contexto `prod-brazil`), script `scripts/finops/rollback_and_tag.py` e permissão de execução.
- Canal PagerDuty incidente aberto e bridge no Slack `#billing-gateway-war-room` ativa.

## Detecção
1. Alertas `billing_gateway-total-outage` ou `payment_authorization.success_rate` < 10% por 2 minutos.
2. Confirmação no dashboard `Billing/Prod` painel **Autorização — Taxa de Sucesso**.
3. Validar logs de erro predominantes no Loki usando a query:
   ```
   {app="billing-gateway", level="error"}
   ```

## Resposta Imediata
1. Confirmar incidente no PagerDuty (se ainda não reconhecido) e assumir a coordenação como L2.
2. Postar atualização inicial no canal Slack com sintoma, horário de início, impacto previsto.
3. Solicitar freeze de deploys para o billing gateway (`/deploy freeze billing-gateway` no Slack-bot).

## Diagnóstico
1. **Saúde do Pod / Deploy**
   - Executar `kubectl get pods -n billing-gateway -l app=billing-gateway`.
   - Se pods em CrashLoopBackOff ou OOMKilled, coletar `kubectl describe pod` e `kubectl logs`.
2. **Dependências Internas**
   - Checar `services/payments-ledger` e `services/risk-orchestrator` via dashboards correspondentes.
   - Validar conexões com Redis e PostgreSQL (`kubectl exec` + `redis-cli PING`, `psql -c 'select 1'`).
3. **Integrações PSP**
   - Verificar painel `External Integrations` para PSPs principais (Stone, Adyen). Se todos indisponíveis, engajar parceiro via telefone/escalation list.

## Mitigação
1. **Restart Controlado**
   - `kubectl rollout restart deploy/billing-gateway -n billing-gateway` se causa aparente for travamento de pod ou fuga de memória.
2. **Rollback**
   - Se incidente iniciou após deploy <30 min, executar rollback:
     ```
     scripts/finops/rollback_and_tag.py rollback --service billing-gateway --env prod
     ```
   - Validar que versão anterior está ativa (`kubectl rollout status`).
3. **Failover PSP**
   - Ajustar feature flag `billing-gateway.primary_psp` para `adyen` ou `stone` (via LaunchDarkly UI) caso apenas um provedor esteja indisponível.
4. **Circuit Breaker**
   - Ativar modo de contingência para tentativas offline (`/billing-gateway contingency on` no Slack-bot) se degradação prolongada.

## Comunicação
- Atualizar StatusPage com incidente "Major Outage" após 10 minutos de impacto confirmado.
- Informar suporte L1 sobre expectativa de retomada.
- Documentar passos executados no ticket do incidente (`INCIDENT-472`).

## Confirmação de Recuperação
1. Taxa de sucesso > 98% por 10 minutos.
2. Latência P95 < 500 ms.
3. Nenhum erro 5xx predominante nos logs.
4. PSPs respondendo 200/201 nas requisições de health-check.

## Encerramento
- Remover freeze de deploys (`/deploy unfreeze billing-gateway`).
- Executar `scripts/finops/rollback_and_tag.py tag --service billing-gateway --env prod` com resumo do incidente.
- Marcar incidente como resolvido no PagerDuty e agendar post-mortem em até 48h.
- Criar follow-up tasks para causas raiz e melhorias.
