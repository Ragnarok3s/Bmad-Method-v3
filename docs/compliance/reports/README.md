# Relatórios Automatizados de Compliance

Este diretório armazena os relatórios gerados automaticamente pelo pipeline
`compliance-checks.yml` e pelo script `scripts/compliance/collect_evidence.py`.

## Estrutura

- `compliance-report-<AAAA-MM>.json`: resumo estruturado das evidências coletadas
  (hashes, presença de arquivos críticos, dashboards configurados).
- `compliance-report-<AAAA-MM>.md`: versão em Markdown para distribuição em
  auditorias e reuniões executivas.
- `artifacts/`: pasta utilizada pelo pipeline para armazenar artefatos
  temporários quando necessário.

## Como gerar manualmente

```bash
python scripts/compliance/collect_evidence.py collect --format both --period 2024-08
```

O comando acima cria arquivos JSON/Markdown com as evidências disponíveis. É
possível executar apenas a validação de documentação com:

```bash
python scripts/compliance/collect_evidence.py lint
```

## Política de retenção

- Manter pelo menos 12 meses de histórico para atender auditorias SOC 2/ISO.
- Publicar o relatório do mês corrente até o quinto dia útil.
- Se evidências sensíveis precisarem ser removidas do repositório, armazenar o
  arquivo original em um cofre seguro e manter apenas o hash e metadados aqui.
