import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config"; // Ruta de importación más estándar
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer"; // Para analizar los bundles
import viteCompression from "vite-plugin-compression"; // Importar el plugin de compresión

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    // Aplicar compresión Gzip en el build de producción
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024, // Solo comprime archivos más grandes que 1kb
      deleteOriginFile: false, // Mantener los archivos originales
      filter: /\.(js|mjs|json|css|html|xml|txt|svg)$/i, // Tipos de archivo a comprimir
    }),
    // Aplicar compresión Brotli en el build de producción
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024, // Solo comprime archivos más grandes que 1kb
      // Opciones de calidad para Brotli (0-11).
      // El plugin usa un buen valor por defecto. Si quieres ser explícito:
      // compressionOptions: { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6 } }, // Necesitarías importar zlib
      deleteOriginFile: false, // Mantener los archivos originales
      filter: /\.(js|mjs|json|css|html|xml|txt|svg)$/i, // Tipos de archivo a comprimir
    }),
  ],
  server: {
    optimizeDeps: {
      include: ["react-table"],
    },
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },

  build: {
    target: "es2020",
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router-dom")
          ) {
            return "reactVendor";
          }

          if (id.includes("node_modules/primereact")) {
            return "primeReact";
          }
          if (id.includes("node_modules/chart.js")) {
            return "charts";
          }
          if (id.includes("node_modules")) {
            return "vendor-others";
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    include: ["**/*.{test,spec}.{js,jsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      ...configDefaults.exclude,
      "./e2e/*",
    ],
  },
});
