# Runbook de Coordenação com Plataforma

## Objetivo
Documentar o agendamento das execuções de scripts de infraestrutura e a responsabilidade de cada atividade para garantir alinhamento com a equipe de plataforma.

## Agenda de Execuções
| Janela | Frequência | Scripts | Responsável Principal | Backup | Dependências |
| --- | --- | --- | --- | --- | --- |
| Segunda-feira 09:00 | Semanal | `scripts/infra/provisionar_cluster.sh` | Time de Plataforma (Ana Souza) | Engenharia de Confiabilidade (Lucas Lima) | Aprovação de Change Advisory Board |
| Quarta-feira 14:00 | Quinzenal | `scripts/infra/sincronizar_segredos.py` | Engenharia de Confiabilidade (Lucas Lima) | Time de Plataforma (Bianca Ramos) | Rotas VPN validadas |
| Sexta-feira 19:00 | Mensal | `scripts/infra/atualizar_pipelines.sh` | DevOps (Marcos Paulo) | Time de Plataforma (Ana Souza) | Janela de manutenção aprovada |

## Preparação Pré-Execução
1. Confirmar disponibilidade das janelas acima com a equipe de plataforma até 24h antes.
2. Validar se todas as dependências listadas estão atendidas.
3. Revisar tickets abertos relacionados ao script agendado.

## Responsabilidades
- **Time de Plataforma:** validação de infraestrutura base, comunicação de riscos e acionamento de stakeholders.
- **Engenharia de Confiabilidade:** execução assistida dos scripts, monitoração pós-execução.
- **DevOps:** manutenção contínua dos scripts e atualização das pipelines de CI/CD.
- **Gestão de Mudanças:** registrar aprovação e evidências no sistema de ITSM.

## Escalonamento
- Falhas críticas durante execução: acionar imediatamente o canal `#infra-incident` e abrir incidente em até 15 minutos.
- Atrasos superiores a 30 minutos: renegociar com plataforma e registrar justificativa neste runbook.

## Registro
Após cada execução, atualizar a seção de check-ins de observabilidade (ver `docs/observabilidade/check-ins.md`) com resultados e aprendizados.
