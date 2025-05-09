import { test, expect } from "@playwright/test";

test.describe("Prueba de Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    await page
      .locator('input[name="correo"]')
      .waitFor({ state: "visible", timeout: 100000 });
  });

  test("debería mostrar un error con credenciales inválidas", async ({
    page,
  }) => {
    await page.locator('input[name="correo"]').fill("usuario@incorrecto.com");
    await page.locator('input[name="contraseña"]').fill("passwordmal");
    await page.locator('button[type="submit"]').click();

    const errorMessage = page.locator(".mensaje-error");
    await expect(errorMessage).toBeVisible();

    await expect(errorMessage).toContainText("Credenciales inválidas", {
      timeout: 5000,
    });
  });

  test("debería redirigir al dashboard con credenciales válidas", async ({
    page,
  }) => {
    await page.locator('input[name="correo"]').fill("usuario@valido.com");
    await page.locator('input[name="contraseña"]').fill("passwordcorrecto");
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    await expect(page.locator("h1")).toContainText("Dashboard");
  });
});
