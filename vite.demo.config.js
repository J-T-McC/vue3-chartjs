import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Builds the playground in src/ as a static site for GitHub Pages.
// The library build lives in vite.config.js and is unaffected by this.
export default defineConfig({
  base: process.env.DEMO_BASE ?? '/vue3-chartjs/',
  plugins: [vue()],
  build: {
    outDir: path.resolve(__dirname, 'demo-dist'),
    emptyOutDir: true,
  },
})
