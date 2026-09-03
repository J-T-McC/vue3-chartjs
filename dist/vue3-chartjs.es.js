import { defineComponent as U, ref as b, watch as d, onMounted as _, onBeforeUnmount as k, openBlock as J, createElementBlock as C, nextTick as x } from "vue";
import { registerables as v, Chart as p } from "chart.js";
const w = [
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
function B(r, t) {
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
function L(r, t) {
  return {
    [t.type]: () => (t._defaultPrevented = !1, r(t.type, t), !t.isDefaultPrevented())
  };
}
const R = ["height", "width"], s = /* @__PURE__ */ U({
  __name: "Vue3ChartJs",
  props: {
    type: {},
    height: {},
    width: {},
    data: {},
    options: { default: () => ({}) },
    plugins: { default: () => [] }
  },
  emits: w,
  setup(r, { expose: t, emit: n }) {
    v !== void 0 && p.register(...v);
    const a = r, y = n, i = b(null), h = b(0), e = {
      chart: null,
      plugins: [
        w.reduce((o, D) => {
          const E = B(D, i);
          return { ...o, ...L(y, E) };
        }, { id: "Vue3ChartJsEventHookPlugin" }),
        ...a.plugins ?? []
      ],
      // reference props directly: spreading would snapshot them at setup()
      // and update()/render() would keep reapplying the mount-time values
      props: a
    }, u = () => {
      e.chart && (e.chart.destroy(), e.chart = null);
    }, g = (o = "default") => {
      e.chart && (e.chart.data = e.props.data, e.chart.options = { ...e.props.options }, e.chart.update(o));
    }, T = () => {
      e.chart && e.chart.resize();
    }, l = () => {
      if (e.chart)
        return e.chart.update();
      e.chart = new p(i.value.getContext("2d"), {
        type: e.props.type,
        data: e.props.data,
        options: { ...e.props.options },
        plugins: e.plugins
      });
    };
    t({
      chartJSState: e,
      render: l,
      destroy: u,
      update: g,
      resize: T
    });
    let f, c;
    const P = () => {
      clearTimeout(f), f = setTimeout(() => {
        u(), h.value += 1, x(l);
      }, 0);
    }, m = () => {
      clearTimeout(c), c = setTimeout(() => g(), 0);
    };
    return d(() => [a.type, a.height, a.width], P), d(() => a.data, m, { deep: !0 }), d(() => a.options, m, { deep: !0 }), _(() => l()), k(() => {
      clearTimeout(f), clearTimeout(c), u();
    }), (o, D) => (J(), C("canvas", {
      key: h.value,
      ref_key: "chartRef",
      ref: i,
      height: r.height,
      width: r.width
    }, null, 8, R));
  }
});
s.registerGlobalPlugins = (r) => {
  p.register(...r);
};
s.install = (r, t = {}) => {
  var n;
  r.component(s.name ?? "Vue3ChartJs", s), (n = t == null ? void 0 : t.plugins) != null && n.length && s.registerGlobalPlugins(t.plugins);
};
export {
  s as default
};
