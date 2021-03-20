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
        @after-update="afterUpdate"
    ></vue3-chart-js>

    <button type="submit" @click="updateChart">Update Doughnut Data</button>
    <button type="submit" @click="exportChart">Export Chart as PNG</button>

  </div>
</template>

<script>

import { ref } from 'vue'
import Vue3ChartJs from '../lib/main'

import { barChart, doughnutChart } from './charts.js'

export default {
  name: 'App',
  components: {
    Vue3ChartJs,
  },
  setup () {

    const beforeInit = (e) => {
      console.log('chart is before init', e)
    }

    const beforeUpdate = (e) => {
      console.log('beforeUpdate', e)
    }

    const afterUpdate = (e) => {
      console.log('afterUpdate', e)
    }

    const chartRef = ref(null)

    const localDoughnutChartOptions = { ...doughnutChart }

    let counter = 1

    const updateChart = () => {
      localDoughnutChartOptions.options.title = {
        display: true,
        text: 'Loaded: ' + (counter++)
      }

      localDoughnutChartOptions.data.labels.reverse()
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

      chartRef.value.update(750)
    }

    const exportChart = () => {
      let a = document.createElement('a')
      a.href = chartRef.value.chartJSState.chart.toBase64Image()
      a.download = 'image-export.png'
      a.click()
      a = null
    }

    return {
      barChart,
      localDoughnutChartOptions,
      updateChart,
      exportChart,
      beforeInit,
      beforeUpdate,
      afterUpdate,
      chartRef
    }
  },
}
</script>
