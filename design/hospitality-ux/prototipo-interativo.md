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

### Mapeamento de telas da Iteração 3

| Tela / Fluxo | Status na iteração | Automação prevista (Figma Dev Mode / Auto Layout) | Microinterações migradas para Framer |
|--------------|-------------------|----------------------------------------------------|--------------------------------------|
| Dashboard Web – visão geral e alertas | Ajustes finais de layout responsivo | Exportação via Dev Mode com Auto Layout aplicado aos grids de cards e cabeçalho modular | Animação de surgimento de alertas (slide-in) e toasts escaláveis |
| Módulo Reservas – lista > detalhe > criar | Consolidação dos estados vazios e carregamento | Auto Layout nos blocos de filtros e cartões de reserva + props documentadas no Dev Mode | Microinteração de confirmação de reserva e feedback de conflito |
| Módulo Calendário – semanal/mensal | Refinamento de interações entre modos | Componentes de células e cabeçalhos com Auto Layout e variantes conectadas ao Dev Mode | Microinteração de drag para resolver conflitos e tooltip dinâmica |
| Módulo Housekeeping – planeamento diário | Ajuste final de tokens de cor e densidade | Auto Layout nas listas por equipa e cartões de tarefas com descrição expand/collapse em Dev Mode | Microinteração de conclusão de tarefa com indicador de progresso |
| Módulo Faturação – checkout corporate | Ajuste de mensagens de erro e confirmação | Layout das etapas com Auto Layout e documentação de tokens monetários no Dev Mode | Microinteração de revisão de fatura (accordion + highlight) |
| App Mobile Housekeeping – fluxo offline | Preparação para QA de acessibilidade | Componentes mobile exportados via Dev Mode e empilhamento adaptativo com Auto Layout | Microinteração de sync offline (status pulsante) |
| App Mobile Gestor – alertas críticos | Ajuste final de prioridades | Blocos de KPI com Auto Layout e estilos documentados via Dev Mode | Microinteração de expansão de alertas críticos |

## Checklist de Acessibilidade Integrado

| Critério | Como validar no protótipo | Responsável | Status de validação |
|----------|---------------------------|-------------|---------------------|
| Contraste mínimo 4,5:1 em texto e ícones | Uso do plugin Stark/Contrast no Figma e captura de evidências por tela | Design Lead | Atualizado a cada iteração de alta fidelidade |
| Navegação por teclado e ordem de foco lógica | Prototipar hotspots em sequência tab-friendly e gravar walkthrough com teclado | UX Researcher | Validado nos testes moderados das Iterações 1 e 2 |
| Alternativas textuais e etiquetas ARIA | Mapear nomes acessíveis nos componentes e documentar atributos no painel de inspect | Design Systems Ops | Checklist concluído antes do hand-off |
| Feedback visual e auditivo em estados críticos | Incluir toasts, mensagens e reforço auditivo (quando aplicável) nas interações simuladas | Design Lead + PO | Retestado na revisão final com stakeholders |
| Compatibilidade com leitor de ecrã | Ensaiar fluxo com NVDA/VoiceOver, garantindo ordem de leitura correta e skip links | QA de Acessibilidade | Teste registrado na Iteração 2 |

> **Referência**: Checklist baseado em WCAG 2.1 nível AA e requisitos internos de acessibilidade do kick-off. Gaps identificados devem ser registrados no quadro de ações corretivas e acompanhados até resolução.

### Plano de correção de gaps críticos

| Gap | Responsável | Prazo | Observações |
|-----|-------------|-------|-------------|
| Foco visível inconsistente em modais e listas aninhadas | Design Systems Ops (Joana Reis) | 2024-08-02 | Criar estilos de foco unificados no design system e aplicar nos componentes ligados ao Dev Mode |
| Ordem de leitura desalinhada no dashboard mobile | Accessibility QA (Miguel Duarte) + Design Lead (Inês Faria) | 2024-08-06 | Revisar estruturas Auto Layout e landmarks semânticos, validar com gravação NVDA pós-ajuste |

## Métricas de Sucesso do Protótipo
- Tarefas críticas concluídas sem ajuda em < 2 minutos durante testes.
- Pelo menos 80% dos participantes reportam clareza nos alertas.
- Redução de erros percebidos em lançamento de tarefas housekeeping.

## Próximos Passos
- Configurar biblioteca de componentes compartilhada no Figma/XD.
- Definir guardrails de acesso e versões para revisão com stakeholders.

## Prompts-base para Figma AI

- "Gerar variante de dashboard desktop mantendo tokens `Neutral-100/900`, grid 12 colunas e hierarquia de títulos H1/H2 aprovada; priorizar cards de alertas à esquerda e módulos financeiros à direita."
- "Criar layout alternativo para fluxo de reserva com steps em formato timeline; preservar botões primários com token `Primary-500` e espaçamento vertical `Spacing-24`."
- "Propor versão compacta do módulo Housekeeping destacando KPIs diários acima da lista; respeitar tipografia `Heading SM / Body MD` e ícones padrão Hospitality Ops."
- "Sugerir variação mobile para alertas críticos do Gestor com cards empilhados; manter tokens `Warning-500` e `Success-500` e slots de ações secundárias definidos."
- "Gerar estado de vazio para calendário semanal mantendo legenda de cores aprovada e placeholders com tokens `Neutral-200` e `Neutral-500` para texto."

## Hand-off 2024-07-15

- **Checklist de acessibilidade anexado**: o checklist detalhado utilizado no hand-off final foi publicado em `design/hospitality-ux/checklist-acessibilidade-hand-off-2024-07-15.md`, incluindo evidências de contraste, navegação por teclado e uso de leitores de ecrã. Referência direta: [Checklist Iteração 3](https://www.figma.com/file/ABCD1234/hospitality-ux-accessibility?type=design&node-id=10-20).
- **Notas de gaps**: três gaps menores (foco visível no modal de confirmação, descrição alternativa de ícone de sincronização offline e coerência na ordem de leitura do dashboard mobile) foram registrados no quadro de ações corretivas (`docs/revisao-validacao-artefatos.md`) com responsáveis e prazos. Acompanhamento ativo nos cards [Jira UX-HK-217](https://jira.example.com/browse/UX-HK-217) e [Jira UX-HK-221](https://jira.example.com/browse/UX-HK-221).
- **Entrega para engenharia**: os protótipos finais e bibliotecas de componentes foram vinculados aos cards Jira de hand-off (`UX-HK-*`) com links permanentes para os arquivos Figma e gravações de testes assistidos: [Biblioteca Hospitality Ops DS](https://www.figma.com/file/QWER5678/hospitality-ops-ds?type=design&node-id=2-34), [Protótipos navegáveis Iteração 3](https://www.figma.com/proto/QWER5678/hospitality-ops-ds?page-id=15%3A1&node-id=34-89), [Gravações de testes moderados](https://drive.example.com/drive/folders/TESTES-HOSPITALITY-UX).

