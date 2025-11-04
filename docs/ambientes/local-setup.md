# Guia de Setup Local

Este documento descreve o fluxo validado para preparar o ambiente local de desenvolvimento utilizando `python -m venv` e as dependências registradas em `requirements.txt`.

## Pré-requisitos
- Python 3.14 instalado e acessível no `PATH`.
- Ferramentas básicas de shell (bash, coreutils) disponíveis.

## Passo a passo
1. Crie o ambiente virtual na raiz do repositório:
   ```bash
   python -m venv .venv
   ```
2. Ative o ambiente virtual:
   ```bash
   source .venv/bin/activate
   ```
   > O prompt deve exibir o prefixo `(.venv)` indicando que a ativação foi bem-sucedida.
3. Instale as dependências de desenvolvimento:
   ```bash
   pip install -r requirements.txt
   ```
   - O comando instala `pytest`, `pytest-cov`, `bandit`, `PyYAML` e dependências auxiliares.
   - Os artefatos são instalados dentro de `.venv/lib/python3.14/site-packages`.
4. (Opcional) Atualize o `pip` para evitar avisos de versão:
   ```bash
   pip install --upgrade pip
   ```

## Pós-instalação
- Utilize `deactivate` para sair do ambiente virtual quando necessário.
- Reative o ambiente (`source .venv/bin/activate`) sempre que iniciar uma nova sessão de trabalho.
- Caso surjam erros de importação, valide se a pasta `.venv` foi criada antes da instalação e se o shell atual está com o ambiente ativo.

## Provisionamento Rápido com Docker Compose

- Execute `./scripts/infra/provision-dev.sh docker` para subir os serviços locais definidos em `design/docker-compose.dev.yml` (frontend, backend, PostgreSQL e Redis).
- O script utiliza `docker compose config` quando chamado com o perfil `docker/k8s`, permitindo validar o arquivo sem iniciar containers.
- Para encerrar os serviços, utilize `docker compose -f design/docker-compose.dev.yml down` após a execução inicial.

## Seed de Dados Sintéticos (Ambiente Dev)

- Valide os datasets com `./scripts/infra/seed-dev-data.sh --mode validate` sempre que atualizar arquivos em `tests/data/seed/`.
- Aplique o seed com `./scripts/infra/seed-dev-data.sh --mode apply` após o provisionamento; as métricas ficarão em `artifacts/seed/dev_seed.prom` para posterior upload no CI/CD.
- Consulte o runbook `docs/runbooks/seed-data-jobs.md` para troubleshooting, owners e integrações com Grafana/PagerDuty.

## Testes de Integração e Quality Gates

- Execute os testes de integração diretamente com `pytest -m integration` quando precisar isolar cenários específicos. Todos os módulos em `tests/integration/` estão marcados com `@pytest.mark.integration`, permitindo filtrar a suíte completa.
- Utilize `./scripts/test-integration.sh` para gerar a cobertura consolidada (`artifacts/coverage/integration-coverage.xml`) e o relatório JUnit correspondente. O script registra uma mensagem informativa caso não existam cenários, sem falhar a execução.
- Após gerar os artefatos de cobertura e segurança, rode `./scripts/run-quality-gates.sh` para validar os relatórios. O script agora avisa previamente quando algum artefato obrigatório estiver ausente antes de delegar a verificação para `scripts/verify_quality_gates.py`.
