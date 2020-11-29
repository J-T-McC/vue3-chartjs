# Vue3 ChartJS Wrapper

[![Coverage Status](https://coveralls.io/repos/github/J-T-McC/vue3-chartjs/badge.svg?branch=main)](https://coveralls.io/github/J-T-McC/vue3-chartjs?branch=main)
[![Build Status](https://travis-ci.org/J-T-McC/vue3-chartjs.svg?branch=main)](https://travis-ci.org/J-T-McC/vue3-chartjs)

Basic [ChartJS](https://www.chartjs.org/) wrapper for [Vue3](https://v3.vuejs.org/)

## Usage example

```vue

<template>
  <div>
    <vue3-chart-js v-bind="{...doughnutChart}"></vue3-chart-js>
  </div>
</template>

<script>

import Vue3ChartJs from 'vue3-chartjs'

export default {
  components: {
    Vue3ChartJs
  },
  data () {
    return {
      doughnutChart: {
        id: 'myDoughnut',
        type: 'doughnut',
        data: {
          labels: ['Apple', 'Cheese', 'Cat', 'Window'],
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
    }
  }
}
</script>


```

## Configuration

Properties are passed as-is to the instance of ChartJS. View [Examples](https://www.chartjs.org/docs/latest/getting-started/usage.html).

External changes to ```data``` will trigger a chart reload. 

```js

  props: {
    type: {
      type: String,
      required: true
    },
    data: {},
    options: {},
    plugins: {
      default: []
    }
  }

```

## Events

Emits [ChartJS events](https://www.chartjs.org/docs/latest/developers/plugins.html#plugin-core-api)

```vue
    //beforeInit chartjs event example
    <vue3-chart-js v-bind="{...doughnutChart}"  @before-init="myMethod"></vue3-chart-js>
```

## License

MIT