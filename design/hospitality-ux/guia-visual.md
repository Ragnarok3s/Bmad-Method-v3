# Guideline Visual

Define princípios visuais para garantir consistência entre dashboards web e aplicações mobile da plataforma hoteleira.

## Identidade
- **Mood**: Confiança, eficiência e hospitalidade moderna.
- **Paleta base**
  - Azul Profundo (#0B3C5D) — primária para headers, CTAs principais.
  - Aqua Suave (#2EC4B6) — destaques positivos, estados "Disponível".
  - Dourado Calmo (#E0A458) — VIP, upsell e alertas de oportunidade.
  - Cinza Neutro 1 (#F4F5F7) — fundos, cards.
  - Cinza Neutro 2 (#6B7280) — texto secundário.
  - Vermelho Coral (#EF6351) — alertas críticos, overbooking.
- **Gradientes** reservados para dashboards com métricas agregadas (ex.: azul → aqua).

## Tipografia
- **Primária (UI)**: "Inter" (fallback "Helvetica Neue", sans-serif).
  - Pesos: 400, 500, 600, 700.
  - Hierarquia: H1 32px/40, H2 24px/32, H3 20px/28, body 16px/24, legendas 14px/20.
- **Secundária (Material promocional)**: "Playfair Display" para headings em comunicação premium.

## Componentes Reutilizáveis
- **Botões**
  - Primário: Azul Profundo, raio 8px, shadow leve, estados hover (escurecer 10%).
  - Secundário: Contorno Aqua Suave, fundo branco.
  - Destrutivo: Vermelho Coral, texto branco.
- **Cards de estado**
  - Barra lateral esquerda com ícone 24px, título 16px, badge de estado.
  - Variantes: Sucesso (Aqua Suave), Alerta (Dourado), Critico (Coral).
- **Listas e Tabelas**
  - Cabeçalhos sticky, zebra striping com Cinza Neutro 1.
  - Badges com cantos arredondados 6px, tipografia 12px bold.
- **Painéis modais**
  - Largura 640px (desktop), 90% (mobile), overlay 60% opacidade.
  - Botões primário + secundário alinhados à direita.

## Iconografia & Ilustração
- Estilo linear com cantos arredondados (24px grid).
- Ícones de estado: check, relógio, alerta, limpeza, faturação.
- Ilustrações minimalistas (flat) para estados vazios, sempre com toque humano (ex.: empregado com tablet).

## Layout & Espaçamento
- Grid desktop: 12 colunas, gutter 24px, margens 32px.
- Grid tablet: 8 colunas, gutter 16px.
- Grid mobile: 4 colunas, gutter 12px.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48.

## Acessibilidade
- Contraste mínimo 4.5:1 para texto normal.
- Estados focados com outline Aqua Suave 2px.
- Motion reduzida disponível (desativar animações não essenciais).
- Texto de botões e ícones com labels para screen readers.

## Documentação e Hand-off
- Tokenizar cores, tipografia e espaçamentos em biblioteca Figma.
- Manter changelog de componentes reutilizáveis.
- Criar páginas específicas para flows de reserva, housekeeping e faturação com exemplos responsivos.

