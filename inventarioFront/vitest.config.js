import { defineConfig } from 'vitest/dist/config';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config.js';

export default defineConfig({
    plugins: [react()],
    
    environment: 'jsdom',
  test: {
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    exclude: ['**/node_modules/**', ...configDefaults.exclude, './e2e/*']
  },
  globals: true,
});