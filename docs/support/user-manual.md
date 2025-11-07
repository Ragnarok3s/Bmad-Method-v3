# Manual de Suporte - DR e Escalonamento

## Contexto
Este manual complementa o `manual-do-usuario.md` com foco em continuidade de negócios. Após a release 2024-07-15 do Billing Gateway foram consolidados novos fluxos de aprovação, automação de permissões e monitoramento de idempotência.

## Lacunas Identificadas (Atualização 2024-07-20)
- ✅ Checklist formal de DR por release publicado em `docs/support/dr-checklist.md` com registro de assinatura.
- ✅ Referências explícitas aos runbooks de recuperação, alerta crítico e FinOps consolidadas abaixo.
- ✅ Automatização de comunicação com stakeholders pós-incidente entregue (ticket `SUP-211`).

## Automação de Comunicação Pós-Incidente (SUP-211)
Com a automação concluída, as equipes de suporte podem gerar e disparar mensagens padronizadas diretamente dos runbooks. O fluxo opera em três etapas principais:

1. **Preparação dos dados**: coletar informações necessárias no runbook `quality/observability/runbooks/communication-post-incident.md` (variáveis como `incident_id`, `severity`, `impact_summary`, etc.).
2. **Validação prévia**: executar o script `scripts/support/runbook_messenger.py` em modo `--dry-run` para revisar o texto renderizado.
3. **Envio definitivo**: reenviar o comando sem `--dry-run` e com `--webhook-url` do Slack ou Teams aprovado.

> **Fluxo da preparação**: Coletar variáveis obrigatórias, preencher placeholders do runbook e validar o payload com `--dry-run` antes de seguir para o disparo.

### Como executar
```bash
python scripts/support/runbook_messenger.py \
  --channel slack \
  --stage initial_update \
  --var incident_id=SUP-INC-845 \
  --var severity=S1 \
  --var impact_summary="Clientes Checkout API indisponíveis" \
  --var mitigation_actions="Reroute para região secundária" \
  --var commander="@ana.suporte" \
  --var next_update="15 min" \
  --var status_page=https://status.example.com/incident/845 \
  --dry-run
```

Ao aprovar o conteúdo, efetue o disparo:

```bash
python scripts/support/runbook_messenger.py \
  --channel teams \
  --stage resolution \
  --context /var/run/support/incident-845.json \
  --webhook-url "$SUPPORT_TEAMS_WEBHOOK"
```

> **Fluxo de envio**: Após validação, reutilizar o contexto salvo (ou variáveis inline) e executar o comando com `--webhook-url` autorizado para propagar a mensagem ao canal selecionado.

### Boas práticas
- Documentar a aprovação no arquivo dedicado da ocorrência em `docs/support/approvals/` (ver exemplo em `2024-07-20-sup-211-automation.md`).
- Utilizar `--verbose` quando precisar de troubleshooting adicional (carrega logs detalhados do parser de runbooks).
- Manter os webhooks restritos via secret manager; nunca registrar URLs nos tickets ou em canais públicos.
- Garantir que os placeholders não utilizados permaneçam protegidos pelo fallback `{placeholder}` exibido na mensagem, evitando comunicação incompleta.

## Planos de Recuperação
- Seguir o **Runbook de Recuperação de Desastres** localizado em `quality/observability/runbooks/disaster-recovery.md` (rev. 2024-07-15).
- Mapear serviços críticos utilizando o inventário `docs/observability-stack.md` antes de iniciar a restauração.
- Validar integridade de dados conforme procedimentos descritos em `quality/pci.py` e registrar evidências em `quality/reports/`.
- Confirmar que as permissões dos artefatos da release vigente estão em modo `0644` utilizando `scripts/compliance/lock_permissions.sh check`.

## Escalonamento para Suporte L2
1. Revisar critérios definidos no runbook `quality/observability/runbooks/escalation-l2.md` (inclui matriz de especialistas atualizada).
2. Abrir ticket na fila `SUP-L2` com o template padrão (impacto, tempo estimado, serviços afetados, link para release em `releases/<data>/README.md`).
3. Registrar bridge de comunicação e notificar os contatos de DR listados no runbook de recuperação.
4. Atualizar status a cada 30 minutos até estabilização, anexando prints dos dashboards de observabilidade e evidências do script de rollback quando executado.

## Pós-Incidente
- Registrar lições aprendidas em até 48h no repositório `quality/reports/`.
- Garantir atualização do checklist de DR da release corrente com assinatura registrada.
- Validar que os requisitos de comunicação e compliance foram cumpridos com o time de segurança e arquivar o ticket na pasta `docs/compliance/approvals/` correspondente.

## Monitoramento Contínuo
- Acompanhar o alerta `BillingGatewayIdempotency` em conjunto com os alertas descritos em `quality/observability/runbooks/critical-alerts.md`.
- Registrar no ledger `releases/ledger.json` qualquer alteração de estado (ativação/rollback) utilizando `scripts/finops/rollback_and_tag.py record-release`.

## Comunicado Pagamentos (Flag de Contingência)
- **Mensagem padrão para o canal `#support-billing`**: “O módulo de pagamentos segue operando em modo sandbox. Não há cobranças reais até nova sinalização do steering. Registre solicitações financeiras no playbook manual e mantenha o flag `BILLING_GATEWAY_ENABLE_REAL` desligado.”
- **Abertura de chamados**: categorize como "Solicitação" com tag `payments-mock` e referencie o guia [`docs/feature-flags/billing-gateway-mock.md`](../feature-flags/billing-gateway-mock.md).
- **Procedimento para retomar o PSP real**:
  1. Confirmar aprovação do steering no roadmap de riscos.
  2. Coordenar com Engenharia para definir `BILLING_GATEWAY_ENABLE_REAL=1` no ambiente alvo.
  3. Solicitar evidências das suítes `pytest -m real_gateway` e anexar no ticket.
  4. Atualizar este manual e o README da release ativa informando a mudança de estado.
- **Rollback**: caso ocorram incidentes, reverter o flag para `0`, atualizar o canal com a mensagem “Reversão aplicada — permanecemos em modo sandbox” e registrar o evento no ledger de releases.

## Próximos Passos
- Estender a automação para incidentes preventivos (alertas de capacidade e degradações planejadas).
- Integrar métricas de MTTR/MTBF diretamente no dashboard de suporte.
- Atualizar este manual a cada release após revisão da equipe de suporte.
