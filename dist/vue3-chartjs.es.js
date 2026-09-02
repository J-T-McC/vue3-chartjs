import { defineComponent as y, ref as p, watch as P, nextTick as E, onMounted as T, onBeforeUnmount as _, openBlock as k, createElementBlock as J } from "vue";
import { registerables as g, Chart as c } from "chart.js";
const D = [
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
function U(r, t) {
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
function C(r, t) {
  return {
    [t.type]: () => (t._defaultPrevented = !1, r(t.type, t), !t.isDefaultPrevented())
  };
}
const x = ["height", "width"], s = /* @__PURE__ */ y({
  __name: "Vue3ChartJs",
  props: {
    type: {},
    height: {},
    width: {},
    data: {},
    options: { default: () => ({}) },
    plugins: { default: () => [] }
  },
  emits: D,
  setup(r, { expose: t, emit: n }) {
    g !== void 0 && c.register(...g);
    const a = r, m = n, o = p(null), d = p(0), e = {
      chart: null,
      plugins: [
        D.reduce((i, h) => {
          const w = U(h, o);
          return { ...i, ...C(m, w) };
        }, { id: "Vue3ChartJsEventHookPlugin" }),
        ...a.plugins ?? []
      ],
      // reference props directly: spreading would snapshot them at setup()
      // and update()/render() would keep reapplying the mount-time values
      props: a
    }, f = () => {
      e.chart && (e.chart.destroy(), e.chart = null);
    }, b = (i = "default") => {
      e.chart && (e.chart.data = e.props.data, e.chart.options = { ...e.props.options }, e.chart.update(i));
    }, v = () => {
      e.chart && e.chart.resize();
    }, l = () => {
      if (e.chart)
        return e.chart.update();
      e.chart = new c(o.value.getContext("2d"), {
        type: e.props.type,
        data: e.props.data,
        options: { ...e.props.options },
        plugins: e.plugins
      });
    };
    t({
      chartJSState: e,
      render: l,
      destroy: f,
      update: b,
      resize: v
    });
    let u;
    return P(
      () => [a.type, a.height, a.width],
      () => {
        clearTimeout(u), u = setTimeout(() => {
          f(), d.value += 1, E(l);
        }, 0);
      }
    ), T(() => l()), _(() => {
      clearTimeout(u), f();
    }), (i, h) => (k(), J("canvas", {
      key: d.value,
      ref_key: "chartRef",
      ref: o,
      height: r.height,
      width: r.width
    }, null, 8, x));
  }
});
s.registerGlobalPlugins = (r) => {
  c.register(...r);
};
s.install = (r, t = {}) => {
  var n;
  r.component(s.name ?? "Vue3ChartJs", s), (n = t == null ? void 0 : t.plugins) != null && n.length && s.registerGlobalPlugins(t.plugins);
};
export {
  s as default
};
