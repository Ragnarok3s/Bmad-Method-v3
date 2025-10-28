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
- **Plano Encerrado**: registrar no relatório de QA de cada release que o plano de compliance regulatório (LGPD/GDPR, PCI) foi executado dentro do cronograma do kick-off, anexando evidências de DPIA, segmentação PCI e checklist de integrações.
- **Gate de Kick-off**: bloquear a transição para Sprint 0 até que o checklist de conformidade, o DoR/DoD aprovados e o relatório de readiness de staging estejam anexados ao `docs/revisao-validacao-artefatos.md`.

### Checklist Regulatório de QA

| Etapa | Objetivo | Responsáveis | Evidência |
|-------|----------|--------------|-----------|
| Validação de consentimento e bases legais | Confirmar que fluxos críticos coletam consentimento e armazenam logs. | QA Lead + Privacy Officer | Registro de execução da suíte `tests/integration/privacy/consent.spec`. |
| Revisão de DPIA | Garantir que novos riscos identificados foram avaliados. | Privacy Officer + Engineering Lead | Atualização do relatório em `docs/evidencias/dpia-inicial-2024-05.md`. |
| Auditoria PCI | Validar segmentação de rede e mascaramento de dados de pagamento. | Security Champion | Relatório anexado à pipeline com captura de artefatos `pci-segmentation-report.pdf`. |
| Checklist LGPD/GDPR/PCI | Marcar gates obrigatórios antes do deploy. | QA Lead + Release Manager | Checklist assinado automaticamente na pipeline (`artifacts/compliance/checklist-lgpd-gdpr-pci-v1.0.xlsx`). |

### Integração com o Plano MVP

| Módulo / Fluxo | Requisito de Privacidade ou Compliance | Suite de Teste | Evidência / Output |
|----------------|----------------------------------------|----------------|--------------------|
| Autenticação, Gestão de Reservas e Pagamentos | Consentimentos explícitos, segmentação PCI, logs de auditoria | `tests/integration/privacy/` e cenário E2E `checkout-security` | Checklist LGPD/GDPR/PCI anexado ao relatório de release + export DPIA atualizado |
| Inventário & Sincronização OTA | Minimização de payloads, retenção e anonimização após 24 meses | Suite E2E `ota-sync` com dados mascarados e testes de retenção automatizados | Relatório de retenção publicado em `docs/revisao-validacao-artefatos.md` e métricas no dashboard QA |
| Relatórios e Analytics | Aplicação de políticas de pseudonimização e red masking para exportações | Testes unitários `reporting_privacy.spec` + testes manuais guiados | Evidência no playbook de release, assinada pelo Privacy Officer |

- **Alinhamento com MVP**: o quadro acima referencia diretamente os domínios documentados em `docs/property-mvp-plan.md`; qualquer alteração de escopo deve atualizar ambos os documentos.
- **Evidências Automatizadas**: pipelines registram logs das suites citadas como artefatos e publicam link automático no changelog gerado via script (`./scripts/generate-changelog.sh`) para rastreabilidade.

### Cronograma de Verificações de Compliance

| Semana / Marco | Atividades de QA | Evidências Necessárias | Responsáveis |
|----------------|------------------|------------------------|--------------|
| Semana 1 (pós-kick-off) | Validar matriz de dados pessoais e bases legais em testes unitários críticos | Relatório da matriz atualizado e aprovadores no Jira | QA Lead + Privacy Officer |
| Semana 2 | Incluir cenários de DPIA nas suites de integração e capturar logs de mitigação | Export do relatório DPIA com riscos residuais aceites | QA Lead + Engineering Lead |
| Semana 3 | Executar testes de segmentação PCI em ambiente controlado | Checklist de segregação de rede e captura de tokens mascarados | Security Champion |
| Semana 4 | Incorporar checklist LGPD/GDPR/PCI nos quality gates de release | Checklist assinado e arquivado na pipeline; evidência referenciada no relatório de revisão | QA Lead |

- **Governança**: o resultado das verificações alimenta os quality gates de privacidade e segurança, mantendo histórico versionado no repositório de relatórios.

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
