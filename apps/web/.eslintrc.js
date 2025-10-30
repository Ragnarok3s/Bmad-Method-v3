module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    jest: true
  },
  extends: ['next/core-web-vitals', 'plugin:jsx-a11y/recommended'],
  plugins: ['jsx-a11y'],
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'jsx-a11y/anchor-is-valid': 'off'
  },
  overrides: [
    {
      files: ['components/ui/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'ExportDefaultDeclaration',
            message:
              'Design system components devem usar exports nomeados para manter APIs previsíveis.'
          }
        ],
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'function-declaration',
            unnamedComponents: 'function-expression'
          }
        ],
        'jsx-a11y/no-noninteractive-element-interactions': 'error',
        'jsx-a11y/no-static-element-interactions': 'error'
      }
    },
    {
      files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
      extends: ['plugin:testing-library/react'],
      plugins: ['testing-library'],
      rules: {
        'testing-library/prefer-screen-queries': 'warn',
        'testing-library/prefer-user-event': 'warn'
      }
    }
  ]
};
