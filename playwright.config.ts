import { defineConfig, devices } from '@playwright/test';

// Tests dans un vrai navigateur, sur la version construite (pnpm build), comme en production :
// téléphone d'abord, puis ordinateur ; accessibilité vérifiée par axe en clair et en sombre.
const port = 3200;
const url = `http://127.0.0.1:${String(port)}`;
const enCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',
  forbidOnly: enCI,
  retries: enCI ? 1 : 0,
  reporter: enCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: url, trace: 'retain-on-failure' },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'ordinateur', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `pnpm exec next start --hostname 127.0.0.1 --port ${String(port)}`,
    url: `${url}/sante`,
    reuseExistingServer: !enCI,
    timeout: 60_000,
  },
});
