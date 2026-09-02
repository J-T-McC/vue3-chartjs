<script lang="ts" setup>
// imports and type aliases are erased at compile time, and the UMD guard below
// has no reachable false branch under jest, so v8 has nothing to attribute here
/* c8 ignore start */
import { ref, watch, nextTick, onMounted, onBeforeUnmount, VNodeRef } from 'vue';
import { chartJsEventNames, generateEventObject, generateChartJsEventListener } from './includes';
import type { UpdateMode } from './includes';
import { Chart, registerables, Plugin, ChartType, ChartData, ChartOptions } from 'chart.js';

// registerables is undefined when using UMD
// using chart.js via UMD already includes registerables
if (registerables !== undefined) {
  Chart.register(...registerables);
}
/* c8 ignore stop */

const props = withDefaults(defineProps<{
  type: ChartType;
  height?: number;
  width?: number;
  data: ChartData;
  options?: ChartOptions;
  plugins?: Plugin[];
}>(), {
  options: () => ({}),
  plugins: () => ([]),
});

const emit = defineEmits(chartJsEventNames);

const chartRef = ref<VNodeRef | null>(null);

// bumping this mounts a fresh canvas. chart.js restores a canvas to its
// original dimensions when the chart is destroyed, and Vue will not re-apply
// attributes it believes unchanged, so reusing the element keeps the old size.
const canvasKey = ref(0);

// generate chart.js plugin to emit lib events
const chartJsEventsPlugin = chartJsEventNames.reduce((reduced, eventType) => {
  const event = generateEventObject(eventType, chartRef);
  return { ...reduced, ...generateChartJsEventListener(emit, event) };
}, { id: 'Vue3ChartJsEventHookPlugin' } as Plugin);

// annotated explicitly so the generated .d.ts references chart.js's public type
// aliases instead of expanding them into internal (unexported) paths. Erased at
// compile time; ignored so v8 does not misattribute a branch onto these lines.
/* c8 ignore start */
interface ChartJSState {
  chart: Chart | null;
  plugins: Plugin[];
  props: Readonly<{
    type: ChartType;
    height?: number;
    width?: number;
    data: ChartData;
    options: ChartOptions;
    plugins: Plugin[];
  }>;
}
/* c8 ignore stop */

const chartJSState: ChartJSState = {
  chart: null,
  plugins: [
    chartJsEventsPlugin,
    ...(props.plugins ?? [])
  ],
  // reference props directly: spreading would snapshot them at setup()
  // and update()/render() would keep reapplying the mount-time values
  props
};

const destroy = () => {
  if (chartJSState.chart) {
    chartJSState.chart.destroy();
    chartJSState.chart = null;
  }
};

const update = (mode: UpdateMode = 'default') => {
  if (chartJSState.chart) {
    chartJSState.chart.data = chartJSState.props.data;
    // shallow copy so chart.js resolves into an object this component owns,
    // rather than writing its derived options back onto the caller's
    chartJSState.chart.options = { ...chartJSState.props.options };
    chartJSState.chart.update(mode);
  }
};

const resize = () => {
  if (chartJSState.chart) {
    chartJSState.chart.resize();
  }
};

const render = () => {
  if (chartJSState.chart) {
    return chartJSState.chart.update();
  }

  chartJSState.chart = new Chart(chartRef.value.getContext('2d') as CanvasRenderingContext2D, {
    type: chartJSState.props.type,
    data: chartJSState.props.data,
    options: { ...chartJSState.props.options },
    plugins: chartJSState.plugins
  });
};

defineExpose({
  chartJSState,
  render,
  destroy,
  update,
  resize,
});

// type, height and width are fixed when the chart is constructed, so a change
// needs a new instance. They are safe to watch: chart.js never writes to them,
// unlike data, whose datasets it decorates with resolved colours.
let rebuildTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => [props.type, props.height, props.width],
  () => {
    // coalesce a burst of changes into a single rebuild
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(() => {
      destroy();
      canvasKey.value += 1;
      nextTick(render);
    }, 0);
  }
);

onMounted(() => render());

onBeforeUnmount(() => {
  clearTimeout(rebuildTimer);
  destroy();
});
</script>

<template>
  <canvas :key="canvasKey" ref="chartRef" :height="height" :width="width"></canvas>
</template>