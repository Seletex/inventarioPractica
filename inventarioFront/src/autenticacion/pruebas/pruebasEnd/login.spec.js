import { test, expect } from '@playwright/test';

test.describe('Prueba de Login', () => {
  test.beforeEach(async ({ page }) => {
    // Visita la página de login antes de cada test
    await page.goto('http://localhost:5173/login'); // Asume /login relativo a baseURL
    await page.locator('input[name="correo"]').waitFor({ state: 'visible', timeout: 100000 }); 
  });

  test('debería mostrar un error con credenciales inválidas', async ({ page }) => {
    // Encontrar elementos y interactuar (Playwright usa 'locator')
    await page.locator('input[name="correo"]').fill('usuario@incorrecto.com');
    await page.locator('input[name="contraseña"]').fill('passwordmal');
    await page.locator('button[type="submit"]').click();

    // Verificar que aparece un mensaje de error (Playwright usa 'expect')
    const errorMessage = page.locator('.mensaje-error'); // Asegúrate que este selector también sea correcto
    await expect(errorMessage).toBeVisible();
    // Considera esperar a que el texto aparezca si hay alguna llamada asíncrona
    await expect(errorMessage).toContainText('Credenciales inválidas', { timeout: 5000 });
  });

  test('debería redirigir al dashboard con credenciales válidas', async ({ page }) => {
    await page.locator('input[name="correo"]').fill('usuario@valido.com');
    await page.locator('input[name="contraseña"]').fill('passwordcorrecto');
    await page.locator('button[type="submit"]').click();

    // Espera a que la URL cambie o a que un elemento del dashboard aparezca
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 }); // Espera más si la redirección tarda
    // O espera por un elemento específico del dashboard
    // await page.locator('h1:has-text("Dashboard")').waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Dashboard');
  }
  );
});

