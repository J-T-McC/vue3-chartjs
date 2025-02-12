<script lang="ts" setup>
/* c8 ignore next */
import { ref, onMounted, VNodeRef } from 'vue';
import { chartJsEventNames, generateEventObject, generateChartJsEventListener } from './includes';
import { Chart, registerables, Plugin } from 'chart.js';
import {
  ChartType,
  ChartData,
  ChartOptions,
} from 'chart.js/dist/types';

type UpdateMode = 'resize' | 'reset' | 'default' | 'none' | 'hide' | 'show' | 'active';

/* c8 ignore next */
// registerables is undefined when using UMD
// using chart.js via UMD already includes registerables
if (registerables !== undefined) {
  Chart.register(...registerables);
}

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

// generate chart.js plugin to emit lib events
const chartJsEventsPlugin = chartJsEventNames.reduce((reduced, eventType) => {
  const event = generateEventObject(eventType, chartRef);
  return { ...reduced, ...generateChartJsEventListener(emit, event) };
}, { id: 'Vue3ChartJsEventHookPlugin' } as Plugin);

const chartJSState = {
  chart: null as Chart | null,
  plugins: [
    chartJsEventsPlugin,
    ...(props.plugins ?? [])
  ],
  props: { ...props }
};

const destroy = () => {
  if (chartJSState.chart) {
    chartJSState.chart.destroy();
    chartJSState.chart = null;
  }
};

const update = (mode: UpdateMode = 'default') => {
  if (chartJSState.chart) {
    chartJSState.chart.data = { ...chartJSState.chart.data, ...chartJSState.props.data };
    chartJSState.chart.options = { ...chartJSState.chart.options, ...chartJSState.props.options };
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
    options: chartJSState.props.options,
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

onMounted(() => render());
</script>

<template>
  <canvas ref="chartRef" :height="height" :width="width"></canvas>
</template>