# Status do Roadmap — Atualização 2025-02-17

## Visão geral
- **Lançamento Billing Gateway 2024-07-15** aprovado com ressalvas operacionais após sessão de go/no-go; deploy condicionado à execução do check `BILL-230` e monitoramento reforçado das métricas de retenção e observabilidade.【F:releases/2024-07-15-billing-gateway/go-no-go.md†L4-L29】【F:docs/roadmap/readiness-meetings.md†L16-L33】
- **Épico BL-02 (Configuração de Agentes)** permanece em risco porque a experiência localizada em `/agentes` não entrega catálogo dinâmico, filtros acessíveis nem pré-configuração com telemetria, contrariando os critérios de aceite publicados no roadmap.【F:docs/product-roadmap.md†L17-L27】【F:docs/product/backlog.md†L6-L34】
- A issue de acessibilidade associada continua aberta até que as ações BL-02-T1 a BL-02-T3 sejam concluídas e evidenciadas.【F:docs/product/backlog.md†L36-L55】

## Status detalhado
| Epic | Item de backlog | Situação | Comentários | Próximos passos |
|------|-----------------|----------|-------------|-----------------|
| BL-02 | Configuração de Agentes | Em risco | Variante `/agentes` entrega catálogo estático sem filtros ou telemetria; critérios de aceite não cumpridos. | Executar BL-02-T1 para paridade funcional, seguido de BL-02-T2/T3 para QA e design system. |

## Lançamentos
| Release | Status | Condições | Próximos passos |
|---------|--------|-----------|-----------------|
| Billing Gateway 2024-07-15 | GO condicional | Executar `BILL-230`, validar retenção automatizada e revisar thresholds de observabilidade antes do deploy. | Owners e prazos definidos na ata da sessão de go/no-go em `docs/roadmap/readiness-meetings.md`. |

## Ações pendentes para o próximo checkpoint
1. Confirmar planeamento das tarefas BL-02-T1 a BL-02-T3 na próxima sprint de produto.【F:docs/product/backlog.md†L48-L55】
2. Reavaliar status após entrega das tarefas e anexar evidências (prints, logs de testes) antes de considerar o épico concluído.
