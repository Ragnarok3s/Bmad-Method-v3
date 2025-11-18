# Roteiro da Demo – Bmad Method v3

## Objetivo da Apresentação
Demonstrar a experiência ponta-a-ponta do workspace Bmad Method v3 para stakeholders de operações e segurança, destacando gestão de papéis, fluxos críticos e integrações de suporte.

## Preparação
- Ambiente: workspace de staging sincronizado com dados de demonstração (`dataset: hospitality-sprint3`).
- Perfis disponíveis: `admin`, `property_manager`, `housekeeping`, `ota`.
- Artefatos de apoio: [Manual do Usuário](../manual-do-usuario.md), [Protótipo Interativo](../../design/hospitality-ux/prototipo-interativo.md#hand-off-2024-07-15), [Runbook Gestão de Acessos](../runbooks/gestao-acessos.md).

## Agenda Sugerida (30 minutos)

| Bloco | Duração | Objetivo | Checkpoints de Papéis/Permissões |
|-------|---------|----------|----------------------------------|
| 1. Abertura & Contexto | 5 min | Relembrar metas da sprint e métricas-chave. | Confirmar que o apresentador está autenticado como `admin` (mostrar badge no cabeçalho). |
| 2. Configurações Iniciais | 5 min | Navegar por Configurações → Acesso & Permissões. | Mostrar matriz de papéis, executar filtro por `housekeeping`, validar auditoria mensal e destacar botão "Exportar CSV". |
| 3. Fluxo de Playbook & Housekeeping | 7 min | Executar playbook sandbox e demonstrar o quadro web de tarefas. | Alternar para visão `housekeeping`, registrar conclusão de tarefa e evidenciar limites de edição (sem acesso a metas globais). |
| 4. Calendário Operacional & Incidentes | 5 min | Resolver conflito de overbooking. | Logar como `property_manager`, exibir banner de acesso restrito a integrações OTA e provar que permissões de administração permanecem bloqueadas. |
| 5. Analytics & Auditoria | 4 min | Revisar KPIs e logs de acesso. | Mostrar dashboard de auditorias, destacar trilha `/audit/access`, reforçar revisão trimestral de papéis. |
| 6. Encerramento & Próximos Passos | 4 min | Recapitular SLAs e ações de follow-up. | Reforçar necessidade de abrir ticket ITSM para mudanças futuras e apontar runbook correspondente. |

## Script Detalhado

1. **Introdução (Admin)**
   - Slide 1: visão geral da plataforma e indicadores de adoção.
   - Mostrar painel inicial com cartões de agentes ativos, reforçando que apenas `admin` visualiza métricas globais.
2. **Tour por Acesso & Permissões**
   - Navegar até Configurações → Acesso & Permissões.
   - Filtrar por papéis e destacar herança conforme [Matriz de Permissões](../manual-do-usuario.md#matriz-de-permiss%C3%B5es-de-agentes).
   - Mostrar botão "Adicionar membro" e explicar processo de aprovação via runbook.
3. **Demonstração do Fluxo Housekeeping**
   - Trocar para sessão `housekeeping` (usar modo incógnito ou sessão secundária).
   - Executar playbook "Limpeza pré-check-in"; mostrar impossibilidade de editar metas, apenas atualizar status.
   - Destacar o quadro web responsivo (lista/kanban) e como ele substitui o protótipo mobile anterior.
4. **Gestão de Overbooking (Property Manager)**
   - Iniciar sessão `property_manager` e abrir módulo Calendário.
   - Mostrar alerta de conflito, utilizar ação "Reatribuir quarto" e evidenciar log no painel lateral.
   - Destacar que permissões não permitem aprovar integrações OTA (botão cinza/desabilitado).
5. **Revisão OTA & Auditorias (Admin)**
   - Retornar à sessão `admin` e abrir módulo Analytics → "Auditorias".
   - Exibir relatório `/audit/access`, mencionar exportação mensal para `drive://bmad/security/auditorias`.
   - Apontar próximos passos: revisão de acessos, acompanhamento dos tickets abertos.
6. **Q&A e Call to Action**
   - Convidar stakeholders a consultar a base de conhecimento e registrar feedback.
   - Encerrar reforçando SLA de provisionamento (8h úteis) e revogação (15 min).

## Evidências Pós-Demo
- Atualizar ticket de demonstração com gravação e capturas.
- Registrar ajustes solicitados na retrospectiva compartilhada (`docs/evidencias/retros-demo-hosp.md`).
- Revalidar checklist de acesso listado no manual antes da próxima sessão.
