# Guia de Engenharia e Operações

Este guia descreve convenções de branching, automações de CI/CD e práticas de colaboração para o repositório Bmad Method v3.

## Estrutura de Branching

- **`main`**: ramo protegido. Contém código pronto para produção. Exige PR com revisão e pipeline verde.
- **`develop`**: ramo de integração contínua para features do MVP. Releases são cortadas deste branch após estabilização.
- **Branches de Feature**: `feature/<area>-<descricao-curta>` (ex.: `feature/observabilidade-dashboard`). Criadas a partir de `develop`. Devem ter PR para `develop`.
- **Branches de Hotfix**: `hotfix/<descricao-curta>`, criadas a partir de `main` para correções críticas. Após merge em `main`, aplicar cherry-pick para `develop`.
- **Branches de Release**: `release/<versao>` usadas para hardening do MVP e preparação de notas de release. Devem executar checklist de regressão manual.

## Fluxo de Pull Requests

1. Abrir PRs pequenos (< 500 linhas) com descrição objetiva, checklist de testes e referência ao item de backlog.
2. Exigir no mínimo 1 reviewer técnico e 1 reviewer de produto para mudanças relevantes ao usuário.
3. Uso obrigatório do template de PR disponível em `.github/pull_request_template.md`.
4. Não realizar merges diretos em `main`; utilizar `squash` para features.

## Automação CI/CD

### Pipeline Contínuo (GitHub Actions)

Workflow definido em `.github/workflows/ci.yml` roda em pushes e PRs para `main` e `develop`:

1. **Lint & Static Analysis**: roda `github/super-linter` para garantir padrões em Markdown, YAML e scripts.
2. **Testes Unitários**: executa `./scripts/test-unit.sh`, que detecta suites Node.js e Python e falha em caso de erro nos testes.
3. **Testes de Integração (opcional)**: reutiliza `./scripts/test-integration.sh`, priorizando `npm run test:integration` ou `pytest -m integration` quando configurados.
4. **Empacotamento Artefatos**: prepara pacotes de documentação gerada e envia para artefatos do GitHub Actions.

### Templates e Scripts Padronizados

- **Template de Pull Request**: localizado em `.github/pull_request_template.md`, inclui checklist de testes (unitários, integração, E2E) e confirmação de checklist regulatório.
- **CODEOWNERS**: arquivo `.github/CODEOWNERS` distribui responsabilidade de revisão por domínio (produto, plataforma, QA, compliance).
- **Scripts de Teste**: `./scripts/test-unit.sh` e `./scripts/test-integration.sh` detectam automaticamente projetos Node.js/Python e falham em caso de ausência de suites; qualquer novo módulo deve expor comando padrão (`npm test`, `pytest -m integration`).
- **Script de Changelog**: `./scripts/generate-changelog.sh` gera changelog estruturado; ver seção abaixo para integração na pipeline.
- **Checklist de Release**: armazenado em `docs/playbook-operacional.md` (seção Operações) e referenciado nas pipelines `release`.

### Deploy Automatizado

- Configurar pipeline separado `deploy.yml` (futuro) disparado em tags `v*`.
- Deploy utiliza GitOps com ArgoCD; pipeline faz commit em repositório de manifests.
- Gate manual de aprovação do time de produto antes de promover para produção.

### Rollback e Versionamento de Infraestrutura

- **Versionamento Semântico**: releases etiquetadas como `vMAJOR.MINOR.PATCH`, acompanhando o estado dos manifests no repositório GitOps. Hotfixes incrementam `PATCH`; funcionalidades de MVP incrementam `MINOR`.
- **Controle de Releases**: toda tag dispara checklist de validação e publicação de changelog. Manter histórico no diretório `releases/` (a criar) com resumo de mudanças e owners responsáveis pela aprovação.
- **Rollback Automatizado**: rollback é executado via GitOps revertendo o commit de manifest em produção com `git revert` e aplicando tag `vX.Y.Z-rollback`. Procedimento documentado exige:
  1. Abrir incidente no canal `#incident` e acionar SRE on-call.
  2. Reverter commit no repositório GitOps, aguardar sincronização do ArgoCD e validar métricas críticas (latência, erros 5xx) em Grafana.
  3. Atualizar runbook correspondente com causa raiz e follow-up no steering committee.
- **Backups de Estado**: snapshots de bases de dados gerenciadas antes de cada deploy de release, com retenção mínima de 7 dias.
- **Auditoria**: registrar ID da release e hash do commit na ata do steering committee pós-deploy para rastreabilidade, anexando checklist de conformidade (`artifacts/compliance/checklist-lgpd-gdpr-pci-v1.0.xlsx`) e link do changelog gerado.

## Convenções de Commit

- Mensagens no formato: `<tipo>(escopo): descrição` inspirado em Conventional Commits (`feat`, `fix`, `docs`, `chore`).
- Incluir referência ao item de backlog (ex.: `feat(onboarding): adiciona wizard inicial [BL-01]`).

## Gestão de Releases

1. Abrir branch `release/<versao>`.
2. Executar `./scripts/generate-changelog.sh -f <tag_anterior> -t HEAD -o CHANGELOG.md` para gerar e anexar a seção da release.
3. Executar checklist de regressão manual (ver seção QA).
4. Após aprovação, criar tag `vX.Y.Z` e disparar pipeline de deploy.

### Automação de Changelog

- **Script Padronizado**: `./scripts/generate-changelog.sh` agrupa commits por tipo (feat/fix/docs/chore/outros) seguindo Conventional Commits. O script identifica automaticamente a tag anterior quando `-f` não é informado, permitindo uso em pipelines.
- **Pipelines**: adicionar etapa `Generate changelog` na workflow de release para rodar `./scripts/generate-changelog.sh -o CHANGELOG.md` e subir o arquivo como artefato antes da criação da tag.
- **Governança**: toda release deve anexar o changelog gerado à ata de steering e referenciar links de evidências de QA e privacidade (conforme `docs/testing-strategy.md`). Exceções precisam de aprovação do Engineering Lead.
- **Uso Local**: desenvolvedores podem passar `-t <ref>` para gerar changelog parcial durante revisões. O script evita falhar quando não há commits novos, retornando mensagem informativa.

## Governança do Repositório

- Ativar proteção de branch em `main` e `develop` com status checks obrigatórios.
- Exigir assinatura de commits para contribuições externas.
- Configurar CODEOWNERS para times de domínio.

## Próximas Ações

- [x] Criar template de PR (`.github/pull_request_template.md`).
- [x] Adicionar scripts de testes unitários e integração (`./scripts/test-unit.sh` e `./scripts/test-integration.sh`).
- [x] Definir CODEOWNERS alinhado às áreas funcionais (`.github/CODEOWNERS`).
- [x] Formalizar política de rollback e versionamento de infraestrutura.
- [x] Automatizar geração de changelog.
