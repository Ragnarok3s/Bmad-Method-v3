# Registro de Check-ins Pós-Execução

Utilize esta tabela para documentar os resultados de cada execução de scripts de infraestrutura, destacando impactos observados na observabilidade.

| Data | Janela/Script | Responsável | Resultados | Ações Corretivas | Próximos Passos |
| --- | --- | --- | --- | --- | --- |
| 2024-04-05 | Segunda 09:00 / `provisionar_cluster.sh` | Ana Souza | Cluster provisionado sem incidentes. Dashboards atualizados. | Nenhuma. | Monitorar consumo de recursos por 24h. |
| 2024-04-19 | Quarta 14:00 / `sincronizar_segredos.py` | Lucas Lima | Alertas de segredo expirado normalizados após sync. | Ajustar alerta de expiração para 7 dias. | Atualizar thresholds em Grafana. |
| 2024-05-03 | Sexta 19:00 / `atualizar_pipelines.sh` | Marcos Paulo | Pipelines atualizadas; pico de latência monitorado. | Abrir follow-up para otimização de cache. | Verificar impacto no deploy automatizado. |

## Como Atualizar
1. Adicione nova linha ao final da tabela para cada execução.
2. Vincule evidências na pasta `docs/evidencias/observabilidade/`.
3. Caso existam incidentes ou follow-ups, registrar também em `docs/riscos/observabilidade.md`.
