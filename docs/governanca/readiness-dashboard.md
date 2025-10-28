# Dashboard de Readiness – Sprint 0 / Preparação Sprint 1

## Sumário Executivo (08/07/2024)
- **Readiness geral em 75%** considerando média ponderada dos pilares de backlog, ambientes, integrações e compliance.
- Backlog priorizado alcançou 86% após realocação de épicos dependentes do parceiro de pagamentos.
- Ambientes críticos configurados em 82%; resta concluir automações de rollback e tagging de custos no ambiente de staging.
- Cobertura de integrações testadas subiu para 58% com smoke tests de cadastro e inventário executados no staging.
- Nenhum blocker crítico para o gate de Kick-off, mas há ações prioritárias para elevar cobertura de testes de integrações.

## Indicadores-Chave
| Indicador | Meta | Status Atual | Tendência vs. semana anterior | Observações |
| --- | --- | --- | --- | --- |
| % Backlog Prioritário coberto com critérios DoR/DoD | ≥ 90% | **86%** | ▲ (+8 p.p.) | Priorização de épicos BL-HK finalizada; pendências nos épicos de billing. |
| % Ambientes Configurados com scripts automatizados | ≥ 85% | **82%** | ▲ (+12 p.p.) | Pipelines de provisioning prontos; faltam automações de rollback e tagging de custos. |
| % Integrações críticas testadas end-to-end | ≥ 70% | **58%** | ▲ (+18 p.p.) | Smoke tests de cadastro e inventário aprovados; gateway de pagamentos aguardando massa de testes mascarada. |
| Conformidade e segurança (checklist LGPD/PCI) | 100% dos controles obrigatórios | **92%** | ► (estável) | Falta evidência de revisão de retenção de dados no staging. |
| Alertas operacionais críticos resolvidos (< 48h) | 100% | **95%** | ▲ (+5 p.p.) | Um alerta de observabilidade permanece aberto aguardando ajuste de thresholds. |

## Status por Pilar
### Backlog & Produto
- Todos os épicos obrigatórios mapeados e priorizados com owners definidos.
- Itens de billing aguardam atualização de dependências externas até 11/07.

### Ambientes & Infraestrutura
- Ambiente de staging disponível; scripts `scripts/test-unit.sh` e `scripts/test-integration.sh` integrados ao pipeline.
- Automação de rollback e tagging de custos pendentes para conclusão do checklist.

### Integrações & Qualidade
- Smoke tests executados para cadastro e inventário com sucesso.
- Pagamentos e parceiros externos com plano de dados mascarados em homologação para 10/07.

### Compliance & Segurança
- Checklist LGPD/PCI validado em 92%; faltam evidências de retenção automatizada.
- Revisão de secrets concluída; próxima auditoria agendada em 15/07.

## Ações Prioritárias
- [ ] Concluir automação de rollback e tagging de custos no ambiente de staging — Owner: Pedro Barros — Due: 10/07.
- [ ] Executar smoke tests do gateway de pagamentos com massa mascarada e anexar logs em `docs/integracoes/2024-07-10-pagamentos.md` — Owner: Camila Duarte — Due: 11/07.
- [ ] Publicar evidência de retenção de dados no staging em `docs/evidencias/compliance/privacy-readiness.yaml` — Owner: Ana Souza — Due: 12/07.

## Histórico Semanal
| Data | % Backlog Prioritário | % Ambientes Configurados | % Integrações Testadas | Comentários |
| --- | --- | --- | --- | --- |
| 05/07/2024 | 78% | 70% | 40% | Dashboard inicial em construção; aguardando publicação oficial. |
| 08/07/2024 | 86% | 82% | 58% | Template de dashboard publicado; integrações com pagamentos em andamento. |

## Referências
- `docs/atas/ata-readiness-review-2024-07-08.md`
- `docs/atas/ata-steering-operacional-2024-07-09.md`
- `docs/atas/checkpoints-semanais.md`
- `docs/revisao-validacao-artefatos.md`
