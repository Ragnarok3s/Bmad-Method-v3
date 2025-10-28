# Configuração de Variáveis e Secrets do CI

Este guia documenta o processo validado para preparar o pipeline de CI com variáveis de ambiente e secrets, em alinhamento com o runbook de gestão (`docs/runbooks/gestao-de-secrets.md`).

## Escopo
- Pipelines GitHub Actions do repositório `Bmad-Method-v3`.
- Secrets consumidos por workflows de build, testes e deploy.
- Variáveis de ambiente compartilhadas entre jobs (ex.: endpoints de observabilidade, feature flags).

## Responsabilidades
| Papel                    | Atribuições principais                                    |
|-------------------------|------------------------------------------------------------|
| Platform Engineer Lead  | Provisionar secrets no Vault e mapear permissões OIDC.    |
| Security Engineer       | Aprovar requests no ServiceNow e auditar rotação trimestral. |
| DevOps On-call          | Revisar falhas de pipeline relacionadas a credenciais.    |

## Checklist de Provisionamento
1. **Abrir requisição** no ServiceNow com descrição do uso e owner responsável.
2. **Criar secret no Vault** em `kv/<ambiente>/<servico>/<chave>` com TTL de 90 dias.
3. **Atualizar policy** no diretório `policies/<ambiente>/<servico>.hcl` garantindo acesso de leitura via GitHub OIDC.
4. **Registrar inventário** no arquivo `artifacts/security/secret-inventory.xlsx` com caminho e data de expiração.
5. **Mapear no GitHub Actions**:
   - Acesse `Settings > Secrets and variables > Actions`.
   - Cadastre secrets sensíveis (`VAULT_ROLE`, tokens de APIs, etc.).
   - Cadastre variáveis não sensíveis (URIs, nomes de buckets) em `Variables`.
   - Documente a relação `secret -> workflow` na planilha de inventário.
6. **Testar autorização** executando workflow em branch de teste e validando logs de OIDC no Vault.

## Nomenclatura Recomendada
| Tipo           | Convenção                         | Exemplo                     |
|----------------|-----------------------------------|-----------------------------|
| Secrets        | `<AMBIENTE>_<SERVICO>_<OBJETO>`   | `STAGING_OBSERVA_VAULT_ROLE`|
| Variáveis      | `<AMBIENTE>_<PROPOSITO>`          | `DEV_FEATURE_FLAG_URL`      |

## Rotação e Auditoria
- Siga o procedimento descrito na seção “Rotação Trimestral” do runbook.
- Ao atualizar um secret, gere um teste manual de pipeline e anexe a evidência ao ticket do ServiceNow.
- Atualize `docs/atas/ata-security-<data>.md` com a rotação realizada.

## Troubleshooting
- Falhas de autenticação OIDC: verifique carimbo de tempo em `vault audit list` e compare com execução do workflow.
- Secrets inexistentes no workflow: confirme se foram adicionados como **Secrets** e não como **Variables**.
- Expiração de credencial: consulte o inventário e acione o Security Engineer para rotação imediata.

## Secrets e Variáveis validadas (2025-10-28)

| Workflow                 | Tipo    | Nome                       | Obrigatório | Observações |
|--------------------------|---------|----------------------------|-------------|-------------|
| `ci.yml`                 | Secret  | `GITHUB_TOKEN`             | Sim         | Utilizado pelo Super-Linter para autenticação com a API do GitHub. | 
| `deploy-staging.yml`     | Secret  | _não aplicável_            | Não         | O fluxo atual apenas prepara artefatos estáticos; nenhum secret é referenciado. |
| `ci.yml` / `deploy-staging.yml` | Variável | _não definido_            | Não         | Não existem variáveis de repositório consumidas diretamente nos workflows atuais. |

- **Onde configurar:** `Settings > Secrets and variables > Actions` no repositório GitHub.
- **Escopo recomendado:** secrets no nível de repositório, variáveis compartilhadas somente se a mesma credencial for usada por múltiplos workflows.

## Gaps observados durante a revisão

- Os scripts `scripts/test-integration.sh` e `scripts/test-e2e.sh` encerram o job com `exit 1` quando não encontram suítes de testes, o que derruba tanto o `ci.yml` quanto o `deploy-staging.yml`. Adicionar testes mínimos ou uma flag de bypass é necessário para estabilizar o pipeline.【F:scripts/test-integration.sh†L11-L37】【F:scripts/test-e2e.sh†L10-L32】【F:.github/workflows/ci.yml†L75-L82】【F:.github/workflows/deploy-staging.yml†L58-L62】
- O gate `scripts/run-quality-gates.sh` exige arquivos de cobertura de integração e o relatório do Bandit; sem integração gerando `integration-coverage.xml` o `verify_quality_gates.py` falha ao tentar processar o arquivo inexistente. Ajustar o script ou produzir o artefato é mandatório antes de ativar o gate no CI.【F:scripts/run-quality-gates.sh†L1-L17】【F:scripts/verify_quality_gates.py†L31-L55】【F:.github/workflows/ci.yml†L81-L82】
