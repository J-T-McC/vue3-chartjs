import { defineComponent as m, ref as v, onMounted as w, createElementBlock as y, openBlock as E } from "vue";
import { registerables as p, Chart as i } from "chart.js";
const c = [
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
function P(r, t) {
  return {
    type: r,
    chartRef: t,
    preventDefault() {
      this._defaultPrevented = !0;
    },
    isDefaultPrevented() {
      return !this._defaultPrevented;
    },
    _defaultPrevented: !1
  };
}
function _(r, t) {
  return {
    [t.type]: () => (r(t.type, t), t.isDefaultPrevented())
  };
}
const J = ["height", "width"], s = /* @__PURE__ */ m({
  __name: "Vue3ChartJs",
  props: {
    type: {},
    height: {},
    width: {},
    data: {},
    options: { default: () => ({}) },
    plugins: { default: () => [] }
  },
  emits: c,
  setup(r, { expose: t, emit: n }) {
    p !== void 0 && i.register(...p);
    const f = r, d = n, o = v(null), e = {
      chart: null,
      plugins: [
        c.reduce((a, u) => {
          const b = P(u, o);
          return { ...a, ..._(d, b) };
        }, { id: "Vue3ChartJsEventHookPlugin" }),
        ...f.plugins ?? []
      ],
      props: { ...f }
    }, h = () => {
      e.chart && (e.chart.destroy(), e.chart = null);
    }, g = (a = "default") => {
      e.chart && (e.chart.data = { ...e.chart.data, ...e.props.data }, e.chart.options = { ...e.chart.options, ...e.props.options }, e.chart.update(a));
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
      destroy: h,
      update: g,
      resize: D
    }), w(() => l()), (a, u) => (E(), y("canvas", {
      ref_key: "chartRef",
      ref: o,
      height: a.height,
      width: a.width
    }, null, 8, J));
  }
});
s.registerGlobalPlugins = (r) => {
  i.register(...r);
};
s.install = (r, t = {}) => {
  var n;
  r.component(s.name ?? "Vue3ChartJs", s), (n = t == null ? void 0 : t.plugins) != null && n.length && s.registerGlobalPlugins(t.plugins);
};
export {
  s as default
};
