import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_PORT = process.env.TEST_BASIC_BACKEND_PORT || "8010";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
      },
    },
  ],
  webServer: [
    {
      command: `.venv\\Scripts\\python.exe -m flask --app app.main run --port ${BACKEND_PORT} --host 127.0.0.1`,
      cwd: path.resolve(__dirname, "../backend"),
      url: `http://127.0.0.1:${BACKEND_PORT}/api/v1/health`,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: `npx vite --config vite.local-8010.config.js`,
      cwd: __dirname,
      url: "http://127.0.0.1:5173",
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});
