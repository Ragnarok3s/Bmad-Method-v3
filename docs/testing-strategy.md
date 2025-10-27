# Estratégia de Testes e QA

Este plano cobre testes automatizados (unitários, integração, ponta a ponta) e QA manual para o MVP Bmad Method v3.

## Princípios

- **Shift-left**: escrever cenários de teste junto com especificações.
- **Automação progressiva**: priorizar cobertura crítica do MVP e expandir conforme backlog.
- **Observabilidade integrada**: usar métricas de testes para alimentar dashboards de qualidade.

## Cobertura Planejada

### Testes Unitários

| Módulo | Escopo | Ferramentas | Métricas |
|--------|--------|-------------|----------|
| Catálogo de agentes | Funções de filtragem, normalização de metadados | Jest / Vitest (frontend), pytest (backend) | Cobertura ≥ 80% nas funções críticas |
| Onboarding | Validação de formulários, estado do wizard | Jest + React Testing Library | Cobertura ≥ 70%, garantia de máscaras e regras |
| Playbooks | Serialização de templates, validação de passos | pytest + factory-boy | Cobertura ≥ 75% |

### Testes de Integração

| Fluxo | Objetivo | Ferramentas | Dados |
|-------|----------|-------------|-------|
| Execução de playbook | Validar integração backend + orquestrador | pytest + docker-compose | Dados sintéticos de agentes |
| Observabilidade | Confirmar ingestão de logs e métricas | pytest + mock OpenTelemetry Collector | Eventos simulados |
| Permissões | Garantir regras RBAC entre camadas | Cypress component testing + API mocks | Usuários com perfis distintos |

### Testes End-to-End (E2E)

| Cenário | Objetivo | Ferramentas | Frequência |
|---------|----------|-------------|-----------|
| Onboarding completo | Usuário cria workspace, configura agente e executa playbook | Cypress | Rodar em cada PR principal e nightly |
| Gestão de agentes | Administrador publica novo playbook e monitora logs | Playwright | Nightly + smoke em produção |
| Dashboard de analytics | Usuário acompanha métricas e exporta CSV | Cypress | Semanal, focado em regressão |

## Privacidade e Conformidade Regulatório

- **Checklist LGPD/GDPR**: validar consentimentos, finalidades, direitos do titular e políticas de retenção em testes de aceitação e regressão.
- **Dados Sintéticos**: utilizar geradores anonimizados e mascaramento obrigatório em ambientes de teste; proibir dados reais em pipelines.
- **Auditoria de Acessos**: garantir que testes de integração validem trilhas de auditoria (criação/edição/consulta) para usuários privilegiados.
- **Localização de Dados**: cobrir cenários de transferência internacional com mocks de provedores para confirmar aplicação de cláusulas contratuais padrão.
- **Revisão de Terceiros**: incluir verificação trimestral de conformidade com PSPs e OTAs quanto a cláusulas de proteção de dados.

## QA Manual

- **Checklist de release**: executado em branch `release/<versao>`, cobrindo cenários críticos, acessibilidade básica e validação cross-browser (Chrome/Firefox).
- **Exploratório guiado**: sessões de 1h com Product e QA usando heurísticas de fluxo.
- **Revisão de conteúdo**: validação textual e internacionalização (PT-BR e EN) antes do lançamento.

## Integração com CI/CD

1. Testes unitários e de integração rodarão na pipeline `ci.yml` (steps placeholders para scripts `./scripts/test-unit.sh` e `./scripts/test-integration.sh`).
2. Testes E2E executados em pipeline agendada `e2e-nightly.yml` (futura) e manual antes de releases.
3. Publicar relatórios em formato JUnit e HTML como artefatos para auditoria.

## Gestão de Qualidade

- **Métricas**: cobertura de código, taxa de falha por release, tempo médio de correção de bugs.
- **Processo de bugs**: registrar no Jira com prioridade, steps to reproduce e anexos.
- **Retrospectiva**: revisar falhas críticas ao fim de cada sprint para ajustar escopo de testes.

## Quality Gates

| Gate | Critério | Responsável | Ferramenta de Monitorização |
|------|----------|-------------|------------------------------|
| Cobertura de Código | ≥ 75% unit tests módulos core, ≥ 60% integração, tendência semanal não regressiva | QA Lead + Engineering Lead | SonarQube, cobertura CI | 
| Bugs Abertos | Zero bugs críticos/severidade alta em aberto para release; máximo 5 médios com plano de mitigação aprovado | QA Lead | Jira + dashboard QA |
| Testes de Segurança | Execução obrigatória de SAST (SonarQube/Semgrep) a cada PR, DAST mensal com OWASP ZAP e pentest semestral | Security Champion | Pipelines CI/CD, relatórios de segurança |
| Privacidade | Checklist LGPD/GDPR assinado para novas integrações e mudança de escopo; log de consentimento validado | Privacy Officer | Planilha de conformidade + auditoria |
| Observabilidade de QA | Todos os relatórios JUnit publicados, métricas em dashboard `QA-Quality` atualizadas por build | QA Lead | Grafana / DataDog |

**Critérios de Bloqueio:** builds que não atinjam os thresholds acima devem falhar automaticamente, exigindo aprovação explícita do Engineering Lead e registro de risco em reunião de steering.

## Roadmap de Evolução

- Adotar contratos de API com Pact para consumidores internos.
- Introduzir testes de carga usando k6 antes do GA.
- Automatizar testes de acessibilidade com axe-core nas pipelines.
