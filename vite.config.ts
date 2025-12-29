import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mod/assign/dist/',
  build: {
    outDir: './mod/assign/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/main.tsx',
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    }
  }
})
