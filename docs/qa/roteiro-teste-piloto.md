# Roteiro de Testes Piloto (Dados de Campo)

## Objetivo
Garantir que as rotinas críticas de reservas, pagamentos e integrações OTA estejam validadas em ambiente piloto antes da abertura geral do MVP. O foco é capturar dados de campo reais e acompanhar a adoção via dashboards QA (`/reports`).

## Escopo do Piloto
- **Propriedades participantes**: selecionar 3 hotéis urbanos e 2 resorts com mix de tarifas flexíveis e não reembolsáveis.
- **Período de observação**: 30 dias corridos com janelas quinzenais de checkpoint.
- **Métricas base**: ocupação, ADR e receita calculadas pelo serviço `backend/services/core/analytics/reports.py` com filtros por propriedade.

## Preparação
1. Instrumentar o backend executando `pytest -m reservations/payments/ota` via `./scripts/test-domain.sh` para garantir estabilidade das suites críticas antes de cada onda do piloto.
2. Publicar relatório CSV diário (`Exportar CSV` na página `/reports`) e arquivar no diretório compartilhado da squad QA.
3. Registrar feedback qualitativo dos gerentes das propriedades em formulário padrão (Notion) com foco em discrepâncias de ocupação e reconciliação financeira.

## Execução
| Semana | Foco | Dados de Campo | Responsáveis |
| --- | --- | --- | --- |
| S1 | Reservas + Check-in/out | Exportação diária do `/reports` para propriedades piloto, validação manual do total de UH·noite | QA Lead + PM Ops |
| S2 | Captura/Cobrança | Conferência dos relatórios de receita e ADR por moeda vs. extratos do gateway | QA Lead + Financeiro |
| S3 | Integrações OTA | Monitoramento do backlog OTA e reconciliação em `tests/unit/test_ota_sync_contracts.py` | QA Lead + Engenharia OTA |
| S4 | Retro & Ajustes | Revisão das métricas de adoção (`Adoção piloto QA` no dashboard) e consolidação dos aprendizados | QA Lead + PMO |

## Métricas de Adoção
- **Propriedades cobertas**: cartão "Adoção piloto QA" no `/reports` deve manter ≥ 5 propriedades durante o piloto.
- **Reservas monitoradas**: mínimo de 120 reservas válidas por ciclo de 30 dias (acompanhar coluna `reservas` na tabela detalhada).
- **Exportações registradas**: 1 CSV por dia útil anexado ao canal `#qa-field-tests`.

## Critérios de Saída
- Desvios de ocupação ≤ 2% entre relatório `/reports` e PMS local das propriedades piloto.
- Nenhum incidente de pagamento sem reconciliação automática no período do piloto.
- Backlog OTA < 3 jobs críticos por mais de 24h.

## Follow-up
- Consolidar evidências no documento `docs/revisao-validacao-artefatos.md` na próxima revisão trimestral.
- Atualizar componentes do dashboard QA conforme feedback de adoção (ver `frontend/app/reports/page.tsx`).
