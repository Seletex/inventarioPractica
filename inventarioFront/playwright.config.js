// playwright.config.js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/autenticacion/pruebas/pruebasEnd", // O donde quieras poner tus tests E2E
  fullyParallel: true,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173", // La URL donde corre tu app en desarrollo
    trace: "on-first-retry",
  },
  projects: [
    // Configuración para diferentes navegadores
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
