import { createApp } from 'vue'
import App from './App.vue'

import Vue3ChartJs  from '../lib/main'

import zoomPlugin from 'chartjs-plugin-zoom'

Vue3ChartJs.registerGlobalPlugins([zoomPlugin])

const Vue = createApp(App)

// Vue.use(Vue3ChartJs, {
//   plugins: [
//     zoomPlugin
//   ]
// })

Vue.mount('#app')
