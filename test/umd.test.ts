import fs from 'fs';
import path from 'path';

/**
 * Loads a file the way a classic <script> tag would: no module, exports or
 * define in scope, so a UMD bundle takes its browser-global branch.
 *
 * globalName promotes a top-level `var X = ...` onto globalThis. A real
 * <script> does that implicitly, but the function scope used here does not,
 * and vue.global.js declares its export that way.
 */
const loadAsScript = (relative: string, globalName?: string) => {
  const code = fs.readFileSync(path.resolve(__dirname, '..', relative), 'utf8');
  const promote = globalName
    ? `;if (typeof ${globalName} !== 'undefined') { globalThis.${globalName} = ${globalName}; }`
    : '';
  const fn = new Function('module', 'exports', 'define', 'require', code + promote);
  fn.call(globalThis, undefined, undefined, undefined, undefined);
};

const g = globalThis as any;

const doughnut = {
  type: 'doughnut',
  data: {
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: [40, 20, 80, 10]
      }
    ]
  },
  options: { responsive: false }
};

describe('UMD build', () => {
  beforeAll(() => {
    loadAsScript('node_modules/vue/dist/vue.global.js', 'Vue');
    loadAsScript('node_modules/chart.js/dist/chart.umd.js');
    loadAsScript('dist/vue3-chartjs.umd.js');
  });

  it('exposes the component on the global object', () => {
    expect(typeof g.Vue).toBe('object');
    expect(typeof g.Chart).toBe('function');
    expect(typeof g.Vue3ChartJs).toBe('object');
  });

  it('skips registerables, which the chart.js UMD bundle already includes', () => {
    // the guard in Vue3ChartJs.vue depends on this being undefined under UMD
    expect(g.Chart.registerables).toBeUndefined();
    expect(g.Chart.Chart).toBe(g.Chart);
  });

  it('renders a chart through the global builds', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const app = g.Vue.createApp({
      components: { Vue3ChartJs: g.Vue3ChartJs },
      template: '<vue3-chart-js ref="chart" v-bind="chartProps" />',
      data: () => ({ chartProps: doughnut })
    });

    const vm = app.mount(el);
    const chartComponent = vm.$refs.chart;

    expect(el.querySelector('canvas')).toBeTruthy();
    expect(chartComponent.chartJSState.chart).toBeTruthy();
    // controllers are auto-registered by the chart.js UMD bundle
    expect(chartComponent.chartJSState.chart.config.type).toEqual('doughnut');

    app.unmount();
    expect(chartComponent.chartJSState.chart).toBeNull();
  });

  it('installs as a Vue plugin', () => {
    const app = g.Vue.createApp({ template: '<div />' });
    app.use(g.Vue3ChartJs);
    expect(app._context.components).toHaveProperty('Vue3ChartJs');
  });
});
