# Vue3 ChartJS Wrapper

[![Coverage Status](https://coveralls.io/repos/github/J-T-McC/vue3-chartjs/badge.svg?branch=main)](https://coveralls.io/github/J-T-McC/vue3-chartjs?branch=main)
[![Build Status](https://travis-ci.com/J-T-McC/vue3-chartjs.svg?branch=main)](https://app.travis-ci.com/github/J-T-McC/vue3-chartjs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/J-T-McC/vue3-chartjs/pulls)
![npm](https://img.shields.io/npm/dt/@j-t-mcc/vue3-chartjs)

Basic [ChartJS 3](https://www.chartjs.org/) wrapper for [Vue3](https://v3.vuejs.org/)

For ChartJS 2, see [v0.3.0](https://github.com/J-T-McC/vue3-chartjs/tree/0.3.0)

## Requirements

- Vue 3
- ChartJS 3

## Installation

```shell script
yarn add chart.js @j-t-mcc/vue3-chartjs

npm install chart.js @j-t-mcc/vue3-chartjs
```

## Configuration

Component props use the same structure as ChartJS arguments and are passed as-is to the instance of ChartJS.

ChartJS charts are responsive by default. If you wish to have a fixed sized chart, you can set the optional `height` and `width` properties, paired with setting responsive to `false` in the `options` property.  

```js
  props: {
    type: {
      type: String, 
      required: true
    },
    height: {
      type: Number,
      required: false,
      default: null
    },
    width: {
      type: Number,
      required: false,
      default: null
    },
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    plugins: {
      type: Array,
      default: () => []
    }
  }
```

## Sandbox Examples

* [Pie Chart](https://codesandbox.io/s/pie-chart-848by?file=/src/App.vue)
* [Doughnut Chart](https://codesandbox.io/s/doughnut-chart-g7il4?file=/src/App.vue)
* [Bar Chart](https://codesandbox.io/s/bar-chart-kog87?file=/src/App.vue)
* [Radar Chart](https://codesandbox.io/s/radar-chart-j2dyp?file=/src/App.vue)
* [Line Chart with Plugins](https://codesandbox.io/s/plugin-example-o4y3q?file=/src/App.vue)
* [Events & Exports](https://codesandbox.io/s/events-and-exports-q5g9k?file=/src/App.vue)

View the [ChartJS Docs](https://www.chartjs.org/docs/latest/samples/bar/vertical.html) for more examples.

## Events

A default event hook plugin is injected into each chart object and emits the following events:
[ChartJS events](https://www.chartjs.org/docs/latest/developers/plugins.html#plugin-core-api)

Event listeners are converted to camelcase in Vue 3. Events marked as "cancellable" in the ChartJS documentation can be "
canceled" by calling the preventDefault method on the event parameter available in your event function.

## Methods

This library only implements a few ChartJS methods for some common interactions and are available by reference:

```javascript
chartRef.value.update(animationSpeed = 750)
chartRef.value.resize()
chartRef.value.destroy()
```

If you require additional access to ChartJS functionality, you can interact directly with the ChartJS object via the
chartJSState attribute by reference:

```javascript
const base64Image = chartRef.value.chartJSState.chart.toBase64Image()
```

See the [ChartJS Docs](https://www.chartjs.org/docs/latest/developers/api.html) for more

## Examples

Below are some basic chart examples to get started.

### Simple Chart

```vue
<template>
  <div style="height:600px;width: 600px; display: flex;flex-direction:column;">
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

Here is an example of updating the data, labels and title in a chart.

See the [ChartJS docs](https://www.chartjs.org/docs/latest/developers/updates.html) for more details on updating charts.

```vue
<template>
  <div style="height:600px;width: 600px;display: flex;flex-direction:column;">
    <vue3-chart-js
        :id="doughnutChart.id"
        ref="chartRef"
        :type="doughnutChart.type"
        :data="doughnutChart.data"
        :options="doughnutChart.options"
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
      },
      options: {
        plugins: {}
      }
    }

    const updateChart = () => {
      doughnutChart.options.plugins.title = {
        text: 'Updated Chart',
        display: true
      }
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

      chartRef.value.update(250)
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

### Exporting Chart as PNG

```vue
<template>
  <div style="height:600px;width: 600px; display: flex;flex-direction:column;">
    <button type="submit" @click="exportChart">Export Chart as PNG</button>
    <vue3-chart-js
        :id="doughnutChart.id"
        ref="chartRef"
        :type="doughnutChart.type"
        :data="doughnutChart.data"
    ></vue3-chart-js>
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

    const exportChart = () => {
      let a = document.createElement('a')
      a.href = chartRef.value.chartJSState.chart.toBase64Image()
      a.download = 'image-export.png'
      a.click()
      a = null
    }

    return {
      chartRef,
      doughnutChart,
      exportChart
    }
  },
}
</script>
```

### Adding a plugin

ChartJS has two different types of plugins: Global & Inline.

Inline plugins can be passed directly to the chart via the plugins array prop and will be available for that chart only.

Global plugins require registration with ChartJS and will be available for all charts. Some plugins must be registered.

Here is an example of adding a global plugin, in this case [`chartjs-plugin-zoom`](https://github.com/chartjs/chartjs-plugin-zoom).

Global plugins can be registered one of two ways:

#### Via Component Install

```javascript
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'

const Vue = createApp(App)

Vue.use(Vue3ChartJs, {
  plugins: [
    zoomPlugin
  ]
})

Vue.mount('#app')
````

#### Via Helper Function

```javascript
import Vue3ChartJs from '../lib/main'
import zoomPlugin from 'chartjs-plugin-zoom'

Vue3ChartJs.registerGlobalPlugins([zoomPlugin])
```

Example usage with locally imported chart component:

```vue
<template>
  <div style="height:600px;width:600px;">
    <vue3-chart-js
        :id="lineChart.id"
        :type="lineChart.type"
        :data="lineChart.data"
        :options="lineChart.options"
    ></vue3-chart-js>
  </div>
</template>

<script>
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'

Vue3ChartJs.registerGlobalPlugins([zoomPlugin])

export default {
  name: 'App',
  components: {
    Vue3ChartJs,
  },
  setup () {
    const lineChart = {
      id: 'line',
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [50, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "y",
            },
          },
        },
      },
    }

    return {
      lineChart
    }
  },
}
</script>
```

## Demo

For a demo, Clone this repository and run:

```shell script
yarn install

yarn dev
```

## License

MIT
