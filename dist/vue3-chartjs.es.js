import { defineComponent as m, ref as v, onMounted as w, onBeforeUnmount as y, openBlock as E, createElementBlock as P } from "vue";
import { registerables as d, Chart as i } from "chart.js";
const p = [
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
function J(r, t) {
  return {
    type: r,
    chartRef: t,
    preventDefault() {
      this._defaultPrevented = !0;
    },
    isDefaultPrevented() {
      return this._defaultPrevented;
    },
    _defaultPrevented: !1
  };
}
function U(r, t) {
  return {
    [t.type]: () => (r(t.type, t), !t.isDefaultPrevented())
  };
}
const _ = ["height", "width"], a = /* @__PURE__ */ m({
  __name: "Vue3ChartJs",
  props: {
    type: {},
    height: {},
    width: {},
    data: {},
    options: { default: () => ({}) },
    plugins: { default: () => [] }
  },
  emits: p,
  setup(r, { expose: t, emit: s }) {
    d !== void 0 && i.register(...d);
    const f = r, h = s, o = v(null), e = {
      chart: null,
      plugins: [
        p.reduce((n, c) => {
          const b = J(c, o);
          return { ...n, ...U(h, b) };
        }, { id: "Vue3ChartJsEventHookPlugin" }),
        ...f.plugins ?? []
      ],
      // reference props directly: spreading would snapshot them at setup()
      // and update()/render() would keep reapplying the mount-time values
      props: f
    }, u = () => {
      e.chart && (e.chart.destroy(), e.chart = null);
    }, g = (n = "default") => {
      e.chart && (e.chart.data = { ...e.chart.data, ...e.props.data }, e.chart.options = { ...e.chart.options, ...e.props.options }, e.chart.update(n));
    }, D = () => {
      e.chart && e.chart.resize();
    }, l = () => {
      if (e.chart)
        return e.chart.update();
      e.chart = new i(o.value.getContext("2d"), {
        type: e.props.type,
        data: e.props.data,
        options: e.props.options,
        plugins: e.plugins
      });
    };
    return t({
      chartJSState: e,
      render: l,
      destroy: u,
      update: g,
      resize: D
    }), w(() => l()), y(() => u()), (n, c) => (E(), P("canvas", {
      ref_key: "chartRef",
      ref: o,
      height: r.height,
      width: r.width
    }, null, 8, _));
  }
});
a.registerGlobalPlugins = (r) => {
  i.register(...r);
};
a.install = (r, t = {}) => {
  var s;
  r.component(a.name ?? "Vue3ChartJs", a), (s = t == null ? void 0 : t.plugins) != null && s.length && a.registerGlobalPlugins(t.plugins);
};
export {
  a as default
};
