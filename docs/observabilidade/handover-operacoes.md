# Handover Observabilidade → Operações/Suporte

## Contexto
Com a consolidação dos painéis e runbooks de observabilidade, é necessário repassar responsabilidades operacionais para as equipes de Operações e Suporte.

## Sessão agendada
- **Data:** 18/03/2025
- **Horário:** 10h00–11h30 BRT
- **Formato:** Videoconferência (Google Meet)
- **Facilitador:** Plataforma (Ana Ribeiro)
- **Participantes confirmados:**
  - Operações (João Mendes)
  - Suporte N2 (Carla Souza)
  - SRE On-call (Marcos Leite)
  - QA Lead (Bruna Castro)

## Agenda
1. Visão geral dos dashboards e alertas (`docs/observabilidade/dashboards-e-logs.md`).
2. Passo a passo do runbook de incidentes (`docs/runbooks/incidentes-observabilidade.md`).
3. Exercício prático: simulação de alerta `PlaybookErrorRate`.
4. Definição de responsabilidades e canais de comunicação.
5. Plano de acompanhamento e métricas de adoção.

## Responsabilidades pós-handover
| Equipe | Responsabilidades | Indicadores de sucesso |
| --- | --- | --- |
| Operações | Monitorar alertas críticos (`staging.yaml`), executar primeira resposta em incidentes 5xx | Tempo de reconhecimento < 5 minutos |
| Suporte N2 | Manter base de conhecimento atualizada, registrar incidentes recorrentes | Percentual de incidentes com KB atualizado ≥ 90% |
| SRE | Garantir saúde dos pipelines, manter alertas calibrados | Redução de falsos positivos em 20% | 
| QA | Validar métricas de qualidade após incidentes QA | Tempo para retestar < 1 hora |

## Plano de acompanhamento
- **D+1:** reunião curta para ajustar dúvidas e validar acesso aos dashboards.
- **D+7:** revisar métricas de sucesso e atualizar ações pendentes.
- **D+30:** retro com Operações/Suporte para validar autonomia e mapear novas necessidades.

## Pendências
- Criar checklist de verificação rápida para Operações (responsável: João Mendes, prazo 22/03).
- Documentar script de restauração rápida para QA runner (responsável: Bruna Castro, prazo 25/03).
