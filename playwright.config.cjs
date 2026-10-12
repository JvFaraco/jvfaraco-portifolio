const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', timeout: 20000, expect: { timeout: 2000 },
  fullyParallel: false, workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4173/jvfaraco-portifolio/',
    channel: process.env.PW_CHANNEL || undefined, viewport: { width: 1440, height: 1000 },
    screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: 'node tests/serve.cjs', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI }
});
