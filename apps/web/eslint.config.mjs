import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import testingLibrary from 'eslint-plugin-testing-library';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url))
});

const config = [
  ...compat.config({
    extends: ['next/core-web-vitals']
  }),
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

export default config;
