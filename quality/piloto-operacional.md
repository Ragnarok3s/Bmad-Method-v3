# Piloto Operacional - 30 dias / 5 propriedades

## Objetivo
Executar piloto operacional controlado com cinco propriedades para validar fluxos críticos de reservas, pagamentos e integrações OTA antes da abertura geral do MVP. O piloto deve garantir confiabilidade dos relatórios `/reports`, precisão financeira e governança do backlog OTA.

## Escopo
- **Duração:** 30 dias corridos (01/07/2024 a 30/07/2024)
- **Propriedades piloto:** Pousada Atlântica, Hotel Serra Verde, Villa das Águas, Solar do Rio, Refúgio das Flores
- **Domínios monitorados:** Reservas, check-in/out, reconciliação financeira, backlog OTA
- **Fontes de dados principais:** Dashboard `/reports`, PMS local das propriedades, integrações OTA, logs de incidentes de pagamentos

## Preparação (Semana 0)
1. Validar suites críticas executando `./scripts/test-domain.sh reservations payments ota`.
2. Confirmar acessos a `/reports` para gestores locais e chapter QA.
3. Configurar automação de export diário (`quality/reports/piloto-operacional-exports.csv`).
4. Alinhar calendário de reconciliação financeira com time de Operações.
5. Definir responsáveis por propriedade (QA Lead + PM Ops) e canais de atendimento.

## Rotina diária
| Horário | Atividade | Responsável | Evidência |
| --- | --- | --- | --- |
| 08:00 | Exportar relatórios operacionais do `/reports` (ocupação, ADR, backlog OTA) | QA Ops Analyst | Entrada no CSV diário | 
| 10:00 | Comparar ocupação e receita com PMS local; registrar desvio | Gestor local + QA Ops Analyst | Campo `occupancy_deviation_pct` ≤ 2% | 
| 12:00 | Conferir reconciliação automática de pagamentos; abrir incidente se houver divergência | Finance Ops | Campo `reconciliation_status` | 
| 15:00 | Revisar backlog OTA e escalonar pendências > 10 horas | PM Ops | Campo `ota_backlog` < 3 | 
| 17:00 | Atualizar canal `#pilot-ops` com resumo diário e riscos | QA Lead | Log diário | 

## Rotina semanal
- Revisão dos indicadores no dashboard `Adoção piloto QA`.
- Amostra de reservas para auditoria manual (5 por propriedade).
- Reunião de sincronização com squads (QA, Produto, Operações).

## Critérios de sucesso
1. Desvio de ocupação entre `/reports` e PMS ≤ 2% para todos os dias e propriedades.
2. Nenhum incidente de pagamento sem reconciliação concluída no mesmo dia.
3. Backlog OTA controlado (≤ 5 solicitações abertas, sem pendências > 10 horas).
4. Exportações diárias registradas e auditáveis.

## Plano de resposta a incidentes
- Prioridade Alta: Falha de reconciliação ou divergência > 2% → abrir incidente na hora, comunicação imediata no canal `#pilot-ops`, acionamento do time Finance Ops.
- Prioridade Média: Backlog OTA acima do limite → monitorar, priorizar contato com OTA e registrar ação corretiva.
- Prioridade Baixa: Ajustes de dados menores → registrar tarefa para sprint seguinte.

## Encerramento do piloto
1. Consolidar métricas no relatório `quality/piloto-operacional-resultados.md`.
2. Apresentar achados na review do piloto (QA Lead + PM Ops).
3. Definir go/no-go para escalação.
