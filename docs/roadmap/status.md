# Status do Roadmap — Atualização 2025-02-17

## Visão geral
- **Lançamento Billing Gateway 2024-07-15** aprovado com ressalvas operacionais após sessão de go/no-go; deploy condicionado à execução do check `BILL-230` e monitoramento reforçado das métricas de retenção e observabilidade.【F:releases/2024-07-15-billing-gateway/go-no-go.md†L4-L29】【F:docs/roadmap/readiness-meetings.md†L16-L33】
- **Épico BL-02 (Configuração de Agentes)** passou para estado "Entregue" após a paridade completa da rota `/agentes`, incluindo catálogo dinâmico, filtros acessíveis, telemetria de bundles e testes de regressão publicados.【F:docs/product/backlog.md†L6-L108】【F:frontend/components/agents/AgentsCatalogView.tsx†L1-L236】
- A issue de acessibilidade associada foi encerrada com as novas evidências e componentes partilhados documentados nos testes e backlog.【F:docs/issues/agents-page-feedback-a11y.md†L1-L84】【F:frontend/app/agentes/__tests__/AgentesPage.test.tsx†L1-L115】

## Status detalhado
| Epic | Item de backlog | Situação | Comentários | Próximos passos |
|------|-----------------|----------|-------------|-----------------|
| BL-02 | Configuração de Agentes | Entregue | `/agentes` reutiliza catálogo dinâmico, filtros acessíveis e telemetria `bundle_view`/`bundle_launch`, com testes RTL + `axe` comprovando acessibilidade. | Monitorizar métricas de adoção e manter revisão trimestral de acessibilidade. |

## Lançamentos
| Release | Status | Condições | Próximos passos |
|---------|--------|-----------|-----------------|
| Billing Gateway 2024-07-15 | GO condicional | Executar `BILL-230`, validar retenção automatizada e revisar thresholds de observabilidade antes do deploy. | Owners e prazos definidos na ata da sessão de go/no-go em `docs/roadmap/readiness-meetings.md`. |

## Ações pendentes para o próximo checkpoint
1. Monitorizar tendências de `bundle_view` e `bundle_launch` na variante localizada e reportar em Q3.
2. Reunir feedback de acessibilidade dos clientes piloto após um mês em produção e documentar no backlog.
