# Issue: Falha de importação `record_dashboard_alerts` em `services.core.metrics`

## Problema
A suíte `pytest` falha na coleta porque `services/core/services/__init__.py` importa `record_dashboard_alerts`, mas a função não está definida em `services/core/metrics.py`.

## Evidências
- Execução de `pytest` resulta em `ImportError: cannot import name 'record_dashboard_alerts'`.
- O arquivo `services/core/metrics.py` não declara a função esperada.

## Impacto
- Nenhum teste Python consegue ser executado, bloqueando validações automatizadas do serviço Core.
- Métricas de alertas críticos não são registradas, reduzindo visibilidade operacional.

## Ações recomendadas
1. Implementar a função `record_dashboard_alerts` (ou ajustar o import) em `services/core/metrics.py`.
2. Adicionar testes cobrindo o registro de alertas para evitar regressões futuras.
3. Reexecutar `pytest` garantindo que a suíte complete sem erros de importação.
