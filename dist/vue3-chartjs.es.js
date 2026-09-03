import { defineComponent as L, ref as E, watch as o, onMounted as R, onBeforeUnmount as z, openBlock as O, createElementBlock as V, nextTick as G } from "vue";
import { registerables as P, Chart as m } from "chart.js";
const U = [
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
function I(a, t) {
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
function S(a, t) {
  return {
    [t.type]: () => (t._defaultPrevented = !1, a(t.type, t), !t.isDefaultPrevented())
  };
}
const W = ["height", "width"], n = /* @__PURE__ */ L({
  __name: "Vue3ChartJs",
  props: {
    type: {},
    height: {},
    width: {},
    data: {},
    options: { default: () => ({}) },
    plugins: { default: () => [] },
    autoUpdate: { type: Boolean, default: !0 }
  },
  emits: U,
  setup(a, { expose: t, emit: i }) {
    P !== void 0 && m.register(...P);
    const r = a, _ = i, u = E(null), D = E(0), e = {
      chart: null,
      plugins: [
        U.reduce((s, T) => {
          const x = I(T, u);
          return { ...s, ...S(_, x) };
        }, { id: "Vue3ChartJsEventHookPlugin" }),
        ...r.plugins ?? []
      ],
      // reference props directly: spreading would snapshot them at setup()
      // and update()/render() would keep reapplying the mount-time values
      props: r
    }, l = () => {
      e.chart && (e.chart.destroy(), e.chart = null);
    }, b = () => {
      e.chart && (e.chart.data = e.props.data);
    }, v = () => {
      e.chart && (e.chart.options = { ...e.props.options });
    }, k = (s = "default") => {
      e.chart && (b(), v(), e.chart.update(s));
    }, J = () => {
      e.chart && e.chart.resize();
    }, c = () => {
      if (e.chart)
        return e.chart.update();
      e.chart = new m(u.value.getContext("2d"), {
        type: e.props.type,
        data: e.props.data,
        options: { ...e.props.options },
        plugins: e.plugins
      });
    };
    t({
      chartJSState: e,
      render: c,
      destroy: l,
      update: k,
      resize: J
    });
    let f, d;
    const C = () => {
      clearTimeout(f), f = setTimeout(() => {
        l(), D.value += 1, G(c);
      }, 0);
    };
    let p = !1, h = !1;
    const y = () => {
      clearTimeout(d), d = setTimeout(() => {
        e.chart && (p && b(), h && v(), p = !1, h = !1, e.chart.update());
      }, 0);
    };
    let g = [];
    const B = () => {
      g = [
        o(() => [r.type, r.height, r.width], C),
        o(() => r.data, () => {
          p = !0, y();
        }, { deep: !0 }),
        o(() => r.options, () => {
          h = !0, y();
        }, { deep: !0 })
      ];
    }, w = () => {
      g.forEach((s) => s()), g = [], clearTimeout(f), clearTimeout(d);
    };
    return o(
      () => r.autoUpdate,
      (s) => s ? B() : w(),
      { immediate: !0 }
    ), R(() => c()), z(() => {
      w(), l();
    }), (s, T) => (O(), V("canvas", {
      key: D.value,
      ref_key: "chartRef",
      ref: u,
      height: a.height,
      width: a.width
    }, null, 8, W));
  }
});
n.registerGlobalPlugins = (a) => {
  m.register(...a);
};
n.install = (a, t = {}) => {
  var i;
  a.component(n.name ?? "Vue3ChartJs", n), (i = t == null ? void 0 : t.plugins) != null && i.length && n.registerGlobalPlugins(t.plugins);
};
export {
  n as default
};
