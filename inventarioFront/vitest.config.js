import { defineConfig } from 'vitest/config'; // Importación estándar
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Plugin de React para transformar JSX
  test: {
    globals: true, // Habilita APIs globales (describe, test, expect, etc.)
    environment: 'jsdom', // Simula un entorno de navegador (DOM)
    setupFiles: './src/setupTests.js', // Archivo para configuración inicial de pruebas (importar jest-dom)
    // Para mantener o ajustar los patrones include/exclude si se necesita
    // include: ['src/**/*.{test,spec}.{js,jsx}'],
    // exclude: ['**/node_modules/**', '**/dist/**', './e2e/*'],
    clearMocks: false, // Limpia mocks antes de cada test
    restoreMocks: false, // Restaura mocks después de cada test
  },
});