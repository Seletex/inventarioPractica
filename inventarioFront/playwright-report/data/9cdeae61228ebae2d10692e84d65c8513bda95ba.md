# Test info

- Name: Prueba de Login >> debería mostrar un error con credenciales inválidas
- Location: C:\Users\Admin\Documents\Github\inventarioPractica\inventarioFront\src\autenticacion\pruebas\pruebasEnd\login.spec.js:10:3

# Error details

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="correo"]') to be visible

    at C:\Users\Admin\Documents\Github\inventarioPractica\inventarioFront\src\autenticacion\pruebas\pruebasEnd\login.spec.js:7:48
```

# Page snapshot

```yaml
- menubar:
  - menuitem "Principal":
    - link " Principal":
      - /url: "#"
  - menuitem "Acerca de":
    - link " Acerca de":
      - /url: "#"
  - menuitem "Contacto":
    - link " Contacto":
      - /url: "#"
- text: Login 
- textbox "Carlos123"
- text: 
- textbox "Ab12345+"
- button "INGRESAR" [disabled]:  INGRESAR
- text: ¿No estás registrado?
- link "Registrarse":
  - /url: /register
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Prueba de Login', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Visita la página de login antes de cada test
   6 |     await page.goto('http://localhost:5173/login'); // Asume /login relativo a baseURL
>  7 |     await page.locator('input[name="correo"]').waitFor({ state: 'visible', timeout: 100000 }); 
     |                                                ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
   8 |   });
   9 |
  10 |   test('debería mostrar un error con credenciales inválidas', async ({ page }) => {
  11 |     // Encontrar elementos y interactuar (Playwright usa 'locator')
  12 |     await page.locator('input[name="correo"]').fill('usuario@incorrecto.com');
  13 |     await page.locator('input[name="contraseña"]').fill('passwordmal');
  14 |     await page.locator('button[type="submit"]').click();
  15 |
  16 |     // Verificar que aparece un mensaje de error (Playwright usa 'expect')
  17 |     const errorMessage = page.locator('.mensaje-error'); // Asegúrate que este selector también sea correcto
  18 |     await expect(errorMessage).toBeVisible();
  19 |     // Considera esperar a que el texto aparezca si hay alguna llamada asíncrona
  20 |     await expect(errorMessage).toContainText('Credenciales inválidas', { timeout: 5000 });
  21 |   });
  22 |
  23 |   test('debería redirigir al dashboard con credenciales válidas', async ({ page }) => {
  24 |     await page.locator('input[name="correo"]').fill('usuario@valido.com');
  25 |     await page.locator('input[name="contraseña"]').fill('passwordcorrecto');
  26 |     await page.locator('button[type="submit"]').click();
  27 |
  28 |     // Espera a que la URL cambie o a que un elemento del dashboard aparezca
  29 |     await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 }); // Espera más si la redirección tarda
  30 |     // O espera por un elemento específico del dashboard
  31 |     // await page.locator('h1:has-text("Dashboard")').waitFor({ state: 'visible', timeout: 10000 });
  32 |     await expect(page.locator('h1')).toContainText('Dashboard');
  33 |   }
  34 |   );
  35 | });
  36 |
  37 |
```