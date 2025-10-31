# Testes de Carga – Módulo de Reservas (Sprint 1)

## Contexto
Os testes de carga foram executados em 17 e 18 de julho de 2024 com o objetivo de validar a capacidade do módulo de reservas processar picos equivalentes a um evento sazonal (2x volume médio) sem degradação perceptível para os utilizadores piloto. As execuções utilizaram o ambiente de staging com dados sintéticos mascarados e integrações OTA reais conectadas ao sandbox dos parceiros.

## Metodologia
- **Ferramenta:** k6 (script `tests/perf/reservas-load.js`) integrado ao pipeline de CI noturno.
- **Cenários simulados:**
  1. Consulta de disponibilidade + criação de reserva (fluxo web) com concorrência de 120 VUs.
  2. Modificação em massa de reservas OTA (sync background) com 40 workers concorrentes.
  3. Cancelamento e geração de voucher com 60 VUs.
- **Duração:** ramp-up de 5 minutos, patamar constante de 20 minutos e ramp-down de 5 minutos.
- **Critérios de sucesso:** percentil 95 de resposta < 1,2 s, taxa de erro < 1% e consumo de CPU do serviço `reservas-api` < 75%.

## Resultados
| Cenário | Throughput médio (req/s) | P95 Latência | Erros (%) | CPU média | Observações |
| --- | --- | --- | --- | --- | --- |
| Fluxo web reserva | 142 | 0,94 s | 0,21% | 63% | Dentro dos limiares; spike inicial absorvido pela camada de cache. |
| Sync OTA massivo | 88 | 1,27 s | 0,35% | 71% | Ultrapassou P95 alvo em 0,07 s durante 2 minutos; ajuste de batch size aplicado. |
| Cancelamento + voucher | 101 | 0,82 s | 0,12% | 58% | Estável; impacto reduzido no banco relacional graças à fila assíncrona. |

## Análise e Ações
- A saturação momentânea no cenário OTA coincidiu com aumento de IO no cluster Redis. Reconfigurado limite de conexões e aplicado novo tamanho de lote (200→150 itens) com reteste satisfatório.
- Foi adicionado alerta proativo no Grafana (`LoadTest OTA P95 > 1.2s`) com notificação para o canal #platform-alerts.
- Logs de aplicações foram enriquecidos com `trace_id` para correlação com as métricas de k6 e do APM.

## Conformidade com DoD
- [x] Cenários críticos documentados e automatizados.
- [x] Evidências exportadas (relatórios k6 + screenshot Grafana) arquivadas no sharepoint do time de QA.
- [x] Plano de mitigação para desvios acima do limiar aprovado pelos leads de Engenharia e Operações.
- [x] Checklist de performance atualizado no pacote DoD com referência a este relatório.
