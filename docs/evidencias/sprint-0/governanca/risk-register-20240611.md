# Extrato da Matriz de Risco - Sprint 0

| ID | Descrição | Probabilidade | Impacto | Classificação | Plano de Mitigação |
| --- | --- | --- | --- | --- | --- |
| R-21 | Falha na esteira de deploy após mudança de secrets | Baixa | Alto | Médio | Revisão de secrets automatizada antes de cada release. |
| R-22 | Déficit de observabilidade em serviços legados | Média | Médio | Médio | Expandir agentes de coleta até sprint 1. |
| R-23 | Instabilidade da imagem `platform-api:1.0.0-rc1` em STG | Média | Alto | Médio | Monitorar métricas por 48h e manter plano de rollback pronto. |
