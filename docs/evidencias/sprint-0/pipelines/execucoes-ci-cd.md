# Evidência - Execuções de Pipelines (Sprint 0)

- **Data/Hora:** 2024-06-11 09:15 BRT
- **Ferramenta:** GitHub Actions (`bmad-platform-ci`)

## 1. Build & Test Automatizados
- Workflow: `ci.yml`
- Execução #1286 concluída com sucesso.
- Principais etapas: lint (`poetry run black --check`), testes (`pytest`), publicação de artefatos (`docker push`).
- Log bruto: `logs/gha-ci-1286.txt`.

## 2. Deploy Automatizado
- Workflow: `cd.yml`
- Execução #542 promovendo imagem `platform-api:1.0.0-rc1` para ambiente STG.
- Aprovação manual registrada pelo Product Owner às 09:02.
- Log bruto: `logs/gha-cd-542.txt`.

## 3. Plano de Rollback
- Playbook de rollback referenciado em `docs/runbooks/rollback-plano-platform.md`.
- Teste de simulação executado em 2024-06-10 (log `logs/rollback-sim-20240610.txt`).
