# Métricas da Sprint 1

## Visão Geral
A Sprint 1 concentrou-se em estabilizar o fluxo de reservas, consolidar as integrações OTA e fechar os ajustes operacionais de housekeeping. As métricas abaixo foram coletadas no período de 08 a 19 de julho de 2024 a partir do dashboard manual governado pelo capítulo de Analytics, do pipeline CI/CD e dos relatórios de incidentes. Todas as séries consideram apenas os clientes piloto ativos.

- **Cobertura de metas:** 11 de 13 indicadores atingiram ou superaram o limiar-alvo definido no pacote de métricas do MVP.
- **Alertas críticos:** Dois indicadores dispararam alertas de atenção (latência OTA e backlog de incidentes), ambos mitigados dentro da própria sprint.
- **Tendência geral:** Melhoria consistente em métricas de tecnologia (+12 p.p. de cobertura de testes) e estabilidade nas métricas operacionais.

## Indicadores Consolidados
| Domínio | Métrica | Resultado Sprint 1 | Meta | Status |
| --- | --- | --- | --- | --- |
| Produto | Taxa de ocupação média (pilotos) | 68,4% | ≥ 65% | ✅ Cumpriu |
| Produto | NPS Gestor (survey quinzenal) | 44 | ≥ 40 | ✅ Cumpriu |
| Produto | Utilização de relatórios semanais | 96% gestores ativos | 100% | ⚠️ Abaixo do alvo (seguir plano de capacitação) |
| Operações | Tempo médio de resposta a hóspedes | 24 min | ≤ 30 min | ✅ Cumpriu |
| Operações | Tempo médio de resolução de incidentes críticos | 4h32 | ≤ 4h | ⚠️ Acima do alvo; planos de follow-up em andamento |
| Operações | Tarefas de housekeeping concluídas no prazo | 97,3% | ≥ 95% | ✅ Cumpriu |
| Tecnologia | Lead time commit→deploy (staging) | 18h | ≤ 24h | ✅ Cumpriu |
| Tecnologia | Deploys bem-sucedidos por semana | 9/10 (90%) | ≥ 85% | ✅ Cumpriu |
| Tecnologia | Cobertura de testes unitários | 71% | ≥ 65% | ✅ Cumpriu |
| Tecnologia | Cobertura de testes de integração | 56% | ≥ 50% | ✅ Cumpriu |
| Tecnologia | Disponibilidade API core | 99,62% | ≥ 99,5% | ✅ Cumpriu |
| Tecnologia | Latência média sincronização OTA | 5,6 min | ≤ 5 min | ⚠️ Acima do alvo; alerta mantido em observação |
| Tecnologia | Taxa de erro em reservas (5xx) | 0,18% | ≤ 0,5% | ✅ Cumpriu |

## Destaques e Ações
1. **Latência OTA:** identificada degradação pontual durante janela de importação massiva de inventário. Ajuste de batch concluído (ticket OPS-218) e monitorização reforçada com alerta de 4 min.
2. **Incidentes críticos:** três incidentes (INC-145, INC-148, INC-152) excederam 4h; todos relacionados a integrações de pagamentos. QA e Security mapearam plano de contingência para Sprint 2.
3. **Capacitação de relatórios:** dois gestores ainda dependem de suporte manual para exportações. Product Ops executará treinamento remoto e atualização do guia rápido.
4. **Cobertura de testes:** incremento devido à incorporação dos novos cenários de reservas concorrentes e ao suite de testes de carga automatizada.

## Próximos Passos
- Automatizar ingestão OTA e CI/CD conforme roadmap de métricas (Sprint 2).
- Publicar dashboard definitivo no Looker Studio com refresh horário.
- Revisitar limiares operacionais durante a retro da Sprint 2 e atualizar o pacote de métricas caso necessário.
