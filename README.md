# Vue3 ChartJS Wrapper

[![Coverage Status](https://coveralls.io/repos/github/J-T-McC/vue3-chartjs/badge.svg?branch=main)](https://coveralls.io/github/J-T-McC/vue3-chartjs?branch=main)
[![Tests](https://github.com/J-T-McC/vue3-chartjs/actions/workflows/run-tests.yml/badge.svg)](https://github.com/J-T-McC/vue3-chartjs/actions/workflows/run-tests.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/J-T-McC/vue3-chartjs/pulls)
![npm](https://img.shields.io/npm/dt/@j-t-mcc/vue3-chartjs)

Basic [ChartJS 4](https://www.chartjs.org/) wrapper for [Vue3](https://v3.vuejs.org/)

For the v2 API, see [v2.1.0](https://github.com/J-T-McC/vue3-chartjs/tree/v2.1.0)

For ChartJS 3.1, see [v1.3.0](https://github.com/J-T-McC/vue3-chartjs/tree/v1.3.0)

For ChartJS 2, see [v0.3.0](https://github.com/J-T-McC/vue3-chartjs/tree/0.3.0)

## Requirements

- Vue 3
- ChartJS 4

## Installation

```shell script
pnpm add chart.js @j-t-mcc/vue3-chartjs

npm install chart.js @j-t-mcc/vue3-chartjs

yarn add chart.js @j-t-mcc/vue3-chartjs
```

## Configuration

Props use the same structure as ChartJS arguments and are passed to the ChartJS instance as-is.

| Prop | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `type` | `ChartType` | yes | — | Any ChartJS chart type, e.g. `'doughnut'` |
| `data` | `ChartData` | yes | — | Passed straight to ChartJS |
| `options` | `ChartOptions` | no | `{}` | Passed straight to ChartJS |
| `plugins` | `Plugin[]` | no | `[]` | Inline plugins, read once when the chart is created |
| `height` | `number` | no | — | Needs `responsive: false`; applied when the chart is built |
| `width` | `number` | no | — | Needs `responsive: false`; applied when the chart is built |

ChartJS charts are responsive by default. For a fixed size, set `height` and `width` and turn `responsive` off in
`options`.

Any attribute that is not a prop falls through to the underlying `<canvas>`, so `id`, `class`, `style` and `aria-*`
work as you would expect.

> **The chart tracks its props.** Mutate or replace `data` and `options` and it updates itself; change `type`, `height`
> or `width` and it rebuilds. See [Updating a chart](#updating-a-chart).

Every prop is reactive. Change one and the chart follows — there is nothing to call:

```javascript
chart.data.datasets[0].data = [1, 2, 3]   // updates
chart.options.plugins.title = { ... }     // updates
chart.type = 'bar'                        // rebuilds
```

`data` and `options` are re-read by an update. `type`, `height` and `width` are fixed when the ChartJS instance is
built, so changing those rebuilds it. Both are debounced, so a burst of changes costs one update, and changing `height`
and `width` together rebuilds once.

A `data` change reassigns only the data, so state that plugins keep on `options` survives it — a chart zoomed with
[`chartjs-plugin-zoom`](https://github.com/chartjs/chartjs-plugin-zoom) holds its range while its data updates.
Changing `options`, or calling `update()` yourself, replaces the options object and resets that state.

`update()` and the other methods below remain available for driving the chart explicitly.

## Playground

**[j-t-mcc.github.io/vue3-chartjs](https://j-t-mcc.github.io/vue3-chartjs/)**

An interactive playground, published from this repository and running the same build that npm installs. Presets cover
all eight ChartJS chart types, every prop is editable, and the chart follows as you type. It will also hand the whole
chart back as a config object or as a ready-to-paste component.

View the [ChartJS Docs](https://www.chartjs.org/docs/latest/samples/bar/vertical.html) for more chart examples.

## Events

A default event hook plugin is injected into each chart object and emits the
[ChartJS plugin events](https://www.chartjs.org/docs/latest/developers/plugins.html#plugin-core-api).

Event listeners are converted to camelcase in Vue 3, so the `beforeRender` hook is listened to as `@before-render`.

Events marked as "cancellable" in the ChartJS documentation can be canceled by calling `preventDefault()` on the event
parameter. `isDefaultPrevented()` reports whether that has happened, returning `true` once `preventDefault()` has been
called.

Cancellation applies to a single emission — the handler is consulted again on the next one, so a conditional guard
resumes normally once its condition clears:

```js
const onBeforeUpdate = (event) => {
  // updates are skipped while loading, and resume by themselves afterwards
  if (isLoading.value) {
    event.preventDefault()
  }
}
```

To suppress a hook for the lifetime of the chart, call `preventDefault()` unconditionally.

The chart is destroyed automatically when the component unmounts, so `beforeDestroy` and `afterDestroy` fire then as
well.

## Methods

A few ChartJS methods are exposed for common interactions, available by reference:

```javascript
chartRef.value.render()
chartRef.value.update(mode = 'default')
chartRef.value.resize()
chartRef.value.destroy()
```

`render()` creates the chart, or updates it if one already exists. It runs on mount, so you only need it to rebuild a
chart you destroyed yourself.

`update()` re-reads the `data` and `options` props and applies them. It takes a ChartJS transition mode: `'default'`,
`'none'`, `'reset'`, `'resize'`, `'show'`, `'hide'` or `'active'`. Pass `'none'` to apply an update without animating
it. To change animation duration, set it in `options`:

```javascript
options: {
  animation: {
    duration: 750
  }
}
```

For anything else, reach the ChartJS instance directly through `chartJSState`:

```javascript
const base64Image = chartRef.value.chartJSState.chart.toBase64Image()
```

See the [ChartJS Docs](https://www.chartjs.org/docs/latest/developers/api.html) for more.

## Examples

### Simple chart

```vue
<template>
  <div style="height:600px;width:600px;">
    <vue3-chart-js v-bind="doughnutChart" @before-render="beforeRenderLogic" />
  </div>
</template>

<script setup>
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

const doughnutChart = {
  type: 'doughnut',
  data: {
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: [40, 20, 80, 10]
      }
    ]
  }
}

const beforeRenderLogic = (event) => {
  // if (a === b) {
  //   event.preventDefault()
  // }
}
</script>
```

### Updating a chart

The chart watches its props, so changing them is enough. Both styles work: mutate the existing object, or replace it
entirely. `update()` is shown here for the cases where you want to drive it explicitly, such as choosing a transition
mode.

```vue
<template>
  <div style="height:600px;width:600px;">
    <vue3-chart-js ref="chartRef" v-bind="doughnutChart" />
    <button @click="updateChart">Update Chart</button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

const chartRef = ref(null)

const doughnutChart = reactive({
  type: 'doughnut',
  data: {
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: [40, 20, 80, 10]
      }
    ]
  },
  options: {
    plugins: {}
  }
})

const updateChart = () => {
  doughnutChart.options.plugins.title = {
    text: 'Updated Chart',
    display: true
  }

  // replacing the whole data object works as well as mutating it
  doughnutChart.data = {
    labels: ['Cats', 'Dogs', 'Hamsters', 'Dragons'],
    datasets: [
      {
        backgroundColor: ['#333333', '#E46651', '#00D8FF', '#DD1B16'],
        data: [100, 20, 800, 20]
      }
    ]
  }

  chartRef.value.update()
}
</script>
```

See the [ChartJS docs](https://www.chartjs.org/docs/latest/developers/updates.html) for more on updating charts.

### Exporting a chart as PNG

```vue
<template>
  <div style="height:600px;width:600px;">
    <button type="submit" @click="exportChart">Export Chart as PNG</button>
    <vue3-chart-js ref="chartRef" v-bind="doughnutChart" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

const chartRef = ref(null)

const doughnutChart = {
  type: 'doughnut',
  data: {
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: [40, 20, 80, 10]
      }
    ]
  }
}

const exportChart = () => {
  const a = document.createElement('a')
  a.href = chartRef.value.chartJSState.chart.toBase64Image()
  a.download = 'image-export.png'
  a.click()
}
</script>
```

### TypeScript

`EventObject` and `UpdateMode` are exported for annotating handlers and update calls:

```vue
<template>
  <div style="height:600px;width:600px;">
    <vue3-chart-js ref="chartRef" v-bind="doughnutChart" @before-draw="onBeforeDraw" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ChartData, ChartOptions, ChartType } from 'chart.js'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import type { EventObject, UpdateMode } from '@j-t-mcc/vue3-chartjs'

const chartRef = ref<InstanceType<typeof Vue3ChartJs> | null>(null)

const doughnutChart: { type: ChartType; data: ChartData; options: ChartOptions } = {
  type: 'doughnut',
  data: {
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: [40, 20, 80, 10]
      }
    ]
  },
  options: { responsive: true }
}

const onBeforeDraw = (event: EventObject) => {
  if (document.hidden) {
    event.preventDefault()
  }
}

const refreshWithoutAnimating = () => {
  const mode: UpdateMode = 'none'
  chartRef.value?.update(mode)
}
</script>
```

## Plugins

ChartJS has two kinds of plugins: inline and global.

### Inline plugins

Passed through the `plugins` prop and scoped to that one chart. The prop is read once, when the chart is created, so
changing it later has no effect.

```vue
<template>
  <div style="height:600px;width:600px;">
    <vue3-chart-js v-bind="doughnutChart" :plugins="[whiteBackground]" />
  </div>
</template>

<script setup>
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

// paints the canvas so exported PNGs are not transparent
const whiteBackground = {
  id: 'whiteBackground',
  beforeDraw (chart) {
    const { ctx } = chart
    ctx.save()
    ctx.globalCompositeOperation = 'destination-over'
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, chart.width, chart.height)
    ctx.restore()
  }
}

const doughnutChart = {
  type: 'doughnut',
  data: {
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: [40, 20, 80, 10]
      }
    ]
  }
}
</script>
```

### Global plugins

Registered with ChartJS and available to every chart. Some plugins require registration. Here is
[`chartjs-plugin-zoom`](https://github.com/chartjs/chartjs-plugin-zoom), registered either way:

#### Via component install

```javascript
import { createApp } from 'vue'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'
import App from './App.vue'

const app = createApp(App)

app.use(Vue3ChartJs, {
  plugins: [
    zoomPlugin
  ]
})

app.mount('#app')
```

#### Via helper function

```javascript
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'

Vue3ChartJs.registerGlobalPlugins([zoomPlugin])
```

Used with a locally imported component:

```vue
<template>
  <div style="height:600px;width:600px;">
    <vue3-chart-js v-bind="lineChart" />
  </div>
</template>

<script setup>
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'

Vue3ChartJs.registerGlobalPlugins([zoomPlugin])

const lineChart = {
  type: 'line',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [50, 19, 3, 5, 2, 3],
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  },
  options: {
    plugins: {
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'y'
        }
      }
    }
  }
}
</script>
```

## Migrating from v2

### The chart tracks its props

In v2 the component read its props once and nothing changed the chart until you called `update()` yourself. Every prop
is now watched, so the calls that used to be required are not:

```js
// v2
doughnutChart.data.datasets[0].data = [1, 2, 3]
chartRef.value.update()

// v3
doughnutChart.data.datasets[0].data = [1, 2, 3]
```

`data` and `options` changes are applied by an update; `type`, `height` and `width` are fixed when the ChartJS instance
is built, so changing those rebuilds it. Both are debounced, so a burst of changes costs one update.

Existing `update()` calls are harmless and still useful for choosing a transition mode, so nothing has to be removed to
upgrade. Two things are worth knowing:

- `data` is watched deeply. Vue walks the whole structure on each change, which is around 1ms for a thousand points and
  closer to 45ms for fifty thousand. If you render very large datasets and were batching updates deliberately, measure
  before assuming the automatic path is equivalent.
- A `data` change reassigns only the data, so plugin state kept on `options` survives it. Changing `options`, or
  calling `update()` yourself, replaces that object and resets it — a zoomed chart returns to its full range.

### `preventDefault()` applies to one emission

Previously a single `preventDefault()` call canceled that hook for the lifetime of the chart, because the event object
was created once and its flag was never reset. A conditional guard therefore froze the chart permanently the first time
its condition was true.

It now applies only to the emission it was called on, and the handler is consulted again next time.

```js
// v2: ran once, then the hook was canceled forever
const onBeforeDraw = (event) => {
  if (isFirstRender) {
    event.preventDefault()
    isFirstRender = false
  }
}

// v3: to suppress a hook permanently, cancel unconditionally
const onBeforeDraw = (event) => {
  event.preventDefault()
}
```

### Charts are destroyed on unmount

The component now destroys its chart in `onBeforeUnmount`. Calling `destroy()` yourself is no longer required, and stays
safe if you do. `beforeDestroy`, `afterDestroy`, `uninstall` and `stop` now fire when the component unmounts.

### Replacing a whole prop object works

Assigning a new `data` or `options` object is picked up. In v2 the component held a snapshot taken at setup, so only
in-place mutation of the original object had any effect.

### `update()` takes a transition mode

Changed in 2.1.0 and repeated here for anyone coming from 2.0: `update()` takes a ChartJS transition mode rather than an
animation duration in milliseconds. `update(750)` is silently ignored — set `options.animation.duration` instead.

### Types resolve on modern module resolution

The package now declares a `types` condition in its `exports` map and references ChartJS types through the public entry
point. Consumers on `moduleResolution: "bundler"`, `"node16"` or `"nodenext"` previously got no types at all, or
silently degraded to `any` under `skipLibCheck`. No code change is required.

## Demo

For a demo, Clone this repository and run:

```shell script
pnpm install

pnpm dev
```

## License

MIT
