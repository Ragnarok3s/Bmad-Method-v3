# Guia de acessibilidade – componentes de estado

## Atualizações de julho de 2024

### Tokens de cor revistos
- Novos tokens centralizados em `apps/web/src/theme/statusTokens.ts` asseguram contraste ≥ 4.5:1 entre texto e fundo para variantes `success`, `warning`, `critical`, `info` e `neutral` em modos claro/escuro.
- Variáveis CSS dedicadas (`--status-*-surface`, `--status-*-text`, `--status-*-border` e `--status-*-icon`) foram adicionadas ao `globals.css`, permitindo auditoria e evolução consistente das cores de feedback.

### Componentes atualizados
- `StatusBadge` agora aplica os tokens de cor, apresenta ícones `lucide-react` adequados por variante, aceita `ariaLabel` opcional e suporta foco visível através de `focusable`.
- `Card` adopta os mesmos tokens para destacar o `accent`, inclui rótulo textual com ícone descritivo e fornece estado de foco quando `focusable` é definido.

### Critérios de validação obrigatórios
1. **Contraste** – verifique que cada badge ou card com `accent` mantém contraste AA usando as variáveis de token.
2. **Feedback visível** – badges e cards com `focusable` devem exibir `outline` contrastante (`var(--card-accent-border)` ou equivalente).
3. **Compatibilidade de leitores de ecrã** – forneça `ariaLabel` quando o conteúdo do badge não descrever plenamente o estado.
4. **Regressões** – execute `npm run test --workspace @bmad/web -- --runTestsByPath src/__tests__/a11y/status-components.a11y.test.tsx --runInBand` antes do merge.

### Automação no CI
- O workflow `.github/workflows/frontend.yml` garante a execução contínua dos testes axe-core focados em acessibilidade para badges e cards.
