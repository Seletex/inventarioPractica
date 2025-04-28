# Test info

- Name: Prueba de Login >> debería mostrar un error con credenciales inválidas
- Location: C:\Users\Admin\Documents\Github\inventarioPractica\inventarioFront\src\autenticacion\pruebas\pruebasEnd\login.spec.js:9:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/login
Call log:
  - navigating to "http://localhost:5173/login", waiting until "load"

    at C:\Users\Admin\Documents\Github\inventarioPractica\inventarioFront\src\autenticacion\pruebas\pruebasEnd\login.spec.js:6:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Prueba de Login', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Visita la página de login antes de cada test
>  6 |     await page.goto('/login'); // Asume /login relativo a baseURL
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/login
   7 |   });
   8 |
   9 |   test('debería mostrar un error con credenciales inválidas', async ({ page }) => {
  10 |     // Encontrar elementos y interactuar (Playwright usa 'locator')
  11 |     await page.locator('input[name="correo"]').fill('usuario@incorrecto.com');
  12 |     await page.locator('input[name="contraseña"]').fill('passwordmal');
  13 |     await page.locator('button[type="submit"]').click();
  14 |
  15 |     // Verificar que aparece un mensaje de error (Playwright usa 'expect')
  16 |     const errorMessage = page.locator('.mensaje-error');
  17 |     await expect(errorMessage).toBeVisible();
  18 |     await expect(errorMessage).toContainText('Credenciales inválidas');
  19 |   });
  20 |
  21 |   test('debería redirigir al dashboard con credenciales válidas', async ({ page }) => {
  22 |     await page.locator('input[name="correo"]').fill('usuario@valido.com');
  23 |     await page.locator('input[name="contraseña"]').fill('passwordcorrecto');
  24 |     await page.locator('button[type="submit"]').click();
  25 |
  26 |     // Verificar que la URL cambió
  27 |     await expect(page).toHaveURL(/.*dashboard/); // O la ruta correcta
  28 |     // Verificar que algún elemento del dashboard está visible
  29 |     await expect(page.locator('h1')).toContainText('Dashboard');
  30 |   });
  31 | });
  32 |
```