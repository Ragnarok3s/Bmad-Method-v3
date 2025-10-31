# Resultados do Piloto Operacional (01/07/2024 – 30/07/2024)

## Visão geral
- **Propriedades monitoradas:** Pousada Atlântica, Hotel Serra Verde, Villa das Águas, Solar do Rio, Refúgio das Flores
- **Fonte primária:** `quality/reports/piloto-operacional-exports.csv`
- **Total de registros auditados:** 150 (30 dias × 5 propriedades)

## Indicadores principais
| Indicador | Resultado | Limite | Status |
| --- | --- | --- | --- |
| Desvio máximo de ocupação | 0,05 p.p. | ≤ 2 p.p. | ✅ Aprovado |
| Incidentes de pagamento sem reconciliação | 0 | 0 | ✅ Aprovado |
| Backlog OTA máximo | 3 solicitações | ≤ 5 solicitações | ✅ Aprovado |
| Dias com backlog OTA > 3 | 0 | 0 | ✅ Aprovado |

## Exportações e reconciliações
- Exportações diárias automatizadas para `quality/reports/piloto-operacional-exports.csv` concluídas às 08:00 (registro por data e propriedade).
- Coluna `reconciliation_status` manteve valor `OK` em 100% dos registros, indicando conciliação diária concluída.
- Campo `finance_notes` documenta ausência de incidentes ("Auto conciliação diária sem incidentes").

## Métricas por propriedade
| Propriedade | Ocupação média reportada (%) | Observações |
| --- | --- | --- |
| Pousada Atlântica | 62,94 | Desvio diário ≤ 0,05 p.p. vs PMS |
| Hotel Serra Verde | 62,94 | Receitas alinhadas com PMS após ajustes de arredondamento |
| Villa das Águas | 62,94 | Nenhum alerta de backlog acima de 3 |
| Solar do Rio | 61,94 | Backlog oscilou entre 0 e 3, dentro do limite |
| Refúgio das Flores | 63,94 | Maior ocupação média da amostra, sem incidentes |

## Conclusão
Os critérios de saída definidos no roteiro foram cumpridos. Recomenda-se avançar para o go-live controlado, mantendo o monitoramento diário do `/reports` e checklist de reconciliação financeira como rotina operacional.
