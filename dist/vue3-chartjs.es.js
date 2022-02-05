var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { defineComponent, ref, onMounted, h } from "vue";
import { registerables, Chart } from "chart.js";
const chartJsEventNames = [
  "install",
  "start",
  "stop",
  "beforeInit",
  "afterInit",
  "beforeUpdate",
  "afterUpdate",
  "beforeElementsUpdate",
  "reset",
  "beforeDatasetsUpdate",
  "afterDatasetsUpdate",
  "beforeDatasetUpdate",
  "afterDatasetUpdate",
  "beforeLayout",
  "afterLayout",
  "afterLayout",
  "beforeRender",
  "afterRender",
  "resize",
  "destroy",
  "uninstall",
  "afterTooltipDraw",
  "beforeTooltipDraw"
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
      return __spreadValues(__spreadValues({}, reduced), generateChartJsEventListener(emit, event));
    }, { id: "Vue3ChartJsEventHookPlugin" });
    const chartJSState = {
      chart: null,
      plugins: [
        chartJsEventsPlugin,
        ...props.plugins
      ],
      props: __spreadValues({}, props)
    };
    const destroy = () => {
      if (chartJSState.chart) {
        chartJSState.chart.destroy();
        chartJSState.chart = null;
      }
    };
    const update = (animateSpeed = 750) => {
      chartJSState.chart.data = __spreadValues(__spreadValues({}, chartJSState.chart.data), chartJSState.props.data);
      chartJSState.chart.options = __spreadValues(__spreadValues({}, chartJSState.chart.options), chartJSState.props.options);
      chartJSState.chart.update(animateSpeed);
    };
    const resize = () => chartJSState.chart && chartJSState.chart.resize();
    const render = () => {
      if (chartJSState.chart) {
        return chartJSState.chart.update();
      }
      return chartJSState.chart = new Chart(chartRef.value.getContext("2d"), {
        type: chartJSState.props.type,
        data: chartJSState.props.data,
        options: chartJSState.props.options,
        plugins: chartJSState.plugins
      });
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
