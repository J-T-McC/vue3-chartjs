<template>
  <div style="height:600px;width: 600px;">

    <div style="width: 500px">
      <vue3-chart-js v-bind="{...barChart}"  @after-update="afterUpdate"/>
    </div>
    <div style="width: 500px">
      <vue3-chart-js ref="chartRef" v-bind="{...localDoughnutChartOptions}" @after-update="afterUpdate"/>
    </div>
    <button type="submit" @click="updateChart">Update Doughnut Data</button>
    <button type="submit" @click="exportChart">Export Chart as PNG</button>

  </div>
</template>

<script>

import { ref } from 'vue'
import Vue3ChartJs from '../lib/main'

export default {
  name: 'App',
  components: {
    Vue3ChartJs
  },
  setup () {
    const barChart = {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        plugins: {
          zoom: {
            zoom: {
              enabled: true,
              mode: 'xy',
            }
          }
        }
      }
    }

    const doughnutChart = {
      id: 'doughnut',
      type: 'doughnut',
      data: {
        labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
        datasets: [
          {
            backgroundColor: [
              '#41B883',
              '#E46651',
              '#00D8FF',
              '#DD1B16'
            ],
            data: [40, 20, 80, 10]
          }
        ]
      },
      options: {
        cutout: '10%',
        plugins: {}
      }
    }

    const beforeInit = (e) => {
      console.log('chart is before init', e)
    }

    const beforeUpdate = (e) => {
      console.log('beforeUpdate', e)
    }

    const afterUpdate = (e) => {
      console.log('afterUpdate', e)
    }

    const testFunc = () => {
      console.log('test func called')
    }

    const chartRef = ref(null)

    const localDoughnutChartOptions = { ...doughnutChart }

    let counter = 1

    const updateChart = () => {
      localDoughnutChartOptions.options.plugins.title = {
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
      a.href = chartRef.value.chartJSState.chart.toBase64Image('image/png', 1)
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
      testFunc,
      chartRef
    }
  },
}
</script>
