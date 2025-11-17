# Runbook: Billing Gateway — Degradação de Latência

## Objetivo
Reduzir a latência P95 do billing gateway para níveis aceitáveis (< 500 ms) quando alertas indicarem degradação prolongada e risco a SLOs.

## Critérios de Disparo
- Alerta `billing_gateway-latency` disparado (P95 > 800 ms por 5 minutos).
- Clientes piloto ou suporte reportando lentidão na autorização de pagamentos.

## Preparação
- Validar alerta e horário de início no Grafana painel **Autorização — Latência P95**.
- Reunir equipe de resposta no `#billing-gateway-war-room`.
- Garantir acesso ao LaunchDarkly, Kubernetes (`prod-brazil`) e scripts de rollback.

## Diagnóstico
1. **Volume de Tráfego**
   - Conferir painel `Billing/Prod` → **Transações por minuto**. Se aumento >30% vs baseline, considerar throttling de parceiros.
2. **Dependências Internas**
   - Checar métricas de `payments-ledger` e `risk-orchestrator` para confirmar se filas ou chamadas downstream estão lentas.
   - Usar `kubectl exec` para capturar `pprof` se CPU do pod > 85% por 5 min.
3. **Integrações Externas**
   - Validar métricas por PSP. Se apenas um PSP lento, preparar failover seletivo.
4. **Recursos de Infraestrutura**
   - `kubectl top pods -n billing-gateway` para verificar CPU/memória.
   - Verificar autoscaler (`kubectl describe hpa billing-gateway`).

## Ações de Mitigação
1. **HPA / Scaling Manual**
   - Se HPA no máximo, aplicar scale out manual: `kubectl scale -n billing-gateway deploy/billing-gateway --replicas <n>`.
   - Confirmar pod readiness (`kubectl get pods -n billing-gateway`).
2. **Feature Flags**
   - Desativar features pesadas (ex.: `billing-gateway.sync_risk_checks`) temporariamente via LaunchDarkly.
3. **Failover PSP**
   - Redirecionar volume para PSP saudável ajustando `billing-gateway.primary_psp` ou reconfigurando pesos no `billing-gateway.routing_weights`.
4. **Rollback**
   - Se degradação começou após deploy recente, executar rollback padrão:
     ```
     scripts/finops/rollback_and_tag.py rollback --service billing-gateway --env prod
     ```
5. **Caching / Circuit Breaker**
   - Ativar cache de tokenização (`/billing-gateway cache on`) se latência associada a chamadas repetidas.

## Comunicação
- Atualizar incidente no PagerDuty com ações adotadas a cada 15 minutos.
- Manter StatusPage como "Performance Degradation" enquanto P95 > 600 ms.
- Notificar time de produto sobre possíveis impactos em conversão.

## Critérios de Recuperação
- Latência P95 sustentada < 500 ms por 3 janelas consecutivas de 5 min.
- Sem quedas correlatas na taxa de sucesso (< 95%).
- Recursos do cluster estabilizados (CPU < 70%, filas downstream normalizadas).

## Pós-Incidente
- Reverter flags temporárias e escala manual quando seguro.
- Rodar `scripts/finops/rollback_and_tag.py tag --service billing-gateway --env prod --notes "latency incident"`.
- Atualizar documentação sobre a causa raiz e melhorias necessárias.
- Agendar análise de capacidade se incidente for recorrente.
