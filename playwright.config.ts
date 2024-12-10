import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  retries: 1,
  testDir: './tests',
  reporter: 'html', // Generates an HTML report
});
