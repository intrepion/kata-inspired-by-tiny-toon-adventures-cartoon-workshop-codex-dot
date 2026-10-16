import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  testMatch: "**/*.spec.ts",
  use: { baseURL: "http://127.0.0.1:5222", headless: true },
  webServer: {
    command: "npm run dev -- --port 5222 --strictPort",
    url: "http://127.0.0.1:5222",
    reuseExistingServer: false,
  },
});
