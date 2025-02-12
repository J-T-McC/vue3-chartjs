import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import dts from 'vite-plugin-dts'

const externalDeps = ['vue', 'chart.js'];
const globals = { vue: 'Vue', 'chart.js': 'Chart' };

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      checker({ typescript: true }),
      dts({
        outputDir: 'dist',
        entryRoot: 'lib',
        insertTypesEntry: true,
        rollupTypes: true,
      }),
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'lib/main.ts'),
        name: 'Vue3ChartJs',
      },
      rollupOptions: {
        external: externalDeps,
        output: [
          {
            format: 'es',
            entryFileNames: 'vue3-chartjs.es.js',
            globals,
          },
          {
            format: 'umd',
            entryFileNames: 'vue3-chartjs.umd.js',
            name: 'Vue3ChartJs',
            globals,
          },
        ],
      },
    },
  }
})
