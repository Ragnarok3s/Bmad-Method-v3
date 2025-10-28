# Runbook de Coordenação com Plataforma

## Objetivo
Documentar as janelas de execução e a responsabilidade pelos scripts de infraestrutura que apoiam os ambientes de desenvolvimento e staging, mantendo alinhamento com a equipe de plataforma.

## Agenda de Execuções
| Janela | Frequência | Scripts | Responsável Principal | Backup | Dependências |
| --- | --- | --- | --- | --- | --- |
| Segunda-feira 09:00 | Semanal | `scripts/infra/provision-dev.sh docker/k8s` (modo validate) | Time de Plataforma (Ana Souza) | Engenharia de Confiabilidade (Lucas Lima) | Docker CLI, kubectl/kustomize, manifests em `design/` |
| Diária 05:00 UTC | Diária | `scripts/infra/reset-staging.sh` | Engenharia de Confiabilidade (Lucas Lima) | DevOps (Marcos Paulo) | Acesso a cluster staging, variáveis `STAGING_RELATIONAL_URL`/`STAGING_NOSQL_URL` |
| Sexta-feira 19:00 | Semanal | `scripts/infra/seed-dev-data.sh --mode apply` | DevOps (Marcos Paulo) | Time de Plataforma (Bianca Ramos) | Ferramentas `psql`, `mongoimport` ou `mongosh`, variáveis `DEV_RELATIONAL_URL`/`DEV_NOSQL_URL` |

## Preparação Pré-Execução
1. Confirmar disponibilidade das janelas acima com a equipe de plataforma até 24h antes.
2. Validar se todas as dependências listadas estão atendidas (CLI instaladas e variáveis exportadas).
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
