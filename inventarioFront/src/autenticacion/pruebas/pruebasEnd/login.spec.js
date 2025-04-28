import { test, expect } from '@playwright/test';

test.describe('Prueba de Login', () => {
  test.beforeEach(async ({ page }) => {
    // Visita la página de login antes de cada test
    await page.goto('/login'); // Asume /login relativo a baseURL
  });

  test('debería mostrar un error con credenciales inválidas', async ({ page }) => {
    // Encontrar elementos y interactuar (Playwright usa 'locator')
    await page.locator('input[name="correo"]').fill('usuario@incorrecto.com');
    await page.locator('input[name="contraseña"]').fill('passwordmal');
    await page.locator('button[type="submit"]').click();

    // Verificar que aparece un mensaje de error (Playwright usa 'expect')
    const errorMessage = page.locator('.mensaje-error');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Credenciales inválidas');
  });

  test('debería redirigir al dashboard con credenciales válidas', async ({ page }) => {
    await page.locator('input[name="correo"]').fill('usuario@valido.com');
    await page.locator('input[name="contraseña"]').fill('passwordcorrecto');
    await page.locator('button[type="submit"]').click();

    // Verificar que la URL cambió
    await expect(page).toHaveURL(/.*dashboard/); // O la ruta correcta
    // Verificar que algún elemento del dashboard está visible
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
