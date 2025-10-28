# Datasets Sintéticos para Jobs de Seed

Este diretório armazena os datasets versionados utilizados pelas rotinas de seed dos ambientes dev e staging.

- `guests_relational.csv`: registros mascarados para a tabela relacional `guests`, contendo identificadores truncados (`***XXXX`) e domínios `@example.test` conforme `quality/privacy.py`.
- `guest_preferences.json`: preferências em formato JSON alinhadas à coleção NoSQL `guest_preferences`, com os mesmos tokens sintéticos aplicados.

## Controles de Privacidade

Os arquivos são validados automaticamente por `tests/unit/test_seed_datasets.py`, que garante a conformidade com `quality/privacy.is_record_synthetic`. A execução das rotinas de seed registra métricas em `artifacts/seed/` para auditoria e monitoramento (ver `grafana/alerts/seed-jobs.yaml`).
