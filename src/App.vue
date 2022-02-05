<template>
  <div style="width: 100%;height:20%;display: block;">
    <vue3-chart-js v-bind="{...barChart}" @after-update="afterUpdate"/>
  </div>
  <div style="display: block;">
    <vue3-chart-js ref="chartRef" v-bind="{...localDoughnutChartOptions}" @after-render="afterRender"/>
  </div>
  <button type="submit" @click="updateChart">Update Doughnut Data</button>
  <button type="submit" @click="exportChart">Export Chart as PNG</button>
</template>

<script setup>

import { ref } from 'vue'
import Vue3ChartJs from '../'

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
    maintainAspectRatio: false,
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            mode: 'xy',
          },
          pinch: {
            enabled: true,
            mode: 'xy',
          }
        }
      }
    }
  }
}

const doughnutChart = {
  id: 'doughnut',
  type: 'doughnut',
  height: 800,
  width: 800,
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
    responsive: false,
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

const afterRender = (e) => {
  console.log('afterRender', e)
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

</script>
