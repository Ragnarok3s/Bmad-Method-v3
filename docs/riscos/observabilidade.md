# Registro de Riscos e Follow-ups de Observabilidade

Utilize esta seção para documentar incidentes, riscos identificados durante as execuções e ações de acompanhamento necessárias.

## Incidentes Recentes
| Data | Descrição | Impacto | Status | Responsável | Data de Revisão |
| --- | --- | --- | --- | --- | --- |
| 2024-04-19 | Threshold de segredo expirado elevado, causando falso positivo. | Médio | Resolvido | Lucas Lima | 2024-04-26 |
| 2024-05-03 | Pico de latência após atualização de pipelines. | Alto | Em acompanhamento | Marcos Paulo | 2024-05-10 |

## Follow-ups Abertos
| Item | Origem | Ação Necessária | Responsável | Prazo |
| --- | --- | --- | --- | --- |
| Ajustar alerta de expiração para 7 dias | Check-in 2024-04-19 | Revisar configuração no Grafana e PagerDuty. | Lucas Lima | 2024-04-22 |
| Otimizar cache de pipelines | Check-in 2024-05-03 | Avaliar ajuste de TTL e impacto em deploy automatizado. | Marcos Paulo | 2024-05-08 |

## Processo de Atualização
1. Registrar novos incidentes imediatamente após identificação.
2. Associar cada follow-up a um ticket em andamento quando disponível.
3. Atualizar status e prazos durante os check-ins documentados em `docs/observabilidade/check-ins.md`.
