import { App } from 'vue';
import Vue3ChartJs from './Vue3ChartJs.vue';
import { Chart, Plugin } from 'chart.js';

Vue3ChartJs.registerGlobalPlugins = (plugins: Plugin[]) => {
  Chart.register(...plugins);
};

Vue3ChartJs.install = (app: App, options: { plugins?: Plugin[] } = {}) => {
  app.component(Vue3ChartJs.name ?? 'Vue3ChartJs', Vue3ChartJs);

  if (options?.plugins?.length) {
    Vue3ChartJs.registerGlobalPlugins(options.plugins);
  }
};

export default Vue3ChartJs;