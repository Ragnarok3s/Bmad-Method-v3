# Runbook: Billing Gateway — Falhas de Reconciliação

## Objetivo
Restaurar a reconciliação correta entre transações autorizadas, capturadas e liquidadas quando divergências ou atrasos são identificados nos relatórios financeiros.

## Contexto
- Processo de reconciliação roda a cada hora via `jobs/reconciliation-worker`.
- Divergências > R$ 5.000 ou atrasos > 2 ciclos disparam alerta `billing_gateway-reconciliation`.

## Detecção
1. Alertas no PagerDuty ou no dashboard **Reconciliação Financeira** mostrando discrepâncias por PSP.
2. Chamados do financeiro relatando diferenças entre ledger interno e extratos PSP.
3. Falhas nos jobs registrados no Airflow (`dags/billing_gateway_reconciliation`).

## Investigação
1. **Validar Escopo**
   - Identificar PSP afetado, período (timestamp) e tipo de divergência (faltando captura, liquidação em duplicidade, etc.).
   - Gerar snapshot diretamente do banco (via `psql`, DataGrip ou ferramenta equivalente) para o PSP/período afetado. Exemplo:
     ```sql
     SELECT i.provider_reference,
            t.transaction_type,
            t.status,
            t.amount_minor,
            t.processed_at
     FROM payment_transactions t
     JOIN payment_intents i ON i.id = t.intent_id
     WHERE i.provider = '<psp>'
       AND t.created_at BETWEEN <from> AND <to>
     ORDER BY t.created_at;
     ```
2. **Checar Jobs**
   - No Airflow UI, verificar estado das tasks `fetch_psp_statements` e `match_transactions`.
   - Em caso de falha, coletar logs (`airflow tasks logs`).
3. **Integridade de Dados**
   - Consultar banco `payments_ledger`:
     ```
     SELECT status, count(*) FROM ledger.transactions
     WHERE psp = '<psp>' AND occurred_at BETWEEN <from> AND <to>
     GROUP BY status;
     ```
   - Verificar tópicos Kafka (`reconciliation.events`) para mensagens com erro.
4. **Dependências Externas**
   - Confirmar disponibilidade das APIs PSP executando `curl` a partir de um pod do billing gateway:
     ```
     kubectl exec -n billing-gateway deploy/billing-gateway -- \
       curl -sS https://<psp-health-endpoint>/status | jq '.status'
     ```

## Ações de Contenção
- Pausar reconciliação automática para PSP afetado: `/billing-gateway reconciliation pause <psp>` (Slack-bot).
- Informar time financeiro sobre congelamento temporário e estimativa de retomada.

## Mitigação
1. **Reprocessamento**
   - Reexecutar DAG no Airflow com `Trigger DAG` para o intervalo afetado.
   - Se falha persistir, acionar reconciliação manual pelo serviço core:
     ```
     kubectl exec -n billing-gateway deploy/billing-gateway-worker -- \
       curl -sS -X POST http://billing-gateway-core:8000/payments/reconciliation \
         -H "Authorization: Bearer <token>"
     ```
2. **Correção de Dados**
   - Ajustar registros inconsistentes atualizando diretamente o banco (após aprovação do financeiro):
     ```sql
     UPDATE payment_transactions
     SET status = '<status>', processed_at = NOW()
     WHERE id = <transaction_id>;
     ```
   - Registrar a correção no incidente e em `payment_reconciliation_logs.notes` para rastreabilidade.
3. **Rollback de Deploy**
   - Se reconciliação quebrou após release, realizar rollback do worker:
     ```
     scripts/finops/rollback_and_tag.py rollback --service billing-gateway-worker --env prod
     ```
4. **Sincronização com PSP**
   - Abrir chamado junto ao PSP fornecendo IDs das transações divergentes quando inconsistência for externa.

## Comunicação
- Atualizar incidente com percentual de divergência e passos executados.
- Enviar resumo para `finance@platform.io` a cada 30 minutos até normalização.
- Registrar número do ticket do PSP (se houver) no incidente.

## Critérios de Recuperação
- Divergência < R$ 500 e < 10 transações após reprocessamento.
- Jobs Airflow executando com status `success` em dois ciclos consecutivos.
- Relatório financeiro alinhado com extratos PSP.

## Encerramento
- Retomar reconciliação automática (`/billing-gateway reconciliation resume <psp>`).
- Executar `scripts/finops/rollback_and_tag.py tag --service billing-gateway-worker --env prod --notes "reconciliation incident"`.
- Garantir que documentação de lições aprendidas foi anexada ao `INCIDENT-472`.
- Agendar revisão com financeiro para confirmar correções definitivas.
