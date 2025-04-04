import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
  }
}
})
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//     },
//   },
//   css: {
//     preprocessorOptions: {
//       scss: {
//         additionalData: `@import "@/styles/variables.scss";`,
//       },
//     },
//   },
//   define: {
//     'process.env': {
//       NODE_ENV: JSON.stringify(process.env.NODE_ENV),
//     },
//   },