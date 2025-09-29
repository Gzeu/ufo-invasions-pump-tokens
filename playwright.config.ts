import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30000,
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    headless: true
  },
  webServer: {
    command: "cross-env REACT_APP_E2E_MOCK_CHAIN=1 BROWSER=none npm start",
    url: "http://localhost:3000",
    timeout: 120000,
    reuseExistingServer: !process.env.CI
  }
});