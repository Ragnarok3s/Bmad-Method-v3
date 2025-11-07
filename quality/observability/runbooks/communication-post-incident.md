# Communication Post-Incident Runbook

## Objetivo
Garantir comunicações consistentes e aprovadas após incidentes, fornecendo mensagens padronizadas para os canais Slack e Microsoft Teams. O fluxo cobre todo o ciclo de comunicação após um incidente de produção, desde o primeiro alerta até o encerramento e lições aprendidas.

## Quando acionar
- Incidentes classificados como **Severidade 1 ou 2**.
- Eventos com impacto a clientes externos.
- Acordos de suporte que exijam atualização proativa.

## Equipe responsável
| Papel | Responsabilidades principais | Titular | Suplente |
| --- | --- | --- | --- |
| Support Commander | Coordena comunicações, valida mensagens, controla prazos | @ana.suporte | @marcos.noc |
| Incident Scribe | Mantém runbook atualizado, coleta dados factuais, alimenta métricas | @joao.ops | @aline.rel |
| Approval Lead | Revisa mensagens antes de disparo, confirma aderência ao checklist | @renata.quality | @igor.audit |

## Fluxo resumido
1. **Avaliação inicial**: Support Commander avalia severidade e coleta dados.
2. **Primeira comunicação**: Incident Scribe gera mensagem inicial e envia para aprovação.
3. **Atualizações recorrentes**: Mensagens periódicas até mitigação completa.
4. **Encerramento**: Comunicação final com causa raiz e próximos passos.
5. **Resumo executivo**: Postagem consolidada após post-mortem.

## Checklist de aprovação
- [ ] Mensagem contém identificação do incidente (`{incident_id}`) e horário (`{timestamp}`).
- [ ] Impacto resumido com métricas de clientes afetados.
- [ ] Ações de mitigação listadas com responsáveis.
- [ ] Próxima atualização (quando aplicável).
- [ ] Link para documentação ou status page.
- [ ] Revisão pelo Approval Lead registrada em `docs/support/approvals`.

## Templates para automação
Os templates abaixo são consumidos diretamente pela automação `scripts/support/runbook_messenger.py`. Utilize as chaves indicadas ao preencher variáveis.

```json runbook_templates
{
  "templates": {
    "initial_update": {
      "slack": "🚨 Incidente {incident_id} - Atualização Inicial\nSeveridade: {severity}\nImpacto: {impact_summary}\nMitigação em andamento: {mitigation_actions}\nComandante: {commander}\nPróxima atualização: {next_update}\nStatus page: {status_page}",
      "teams": "🚨 **Incidente {incident_id} - Atualização Inicial**\n- **Severidade:** {severity}\n- **Impacto:** {impact_summary}\n- **Mitigação em andamento:** {mitigation_actions}\n- **Comandante:** {commander}\n- **Próxima atualização:** {next_update}\n- **Status page:** {status_page}"
    },
    "resolution": {
      "slack": "✅ Incidente {incident_id} - Resolução\nResumo do impacto: {impact_summary}\nCausa raiz preliminar: {root_cause}\nAções corretivas aplicadas: {corrective_actions}\nTempo para recuperar: {ttr}\nChecklist pós-incidente: {post_incident_link}",
      "teams": "✅ **Incidente {incident_id} - Resolução**\n- **Resumo do impacto:** {impact_summary}\n- **Causa raiz preliminar:** {root_cause}\n- **Ações corretivas aplicadas:** {corrective_actions}\n- **Tempo para recuperar:** {ttr}\n- **Checklist pós-incidente:** {post_incident_link}"
    },
    "postmortem_summary": {
      "slack": "📝 Incidente {incident_id} - Conclusões do Post-Mortem\nImpacto final: {impact_summary}\nLições aprendidas: {lessons_learned}\nAções de longo prazo: {long_term_actions}\nResponsáveis: {owners}\nPrazo de acompanhamento: {follow_up_deadline}\nRelatório completo: {postmortem_link}",
      "teams": "📝 **Incidente {incident_id} - Conclusões do Post-Mortem**\n- **Impacto final:** {impact_summary}\n- **Lições aprendidas:** {lessons_learned}\n- **Ações de longo prazo:** {long_term_actions}\n- **Responsáveis:** {owners}\n- **Prazo de acompanhamento:** {follow_up_deadline}\n- **Relatório completo:** {postmortem_link}"
    }
  }
}
```

## Procedimento detalhado
### 1. Geração da mensagem
1. Incident Scribe coleta os dados necessários.
2. Executa o script `runbook_messenger.py` com `--dry-run` para validação prévia.
3. Ajusta variáveis faltantes e submete para aprovação do Approval Lead.

### 2. Aprovação
1. Approval Lead confirma aderência ao checklist.
2. Registro da aprovação é feito no arquivo correspondente em `docs/support/approvals/`.
3. Support Commander agenda envio conforme janela acordada com stakeholders.

### 3. Disparo
1. Executar novamente o script sem `--dry-run` e com `--webhook-url` configurado.
2. Garantir que o log de auditoria seja armazenado (stdout capturado ou pipeline CI).
3. Atualizar status page e anexar links relevantes à comunicação.

### 4. Pós-incidente
1. Preparar relatório final no máximo 48h após resolução.
2. Validar ações de longo prazo com SRE e Produto.
3. Atualizar métricas de confiabilidade e evidências em `quality/reports`.

## Métricas de sucesso
- SLA de primeira comunicação abaixo de 15 minutos.
- Engajamento dos stakeholders (visualizações no canal) acima de 90%.
- Checklist de aprovação sem itens faltantes em 100% das ocorrências.

## Referências
- [Status Page Corporativa](https://status.example.com)
- [Guia de Post-Mortem](../../reports/postmortem-guide.md)
- [Política de Comunicações de Incidentes](../../policies/incident-communications.md)
