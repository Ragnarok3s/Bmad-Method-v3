# Checklist de Acessibilidade — Hand-off 2024-07-15

## Contexto
- **Protótipos**: fluxos web (dashboard, reservas, calendário, faturação) e mobile (housekeeping, gestor) entregues no Figma.
- **Revisão conduzida por**: Laura Pinto (Design Lead), Tiago Santos (QA Acessibilidade), Ana Ribeiro (PO).
- **Referências normativas**: WCAG 2.1 nível AA, políticas internas descritas em `docs/property-mvp-plan.md` e `docs/dor-dod-package.md`.

## Checklist Consolidado
| Critério | Evidência | Status | Observações |
|----------|-----------|--------|-------------|
| Contraste mínimo 4,5:1 para texto/ícones | Capturas Stark anexadas aos frames `Dashboard 3.2`, `HK-Mobile 2.1`. | ✅ | Ajustado contraste dos gráficos secundários para #2F3B57. |
| Navegação por teclado com foco visível | Vídeo `keyboard-walkthrough-2024-07-15.mp4` anexado ao card Jira `UX-HK-23`. | ✅ | Ordem de foco revisada na tela de filtros avançados. |
| Alternativas textuais e etiquetas ARIA | Planilha `aria-labels-handoff-2024-07-15.xlsx` adicionada ao board UX. | ✅ | Incluída descrição "Sincronizar offline" para botão de sync rápido. |
| Feedback auditivo/visual em estados críticos | Vídeo `incidents-audible-feedback.mp4` (pasta Evidências — SharePoint) + Detox `apps/mobile/e2e/housekeeping.e2e.ts`. | ✅ | Modal acessível com foco automático validado em VoiceOver/Detox. |
| Compatibilidade com leitor de ecrã | Vídeo `housekeeping-voiceover.mp4` (pasta Evidências — SharePoint) e teste `housekeeping.e2e.ts`. | ✅ | Ordem de leitura do card ajustada (título → estado → reserva → notas → ação). |
| Switch Control (varredura assistiva) | Vídeo `housekeeping-switch-control.mp4` (pasta Evidências — SharePoint) e teste `housekeeping.e2e.ts`. | ✅ | Botão de alternar estado da tarefa acionável com foco programático. |
| Comportamento responsivo e zoom 200% | Capturas com zoom 200% e layout responsivo em `responsive-validation.pdf`. | ✅ | Ajustes de espaçamento aplicados nas colunas de métricas. |

## Gaps e Ações Registradas
1. **Foco visível no modal de confirmação (Web)** — Owner: Design Systems Ops (prazo 2024-07-18). Status: Em andamento.
2. **Descrição alternativa do ícone de sincronização offline (Mobile)** — Owner: QA Acessibilidade (prazo 2024-07-17). Status: Concluída (aguardando validação final no dev).
3. **Ordem de leitura do card de quartos (Mobile)** — Owner: Engenharia Mobile (prazo 2024-07-22). Status: Concluída; evidência nos testes Detox (`housekeeping.e2e.ts`) e vídeo `housekeeping-voiceover.mp4`.

> Todos os itens acima foram adicionados ao quadro de ações corretivas em `docs/revisao-validacao-artefatos.md` e aos respectivos cards Jira (`UX-HK-24`, `UX-HK-25`, `MOB-HK-14`).

## Próximos Passos
- Validar correções durante o primeiro ciclo de QA acessibilidade na Sprint 1.
- Atualizar este checklist com resultado dos testes em ambiente de desenvolvimento e anexar gravações ao board.
