# Plano de Protótipo Interativo (Figma/XD)

## Objetivo
Desenvolver protótipo navegável que cubra cenários críticos em dashboards desktop e app mobile, permitindo testes moderados com stakeholders e equipas operacionais.

## Escopo de Ecrãs
1. **Dashboard Web**
   - Vista geral com KPIs de ocupação, receitas, housekeeping.
   - Acesso rápido a notificações e tarefas pendentes.
2. **Módulo Reservas**
   - Lista de reservas com filtros, criação de reserva, detalhe de reserva.
3. **Módulo Calendário**
   - Vista semanal e mensal, popover de detalhes, gestão de conflitos.
4. **Módulo Housekeeping**
   - Planeamento diário, atribuição de tarefas, relatório de incidentes.
5. **Módulo Faturação**
   - Checkout, ajustes, geração de fatura, histórico financeiro.
6. **App Mobile Housekeeping**
   - Lista de quartos, fluxo de conclusão de tarefas, upload de fotos, alertas offline.
7. **App Mobile Gestor**
   - KPIs resumidos, aprovações rápidas, alertas críticos.

## Funcionalidades Interativas
- **Navegação global** com hotspots que simulam menu lateral e breadcrumbs.
- **Inputs dinâmicos** para simular filtros e estados (ex.: overbooking, quarto urgente).
- **Estados condicionais**: popups de confirmação, toasts de sucesso/erro.
- **Transições mobile** usando animações simples entre listas e detalhes.

## Plano de Iterações
1. **Iteração 0 – Importação dos wireframes**
   - Montar layout básico com componentes low-fi.
   - Validar fluxo global com Product Owner.
2. **Iteração 1 – Média fidelidade**
   - Aplicar grid 12 colunas, tipografia base e botões padrões.
   - Teste moderado com Gestora de Operações e Rececionista.
   - Recolher notas sobre densidade de informação e priorização de alertas.
3. **Iteração 2 – Alta fidelidade + microinterações**
   - Introduzir cores definitivas e ícones.
   - Simular estados de carregamento e vazios.
   - Testes remotos com equipa de housekeeping (mobile) e Diretor Financeiro (faturação).
4. **Iteração 3 – Hand-off para desenvolvimento**
   - Documentar componentes, tokens e variações responsivas.
   - Criar protótipos separados para cenários críticos (overbooking, checkout corporate).

## Métricas de Sucesso do Protótipo
- Tarefas críticas concluídas sem ajuda em < 2 minutos durante testes.
- Pelo menos 80% dos participantes reportam clareza nos alertas.
- Redução de erros percebidos em lançamento de tarefas housekeeping.

## Próximos Passos
- Configurar biblioteca de componentes compartilhada no Figma/XD.
- Definir guardrails de acesso e versões para revisão com stakeholders.

