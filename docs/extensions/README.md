# BMAD Extensions Governance & Co-Innovation

Este documento consolida como a plataforma BMAD habilita extensões de parceiros com segurança, governança e escala. Ele cobre o ciclo completo desde submissão até rollout controlado, além de SLAs e métricas de adoção que orientam o programa.

## 1. Princípios de Plataforma

- **Segurança primeiro**: toda extensão roda em sandbox isolado com controle de permissões explícitas.
- **Co-inovação iterativa**: squads mistos BMAD + parceiros conduzem avaliações contínuas.
- **Observabilidade obrigatória**: métricas funcionais, SLAs e indicadores de adoção são revisados a cada release wave.
- **Rollout progressivo**: feature flags e cohorts garantem monitoramento antes da liberação total.

## 2. Processo de Co-Inovação

| Fase | Objetivo | Entregáveis | SLA | Responsáveis |
| --- | --- | --- | --- | --- |
| **Descoberta** | Validar proposta de valor e riscos | Canvas de problema, matriz de riscos, mapa de dados | 5 dias úteis | Produto BMAD + Parceiro líder |
| **Sandbox** | Construir MVP dentro do runtime de extensões | Manifesto versão 1.0, pacote de testes automatizados, plano de rollback | 10 dias úteis | Squad híbrido (Dev BMAD + Engenharia Parceira) |
| **Review Integrado** | Avaliar segurança, compliance e UX | Relatório de pentest, checklist LGPD, script de QA exploratório | 3 dias úteis | BMAD Security, Compliance e QA |
| **Pilotagem Controlada** | Executar rollout parcial com telemetria | Dashboard de adoção, plano de comunicação, plano de suporte | 7 dias úteis | Operações BMAD + Customer Success Parceiro |
| **Lançamento Geral** | Disponibilizar para toda a rede | Runbook operacional, plano de release notes, contrato de suporte | 2 dias úteis | Governança + Marketing Produto |

## 3. SLAs do Programa de Extensões

| Área | Escopo | SLA | Métrica de controle |
| --- | --- | --- | --- |
| Segurança | Triagem automática (scan, assinatura, permissões) | 2 horas corridas | % pacotes aprovados dentro do SLA |
| QA Funcional | Execução de suíte regressiva e contrato de dados | 8 horas úteis | Taxa de regressões abertas pós-rollout |
| Governança | Aprovação conjunta com revisão jurídica | 24 horas úteis | Lead time médio por extensão |
| Operações | Ativação piloto + monitoramento inicial | 48 horas corridas | MTTR de incidentes em rollout |

## 4. Critérios de Aprovação

1. **Manifesto válido** (`manifest_version` compatível, permissões justificadas, entrypoint auditado).
2. **Cobertura de testes** mínima de 80% para casos críticos, evidenciada em relatório anexado ao PR.
3. **Planos de observabilidade** configurados (logs estruturados, métricas chave e alertas em Grafana).
4. **Documentação operacional** entregue (runbook, estratégia de rollback, comunicação a stakeholders).
5. **Avaliação de risco** concluída sem pendências bloqueantes (security, LGPD, financeiro).

Extensões que falharem em qualquer critério retornam para ajuste e nova submissão dentro do ciclo quinzenal de review.

## 5. Métricas de Adoção e Sucesso

| Métrica | Descrição | Fonte | Meta 2024 |
| --- | --- | --- | --- |
| **Adoption Rate** | % de hotéis elegíveis com rollout completo | Feature flags + dados de tenancy | ≥ 65% após 90 dias |
| **Satisfaction Score** | Média ponderada de avaliações in-app (1-5) | Catálogo de extensões BMAD | ≥ 4,5 |
| **NPS Parceiros** | Feedback trimestral dos squads de parceiros | Pesquisas governança | ≥ +45 |
| **Time to Certify** | Tempo médio da submissão até aprovação final | Workflow CI Extensions | ≤ 4 dias úteis |
| **Stability Index** | Incidentes por 1.000 execuções | Observabilidade + Postmortems | ≤ 0,5 |

## 6. Governança Operacional

- **Comitê de Extensões** (Produto, Engenharia, Segurança) se reúne semanalmente para priorizar fila de review.
- **Portal do Parceiro** integra com o CLI para submissões autenticadas e histórico de versões.
- **Pipelines CI** bloqueiam merges sem validação de sandbox, testes e documentação.
- **Catálogo Web** oferece visibilidade de rating, rollout e métricas em tempo real para stakeholders.

## 7. Próximos Passos

1. Expandir manifestos versionados para suportar políticas de dados regionais (v1.2 em elaboração).
2. Automatizar rollout progressivo com integração direta ao feature flag service.
3. Publicar dashboard público com comparativo de adoção e estabilidade por extensão.

---
Para dúvidas ou propostas de novas extensões, acione `extensions@bmad.io` ou abra issue no repositório interno `extensions-governance`.
