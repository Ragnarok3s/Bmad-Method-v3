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
   - Executar varredura inicial com o checklist de acessibilidade (hierarquia de títulos, navegação por teclado e foco visível).
2. **Iteração 1 – Média fidelidade**
   - Aplicar grid 12 colunas, tipografia base e botões padrões.
   - Teste moderado com Gestora de Operações e Rececionista.
   - Recolher notas sobre densidade de informação e priorização de alertas.
   - Validar contraste, proporção de texto e alternativas textuais de ícones segundo WCAG 2.1 AA.
3. **Iteração 2 – Alta fidelidade + microinterações**
   - Introduzir cores definitivas e ícones.
   - Simular estados de carregamento e vazios.
   - Testes remotos com equipa de housekeeping (mobile) e Diretor Financeiro (faturação).
   - Executar testes com leitor de ecrã (NVDA/VoiceOver) e navegação por teclado ponta-a-ponta, ajustando etiquetas ARIA e ordem de tabulação.
4. **Iteração 3 – Hand-off para desenvolvimento**
   - Documentar componentes, tokens e variações responsivas.
   - Criar protótipos separados para cenários críticos (overbooking, checkout corporate).
   - Anexar checklist preenchido e anotações de gaps para cada fluxo crítico na entrega para engenharia.

## Checklist de Acessibilidade Integrado

| Critério | Como validar no protótipo | Responsável | Status de validação |
|----------|---------------------------|-------------|---------------------|
| Contraste mínimo 4,5:1 em texto e ícones | Uso do plugin Stark/Contrast no Figma e captura de evidências por tela | Design Lead | Atualizado a cada iteração de alta fidelidade |
| Navegação por teclado e ordem de foco lógica | Prototipar hotspots em sequência tab-friendly e gravar walkthrough com teclado | UX Researcher | Validado nos testes moderados das Iterações 1 e 2 |
| Alternativas textuais e etiquetas ARIA | Mapear nomes acessíveis nos componentes e documentar atributos no painel de inspect | Design Systems Ops | Checklist concluído antes do hand-off |
| Feedback visual e auditivo em estados críticos | Incluir toasts, mensagens e reforço auditivo (quando aplicável) nas interações simuladas | Design Lead + PO | Retestado na revisão final com stakeholders |
| Compatibilidade com leitor de ecrã | Ensaiar fluxo com NVDA/VoiceOver, garantindo ordem de leitura correta e skip links | QA de Acessibilidade | Teste registrado na Iteração 2 |

> **Referência**: Checklist baseado em WCAG 2.1 nível AA e requisitos internos de acessibilidade do kick-off. Gaps identificados devem ser registrados no quadro de ações corretivas e acompanhados até resolução.

## Métricas de Sucesso do Protótipo
- Tarefas críticas concluídas sem ajuda em < 2 minutos durante testes.
- Pelo menos 80% dos participantes reportam clareza nos alertas.
- Redução de erros percebidos em lançamento de tarefas housekeeping.

## Próximos Passos
- Configurar biblioteca de componentes compartilhada no Figma/XD.
- Definir guardrails de acesso e versões para revisão com stakeholders.

