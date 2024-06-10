import { defineComponent, ref, onMounted, h } from "vue";
import { registerables, Chart } from "chart.js";
const chartJsEventNames = [
  "install",
  "uninstall",
  "beforeInit",
  "resize",
  "afterInit",
  "start",
  "stop",
  "beforeUpdate",
  "beforeLayout",
  "beforeDataLimits",
  "afterDataLimits",
  "beforeBuildTicks",
  "afterBuildTicks",
  "afterLayout",
  "beforeElementsUpdate",
  "beforeDatasetsUpdate",
  "beforeDatasetUpdate",
  "afterDatasetUpdate",
  "afterDatasetsUpdate",
  "afterUpdate",
  "beforeRender",
  "beforeDraw",
  "beforeDatasetsDraw",
  "beforeDatasetDraw",
  "afterDatasetDraw",
  "afterDatasetsDraw",
  "beforeTooltipDraw",
  "afterTooltipDraw",
  "afterDraw",
  "afterRender",
  "resize",
  "reset",
  "beforeDestroy",
  "afterDestroy",
  "beforeEvent",
  "afterEvent"
];
function generateEventObject(type, chartRef = null) {
  return {
    type,
    chartRef,
    preventDefault() {
      this._defaultPrevented = true;
    },
    isDefaultPrevented() {
      return !this._defaultPrevented;
    },
    _defaultPrevented: false
  };
}
function generateChartJsEventListener(emit, event) {
  return {
    [event.type]: () => {
      emit(event.type, event);
      return event.isDefaultPrevented();
    }
  };
}
if (registerables !== void 0) {
  Chart.register(...registerables);
}
const Vue3ChartJs = defineComponent({
  name: "Vue3ChartJs",
  props: {
    type: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      required: false,
      default: null
    },
    width: {
      type: Number,
      required: false,
      default: null
    },
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    plugins: {
      type: Array,
      default: () => []
    }
  },
  emits: chartJsEventNames,
  setup(props, { emit }) {
    const chartRef = ref(null);
    const chartJsEventsPlugin = chartJsEventNames.reduce((reduced, eventType) => {
      const event = generateEventObject(eventType, chartRef);
      return { ...reduced, ...generateChartJsEventListener(emit, event) };
    }, { id: "Vue3ChartJsEventHookPlugin" });
    const chartJSState = {
      chart: null,
      plugins: [
        chartJsEventsPlugin,
        ...props.plugins
      ],
      props: { ...props }
    };
    const destroy = () => {
      if (chartJSState.chart) {
        chartJSState.chart.destroy();
        chartJSState.chart = null;
      }
    };
    const update = (animateSpeed = 750) => {
      chartJSState.chart.data = { ...chartJSState.chart.data, ...chartJSState.props.data };
      chartJSState.chart.options = { ...chartJSState.chart.options, ...chartJSState.props.options };
      chartJSState.chart.update(animateSpeed);
    };
    const resize = () => chartJSState.chart && chartJSState.chart.resize();
    const render = () => {
      if (chartJSState.chart) {
        return chartJSState.chart.update();
      }
      return chartJSState.chart = new Chart(
        chartRef.value.getContext("2d"),
        {
          type: chartJSState.props.type,
          data: chartJSState.props.data,
          options: chartJSState.props.options,
          plugins: chartJSState.plugins
        }
      );
    };
    onMounted(() => render());
    return {
      chartJSState,
      chartRef,
      render,
      resize,
      update,
      destroy
    };
  },
  render(props) {
    return h("canvas", {
      ref: "chartRef",
      height: props.height,
      width: props.width
    });
  }
});
const _sfc_main = Vue3ChartJs;
_sfc_main.registerGlobalPlugins = (plugins) => {
  Chart.register(...plugins);
};
_sfc_main.install = (app, options = {}) => {
  var _a;
  app.component(_sfc_main.name, _sfc_main);
  if ((_a = options == null ? void 0 : options.plugins) == null ? void 0 : _a.length) {
    _sfc_main.registerGlobalPlugins(options.plugins);
  }
};
export { _sfc_main as default };
