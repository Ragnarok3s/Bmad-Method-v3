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
