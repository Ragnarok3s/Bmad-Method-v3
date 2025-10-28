# Handoff Sprint 0 – Práticas Essenciais

## Estratégia de Branching
- Utilizar fluxo Git baseado em trunk com branches curtas por feature ou correção.
- Definir convenção de nomenclatura (`feature/`, `bugfix/`, `hotfix/`) e exigir pull requests com revisões cruzadas.
- Manter política de merge protegida (status checks obrigatórios, revisão mínima de 1 par, proibição de commits diretos no branch principal).

## Pipeline de CI/CD
- Automatizar lint, testes unitários e integração contínua em cada pull request.
- Configurar pipelines de entrega contínua para ambientes de homologação e produção com gates de aprovação.
- Versionar artefatos e infraestrutura como código, garantindo rastreabilidade de deploys.

## Gestão de Ambientes
- Manter paridade entre ambientes (desenvolvimento, homologação, produção) com provisionamento automatizado.
- Registrar matriz de configurações sensíveis (segredos, variáveis de ambiente, feature flags) e governar via cofre centralizado.
- Estabelecer rotina de sanity check pós-deploy e processos de rollback documentados.

## Observabilidade e Operação
- Padronizar coleta de métricas (SLOs, SLIs), logs estruturados e traces distribuídos para cada serviço.
- Implementar dashboards e alertas alinhados à cadência operacional e ao runbook de incidentes.
- Garantir revisão periódica de alertas para evitar fadiga e manter cobertura de monitoração.

## Governança e Compliance
- Mapear responsáveis (RACI) por decisões de arquitetura, operações e segurança.
- Formalizar controles de auditoria (registro de mudanças, aprovação de acessos, evidências de testes).
- Revisar políticas de segurança e privacidade a cada release crítico, alinhando com requisitos regulatórios.
