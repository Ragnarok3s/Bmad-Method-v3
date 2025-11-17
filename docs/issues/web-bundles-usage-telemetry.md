# Issue: Telemetria ausente para priorizar web bundles

## Problema
O catálogo de bundles expõe apenas metadados estáticos (slug, competências, disponibilidade) sem qualquer métrica de adoção, impossibilitando identificar quais devem ser priorizados. 【F:backend/services/core/domain/agents.py†L41-L188】 No frontend, a instrumentação de telemetria resume-se a contadores genéricos de visualização de página e não diferencia interações por bundle. 【F:frontend/telemetry/init.ts†L1-L73】

## Impacto
- Roadmaps e decisões de suporte permanecem baseados em perceção, não em uso real.
- Equipa de produto não consegue validar hipóteses de quais agentes ou expansion packs são mais valiosos.
- Ferramentas de observabilidade não conseguem alertar quando bundles críticos ficam inativos.

## Ações recomendadas
1. **Frontend**: emitir eventos `bundle_view` e `bundle_launch` com atributos `bundle_id`, `bundle_type`, `context` em pontos de interação (por ex., cards em `/agentes` e listagens equivalentes). 【F:frontend/app/agents/page.tsx†L87-L138】
2. **Backend**: persistir agregados diários/semanal de uso (tabela `analytics.bundle_usage_fact`) expostos via API `GET /bundles/usage`. 【F:backend/services/core/api/rest.py†L309-L370】
3. **Observabilidade**: criar métricas OTEL dedicadas (`bmad_web_bundle_view_total`, `bmad_core_bundle_activation_total`) e dashboards comparativos com filtros por workspace.
4. **Governança**: definir SLOs de adoção mínima por bundle e alertas quando o volume cair abaixo do limiar durante X dias consecutivos.

## Referências / Mockups
- Gráfico de ranking inspirado no painel "Top automações" do Figma `Hospitality Ops Dashboard v3` (link a anexar pela equipa de design).
- Exemplo de métrica agregada: `bundle_usage_total{bundle_id="concierge-digital", environment="prod"}`.
