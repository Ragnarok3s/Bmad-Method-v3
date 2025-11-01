import nextConfig from 'eslint-config-next';
import testingLibrary from 'eslint-plugin-testing-library';

export default [
  ...nextConfig,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      'jsx-a11y/anchor-is-valid': 'off'
    }
  },
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
    plugins: {
      'testing-library': testingLibrary
    },
    rules: {
      'testing-library/prefer-screen-queries': 'warn',
      'testing-library/prefer-user-event': 'warn'
    }
  }
];
