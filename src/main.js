import { createApp } from 'vue'
import App from './App.vue'

// resolves through package.json to the built library in dist/,
// so the playground exercises the same artifact consumers install
import Vue3ChartJs from '../'

createApp(App).use(Vue3ChartJs).mount('#app')
