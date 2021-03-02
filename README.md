# Vue3 ChartJS Wrapper

[![Coverage Status](https://coveralls.io/repos/github/J-T-McC/vue3-chartjs/badge.svg?branch=main)](https://coveralls.io/github/J-T-McC/vue3-chartjs?branch=main)
[![Build Status](https://travis-ci.org/J-T-McC/vue3-chartjs.svg?branch=main)](https://travis-ci.org/J-T-McC/vue3-chartjs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/J-T-McC/vue3-chartjs/pulls)

Basic [ChartJS](https://www.chartjs.org/) wrapper for [Vue3](https://v3.vuejs.org/)

## Installation

```shell script
yarn add @j-t-mcc/vue3-chartjs

npm install @j-t-mcc/vue3-chartjs
```

## Configuration

Arguments are passed as-is to the instance of ChartJS. View [Examples](https://www.chartjs.org/docs/latest/getting-started/usage.html).

```js
  props: {
     type: {
       type: String,
       required: true
     },
     data: {
       type: Object,
       required: true
     },
     options: {
       type: Object,
       default () {
         return {}
       },
     },
     plugins: {
       type: Array,
       default () {
         return []
       }
     }
   }
```

## Events

A default event hook plugin is injected into each chart object and emits the following: [ChartJS events](https://www.chartjs.org/docs/latest/developers/plugins.html#plugin-core-api)

Event listeners are converted to camelcase in Vue3. Events marked as "cancellable" can be "canceled" by the calling preventDefault method on the event parameter.

## Examples

### Basic Chart
```vue
<template>
  <div style="height:600px;width: 600px;">
    <vue3-chart-js
        :id="doughnutChart.id"
        :type="doughnutChart.type"
        :data="doughnutChart.data"
        @before-render="beforeRenderLogic"
    ></vue3-chart-js>
  </div>
</template>

<script>
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

export default {
  name: 'App',
  components: {
    Vue3ChartJs,
  },
  setup () {
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
      }
    }
  
    const beforeRenderLogic = (event) => {
      //...
      //if(a === b) {
      //  event.preventDefault()
      //}   
    }    

    return {
      doughnutChart,
      beforeRenderLogic
    }
  },
}
</script>

```

### Updating chart

[Updating Charts](https://www.chartjs.org/docs/latest/developers/updates.html)

```vue
<template>
  <div style="height:600px;width: 600px;display: flex;flex-direction:column;">
    <vue3-chart-js
        :id="doughnutChart.id"
        ref="chartRef"
        :type="doughnutChart.type"
        :data="doughnutChart.data"
    ></vue3-chart-js>

    <button @click="updateChart">Update Chart</button>
  </div>
</template>

<script>
import { ref } from 'vue'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

export default {
  name: 'App',
  components: {
    Vue3ChartJs,
  },
  setup () {
    const chartRef = ref(null)

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
      }
    }

    const updateChart = () => {
      doughnutChart.data.labels = ['Cats', 'Dogs', 'Hamsters', 'Dragons']
      doughnutChart.data.datasets = [
        {
          backgroundColor: [
            '#333333',
            '#E46651',
            '#00D8FF',
            '#DD1B16'
          ],
          data: [100, 20, 800, 20]
        }
      ]

      chartRef.value.update()
    }

    return {
      doughnutChart,
      updateChart,
      chartRef
    }
  },
}
</script>


```

## License

MIT