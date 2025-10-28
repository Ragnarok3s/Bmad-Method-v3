# Cadência Operacional Contínua

| Checkpoint | Frequência | Responsáveis | Principais Entregáveis | Indicadores/Alertas |
| --- | --- | --- | --- | --- |
| Revisão de Checklists de Handoff | Quinzenal (quinta-feira) | Tech Lead, SRE, QA Lead | Atualização dos checklists críticos e status de ações corretivas | % de itens conformes, pendências abertas |
| Comitê de Governança | Mensal (1ª semana) | Chapter Lead Engenharia, Segurança, PO | Revisão de políticas, auditorias e riscos priorizados | Atualização do RACI, métricas de compliance |
| Monitoramento de Observabilidade | Semanal (quarta-feira) | SRE, Analista de Observabilidade | Relatório de SLO/SLI, análise de alertas, ações de tuning | Breaches de SLO, volume de alertas sem owner |
| Gestão de Ambientes | Quinzenal (alternando com handoff) | SRE, DevOps | Validação de paridade e revisão de configurações sensíveis | Diferenças detectadas, status de segredos |
| Saúde de CI/CD | Semanal (segunda-feira) | QA Lead, Dev Lead | Relatório de execução de pipelines, falhas e tempos médios | Taxa de sucesso, lead time de deploy |
| Retro Operacional | Trimestral | Todos os líderes de capítulo | Avaliação holística da operação e plano de melhoria | Roadmap de melhorias, lições aprendidas |

## Observações
- Registrar decisões e desvios em `docs/atas/` vinculando ao checkpoint correspondente.
- Atualizar riscos identificados durante os checkpoints em `docs/riscos/backlog.md`.
- Alinhar calendário com `docs/atas/calendario-rituais.md` para evitar conflitos.
