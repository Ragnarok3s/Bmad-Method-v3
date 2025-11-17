import { defineConfig } from '@playwright/test';

const apiBaseUrl =
  process.env.CORE_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ??
  'http://localhost:8000';

export default defineConfig({
  testDir: '.',
  timeout: 25 * 1000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: apiBaseUrl.replace(/\/$/, ''),
  },
  reporter: [['list']],
});
