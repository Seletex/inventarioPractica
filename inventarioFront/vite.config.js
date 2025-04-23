import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/dist/config'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server:{
   
    optimizeDeps: {
      
      include: ['@testing-library/jest-dom', 'react-table'],
    },
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
  }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['**/*.{test,spec}.{js,jsx}'], // Patrón modificado
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      ...configDefaults.exclude, './e2e/*'
    ]
    //exclude: [...configDefaults.exclude, '**/src/componentes/Pruebas/*.test.jsx'],
  }
})
