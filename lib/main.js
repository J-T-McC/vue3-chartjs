import Vue3ChartJs from './Vue3ChartJs.vue'
import { Chart } from 'chart.js'

Vue3ChartJs.registerGlobalPlugins = (plugins) => {
  Chart.register(...plugins)
}

Vue3ChartJs.install = (app, options = {}) => {
  app.component(Vue3ChartJs.name, Vue3ChartJs)

  if (options?.plugins?.length) {
    Vue3ChartJs.registerGlobalPlugins(options.plugins)
  }
}

export default Vue3ChartJs