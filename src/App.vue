<template>
  <div style="height:600px;width: 600px;">
    <vue3-chart-js
        v-bind="{...barChart}"
        @before-init="beforeInit"
    ></vue3-chart-js>

    <vue3-chart-js
        ref="chartRef"
        v-bind="{...localDoughnutChartOptions}"
        @before-init="beforeInit"
        @before-update="beforeUpdate"
    ></vue3-chart-js>

    <button type="submit" @click="updateChart">Update Doughnut Data</button>

  </div>
</template>

<script>

import {ref} from 'vue'
import Vue3ChartJs from '../lib/main';

import {barChart, doughnutChart} from './charts.js'

export default {
  name: 'App',
  components: {
    Vue3ChartJs,
  },
  setup() {

    const beforeInit = (chartRef) => {
      console.log('chart is before init', chartRef)
    }

    const beforeUpdate = (chartRef) => {
      console.log("beforeUpdate", chartRef)
    }

    let localDoughnutChartOptions = {...doughnutChart}

    const chartRef = ref(null)

    const updateChart = () => {

      localDoughnutChartOptions.data.datasets = [
        {
          backgroundColor: [
            '#' + Math.floor(Math.random() * 16777215).toString(16),
            '#' + Math.floor(Math.random() * 16777215).toString(16),
            '#' + Math.floor(Math.random() * 16777215).toString(16),
            '#' + Math.floor(Math.random() * 16777215).toString(16),
          ],
          data: [
            Math.floor(Math.random() * 500),
            Math.floor(Math.random() * 500),
            Math.floor(Math.random() * 500),
            Math.floor(Math.random() * 500),
          ]
        }
      ]

      chartRef.value.update();
    }

    return {
      beforeInit,
      beforeUpdate,
      updateChart,
      barChart,
      localDoughnutChartOptions,
      chartRef
    }
  },
}
</script>
