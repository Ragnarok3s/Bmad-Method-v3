# Issue: Baixo contraste em badges e realces de cards

## Problema
As variantes `success` e `critical` de `StatusBadge` utilizam texto colorido sobre fundos translúcidos, atingindo contraste ~1.96:1 e ~2.71:1 respectivamente, abaixo do mínimo exigido (WCAG AA 4.5:1). 【F:frontend/components/ui/StatusBadge.tsx†L5-L36】【e6e134†L1-L25】【2749cc†L1-L4】 Além disso, `Card` depende apenas de uma borda colorida para indicar estado, o que não é perceptível para utilizadores com daltonismo. 【F:frontend/components/ui/Card.tsx†L11-L53】

## Impacto
- Usuários com visão reduzida não conseguem diferenciar estados "Disponível" vs. "Atenção" nos cards.
- Pode gerar não conformidade AA e reprovação em auditorias de acessibilidade.
- Mensagens críticas (ex.: erros em `/agentes`) passam despercebidas.

## Ações recomendadas
1. Atualizar tokens de cor (`globals.css`) com pares contrastantes (ex.: substituir `--color-soft-aqua` por tom mais escuro para texto ou inverter para texto branco sobre fundo sólido). 【F:frontend/app/globals.css†L1-L98】
2. Ajustar `StatusBadge` para suportar variantes com `aria-label` opcional, ícones e background opaco (`color: #0b3c5d`, `background: #C1EFE7`, etc.). 【F:frontend/components/ui/StatusBadge.tsx†L5-L36】
3. Incluir elemento visual adicional no `Card` (ícone, label textual "Estado: ..." ou `role="status"`) para transmitir significado além da cor. 【F:frontend/components/ui/Card.tsx†L11-L53】
4. Criar testes de snapshot/visual regression garantindo contraste mínimo antes de merges (ex.: storybook + axe).

## Referências / Mockups
- WCAG 2.1 — Success Criterion 1.4.3 (Contrast Minimum).
- Moodboard "Hospitality Alerts" (Figma) com ícones + barra lateral colorida — solicitar asset à equipa de design.
