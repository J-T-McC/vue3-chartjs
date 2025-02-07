<script lang="ts" setup>
import { ref, onMounted, defineProps, defineEmits, VNodeRef, nextTick } from 'vue';
import { chartJsEventNames, generateEventObject, generateChartJsEventListener } from './includes';
import { Chart, registerables, Plugin, UpdateModeEnum } from 'chart.js';
import {
  ChartType,
  ChartData,
  ChartOptions,
} from 'chart.js/dist/types';

// registerables is undefined when using UMD
// using chart.js via UMD already includes registerables
if (registerables !== undefined) {
  Chart.register(...registerables);
}

const props = defineProps<{
  type: ChartType;
  height?: number;
  width?: number;
  data: ChartData;
  options?: ChartOptions;
  plugins?: Plugin[];
}>();

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

const update = (mode: UpdateModeEnum = UpdateModeEnum.default) => {
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
  console.log(chartJSState.chart , {
    type: chartJSState.props.type,
    data: chartJSState.props.data,
    options: chartJSState.props.options,
    plugins: chartJSState.plugins
  })

  if (chartJSState.chart) {
    return chartJSState.chart.update();
  }

  console.log(chartRef.value.getContext('2d'))

  chartJSState.chart = new Chart(chartRef.value.getContext('2d') as CanvasRenderingContext2D, {
    type: chartJSState.props.type,
    data: chartJSState.props.data,
    options: chartJSState.props.options,
    plugins: chartJSState.plugins
  });

  console.log('chart is after init', chartJSState.chart)
};

onMounted(() => {
  render();

  setTimeout(() => {
    console.log('update')
    chartJSState.chart?.update();
  }, 1000);
});
</script>

<template>
  <canvas ref="chartRef" :height="height" :width="width"></canvas>
</template>