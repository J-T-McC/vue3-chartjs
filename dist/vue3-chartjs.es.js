import { defineComponent, ref, onMounted, openBlock, createElementBlock } from "vue";
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
function generateEventObject(type, chartRef) {
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
      return event._defaultPrevented;
    }
  };
}
const _hoisted_1 = ["height", "width"];
const _sfc_main = defineComponent({
  __name: "Vue3ChartJs",
  props: {
    type: {},
    height: {},
    width: {},
    data: {},
    options: {},
    plugins: {}
  },
  emits: chartJsEventNames,
  setup(__props, { emit: __emit }) {
    var _a;
    if (registerables !== void 0) {
      Chart.register(...registerables);
    }
    const props = __props;
    const emit = __emit;
    const chartRef = ref(null);
    const chartJsEventsPlugin = chartJsEventNames.reduce((reduced, eventType) => {
      const event = generateEventObject(eventType, chartRef);
      return { ...reduced, ...generateChartJsEventListener(emit, event) };
    }, { id: "Vue3ChartJsEventHookPlugin" });
    const chartJSState = {
      chart: null,
      plugins: [
        chartJsEventsPlugin,
        ...(_a = props.plugins) != null ? _a : []
      ],
      props: { ...props }
    };
    const render = () => {
      console.log(chartJSState.chart, {
        type: chartJSState.props.type,
        data: chartJSState.props.data,
        options: chartJSState.props.options,
        plugins: chartJSState.plugins
      });
      if (chartJSState.chart) {
        return chartJSState.chart.update();
      }
      console.log(chartRef.value.getContext("2d"));
      chartJSState.chart = new Chart(chartRef.value.getContext("2d"), {
        type: chartJSState.props.type,
        data: chartJSState.props.data,
        options: chartJSState.props.options,
        plugins: chartJSState.plugins
      });
      console.log("chart is after init", chartJSState.chart);
    };
    onMounted(() => {
      render();
      setTimeout(() => {
        var _a2;
        console.log("update");
        (_a2 = chartJSState.chart) == null ? void 0 : _a2.update();
      }, 1e3);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("canvas", {
        ref_key: "chartRef",
        ref: chartRef,
        height: _ctx.height,
        width: _ctx.width
      }, null, 8, _hoisted_1);
    };
  }
});
_sfc_main.registerGlobalPlugins = (plugins) => {
  Chart.register(...plugins);
};
_sfc_main.install = (app, options = {}) => {
  var _a, _b;
  app.component((_a = _sfc_main.name) != null ? _a : "Vue3ChartJs", _sfc_main);
  if ((_b = options == null ? void 0 : options.plugins) == null ? void 0 : _b.length) {
    _sfc_main.registerGlobalPlugins(options.plugins);
  }
};
export { _sfc_main as default };
