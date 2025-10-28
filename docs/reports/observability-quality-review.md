# Observabilidade, Alertas e Qualidade – Revisão de Configuração

## 1. Cobertura Atual de Dashboards e Alertas
- **Dashboards de agentes e operações** já monitoram latência P95, throughput HTTP, taxa de erro 5xx e reservas confirmadas, mas não incluem painéis de disponibilidade ou backlog de incidentes previstos no plano de métricas.【F:grafana/staging/bmad-agents-001.json†L10-L169】【F:grafana/staging/bmad-ops-002.json†L9-L165】【F:docs/metricas-kpis-dashboard.md†L11-L66】
- O dashboard de QA acompanha cobertura de testes, bugs e alertas de segurança; os thresholds visuais (75%/85%) divergem dos limiares oficiais (65%/50%), gerando interpretações inconsistentes.【F:grafana/staging/qa-quality-dashboard.json†L5-L75】【F:docs/metricas-kpis-dashboard.md†L20-L23】
- O arquivo de alertas `staging.yaml` cobre três incidentes críticos (erros 5xx > 2%, pipelines com falha repetida e queda de engajamento), mas não há regras para disponibilidade API ≥99,5% ou SLA de resposta operacional.【F:grafana/alerts/staging.yaml†L1-L156】【F:docs/metricas-kpis-dashboard.md†L17-L24】
- Há um pacote separado para jobs seed e roteamento QA, porém o alerta de QA não define regras concretas (apenas políticas), deixando lacuna na cobertura de evidências de testes.【F:grafana/alerts/seed-jobs.yaml†L1-L75】【F:grafana/alerts/qa-observability.yaml†L1-L17】
- O verificador automático `verify_observability_gates.py` espera métricas que não existem no dashboard (por exemplo `bmad_core_housekeeping_tasks_scheduled_total`), o que provoca falhas falsas-positivas nos pipelines.【F:scripts/verify_observability_gates.py†L26-L107】【F:grafana/staging/bmad-ops-002.json†L68-L125】

## 2. Correlação com Requisitos de SLO/SLA
- SLOs de disponibilidade (≥99,5%), latência de sincronização OTA (≤5 min) e tempos de resposta/resolução estão definidos na documentação, mas não possuem painéis nem alertas dedicados na stack Grafana.【F:docs/metricas-kpis-dashboard.md†L17-L24】
- O runbook de alertas críticos estabelece metas pós-incidente (latência P95 < 500 ms, erro <1%), porém os dashboards atuais não mostram esses objetivos como linhas de referência ou paineis de SLO cumulativo.【F:docs/runbooks/alertas-criticos.md†L16-L33】【F:grafana/staging/bmad-agents-001.json†L10-L129】
- Métricas de produto (NPS, taxa de utilização de relatórios) e SLA operacional (tempo de atendimento) não estão instrumentadas em dashboards ou alertas, limitando a visibilidade sobre requisitos de negócio.【F:docs/metricas-kpis-dashboard.md†L14-L36】【F:grafana/staging/bmad-ops-002.json†L9-L165】
- A ausência de alertas de disponibilidade impede validar o gate de go-live definido para incidentes críticos e compliance com SLAs de resposta.【F:docs/metricas-kpis-dashboard.md†L17-L24】【F:grafana/alerts/staging.yaml†L1-L156】

## 3. Ferramentas de Qualidade e Integração em CI
- O pipeline CI executa Super-Linter, testes unitários/integrados/E2E e um script de quality gates, garantindo cobertura mínima, backlog zero de bugs críticos e validações de privacidade/DAST.【F:.github/workflows/ci.yml†L1-L92】【F:scripts/run-quality-gates.sh†L1-L20】【F:scripts/verify_quality_gates.py†L1-L90】
- Bandit roda apenas sobre o pacote `quality/`, deixando módulos `services/` e `apps/` sem varredura estática de segurança; falta também linters Python especializados (Ruff/Flake8) e analisadores de dependência (pip-audit, npm audit) para cobrir requisitos de AppSec.【F:scripts/run-quality-gates.sh†L11-L20】【F:quality/metrics.py†L1-L49】【F:quality/privacy.py†L1-L85】
- O pipeline gera artefactos de observabilidade, mas a inconsistência de tokens mencionada acima faz o job falhar antes de publicar manifestos úteis.【F:scripts/verify_observability_gates.py†L93-L160】

## 4. Recomendações e Próximos Passos
1. **Mapear SLOs críticos em dashboards**
   - Adicionar painéis de disponibilidade, MTTA/MTTR e SLA de atendimento utilizando séries `up{}` ou `probe_success`, tickets incident.io e dados de helpdesk.
   - Inserir linhas de referência e indicadores de erro orçado para latência P95 e taxa de erro 5xx.
2. **Expandir alertas para requisitos não cobertos**
   - Criar regras para disponibilidade <99,5%, atraso OTA >8 min e violação de SLA de resposta (>45 min).
   - Preencher `qa-observability.yaml` com regras (ex.: cobertura < limiar) e integrar notificações com owners definidos.
3. **Corrigir e automatizar quality gates**
   - Atualizar `verify_observability_gates.py` para exigir métricas realmente presentes ou alinhar dashboards às expectativas.
   - Estender Bandit para todo o código Python, adicionar Ruff (lint), MyPy (tipagem) e scanners de dependências em jobs dedicados.
4. **Preparar novos painéis/alertas**
   - Provisionar um painel “SLO Health” consolidando disponibilidade, latência OTA e cumprimento de SLAs.
   - Criar painel operacional com backlog de incidentes, MTTA/MTTR e status de QA gates para acompanhar recomendações do checklist MVP.
5. **Documentar owners e rotações**
   - Registrar owners, canais e cadências para novos alertas nos runbooks existentes.

Essas ações alinham a observabilidade com os SLOs/SLA definidos e fortalecem a rastreabilidade de qualidade contínua.
