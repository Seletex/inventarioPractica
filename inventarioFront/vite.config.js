import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config' // Ruta de importación más estándar
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'; // Para analizar los bundles

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ // Añadir el visualizador de bundles
      open: true, // Abrir automáticamente en el navegador después del build
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server:{
    optimizeDeps: {
      // '@testing-library/jest-dom' es principalmente para tests, considera si es necesario aquí.
      // 'react-table' está bien si ayuda al rendimiento del dev server.
      include: ['react-table'],
    },
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // Descomentar si tu backend no espera el prefijo /api
      }
  }
  },
  esbuild: { // Opciones específicas de esbuild
    target: 'es2020', // Asegura compatibilidad y optimizaciones modernas
    // minifyWhitespace: true, // esbuild minifica por defecto si se usa para minificación final.
                           // Para builds de producción, Vite usa Terser por defecto.
  },
  build: {
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000, // Aumenta el límite de advertencia para chunks grandes si es intencional
    // sourcemap: false // Desactivar sourcemaps en producción puede reducir tamaño y tiempo de build.
                       // Vite lo hace por defecto para producción a menos que sea modo librería.
    rollupOptions: {
      output: {
        manualChunks(id ) {
          // Agrupa React, React DOM y React Router
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'reactVendor';
          }
          // Agrupa todos los módulos de PrimeReact
          if (id.includes('node_modules/primereact')) {
            return 'primeReact';
          }
          if (id.includes('node_modules/chart.js')) {
            return 'charts'; // Nombre del chunk para Chart.js
          }
          if (id.includes('node_modules')) {
            return 'vendor-others';
          }
        }
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
