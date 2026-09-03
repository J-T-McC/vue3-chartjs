import { defineComponent as C, ref as w, watch as h, onMounted as x, onBeforeUnmount as B, openBlock as L, createElementBlock as R, nextTick as z } from "vue";
import { registerables as T, Chart as g } from "chart.js";
const P = [
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
function O(a, t) {
  return {
    type: a,
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
function V(a, t) {
  return {
    [t.type]: () => (t._defaultPrevented = !1, a(t.type, t), !t.isDefaultPrevented())
  };
}
const G = ["height", "width"], s = /* @__PURE__ */ C({
  __name: "Vue3ChartJs",
  props: {
    type: {},
    height: {},
    width: {},
    data: {},
    options: { default: () => ({}) },
    plugins: { default: () => [] }
  },
  emits: P,
  setup(a, { expose: t, emit: n }) {
    T !== void 0 && g.register(...T);
    const r = a, E = n, o = w(null), m = w(0), e = {
      chart: null,
      plugins: [
        P.reduce((i, y) => {
          const J = O(y, o);
          return { ...i, ...V(E, J) };
        }, { id: "Vue3ChartJsEventHookPlugin" }),
        ...r.plugins ?? []
      ],
      // reference props directly: spreading would snapshot them at setup()
      // and update()/render() would keep reapplying the mount-time values
      props: r
    }, l = () => {
      e.chart && (e.chart.destroy(), e.chart = null);
    }, D = () => {
      e.chart && (e.chart.data = e.props.data);
    }, b = () => {
      e.chart && (e.chart.options = { ...e.props.options });
    }, U = (i = "default") => {
      e.chart && (D(), b(), e.chart.update(i));
    }, _ = () => {
      e.chart && e.chart.resize();
    }, u = () => {
      if (e.chart)
        return e.chart.update();
      e.chart = new g(o.value.getContext("2d"), {
        type: e.props.type,
        data: e.props.data,
        options: { ...e.props.options },
        plugins: e.plugins
      });
    };
    t({
      chartJSState: e,
      render: u,
      destroy: l,
      update: U,
      resize: _
    });
    let f, c;
    const k = () => {
      clearTimeout(f), f = setTimeout(() => {
        l(), m.value += 1, z(u);
      }, 0);
    };
    let d = !1, p = !1;
    const v = () => {
      clearTimeout(c), c = setTimeout(() => {
        e.chart && (d && D(), p && b(), d = !1, p = !1, e.chart.update());
      }, 0);
    };
    return h(() => [r.type, r.height, r.width], k), h(() => r.data, () => {
      d = !0, v();
    }, { deep: !0 }), h(() => r.options, () => {
      p = !0, v();
    }, { deep: !0 }), x(() => u()), B(() => {
      clearTimeout(f), clearTimeout(c), l();
    }), (i, y) => (L(), R("canvas", {
      key: m.value,
      ref_key: "chartRef",
      ref: o,
      height: a.height,
      width: a.width
    }, null, 8, G));
  }
});
s.registerGlobalPlugins = (a) => {
  g.register(...a);
};
s.install = (a, t = {}) => {
  var n;
  a.component(s.name ?? "Vue3ChartJs", s), (n = t == null ? void 0 : t.plugins) != null && n.length && s.registerGlobalPlugins(t.plugins);
};
export {
  s as default
};
