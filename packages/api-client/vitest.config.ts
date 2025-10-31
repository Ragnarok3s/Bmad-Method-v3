import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts']
  },
  coverage: {
    enabled: Boolean(process.env.CI),
    provider: 'istanbul',
    reporter: ['text', 'cobertura'],
    reportsDirectory: '../../artifacts/coverage/api-client'
  }
});
