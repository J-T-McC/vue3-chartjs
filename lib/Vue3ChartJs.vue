<script>
import { h, ref, onMounted, defineComponent } from 'vue'
import { chartJsEventNames, generateEventObject, generateChartJsEventListener } from './includes'
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Vue3ChartJs = defineComponent({
  name: 'Vue3ChartJs',
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
  },
  emits: chartJsEventNames,
  setup (props, { emit }) {
    const chartRef = ref(null)

    //generate chart.js plugin to emit lib events
    const chartJsEventsPlugin = chartJsEventNames
        .reduce((reduced, eventType) => {
          const event = generateEventObject(eventType, chartRef)
          return { ...reduced, ...generateChartJsEventListener(emit, event) }
        }, { id: 'Vue3ChartJsEventHookPlugin' })

    const chartJSState = {
      chart: null,
      plugins: [
        chartJsEventsPlugin,
        ...props.plugins
      ],
      //clone props for chart use due to chart.js mutations
      props: { ...props }
    }

    const destroy = () => {
      if (chartJSState.chart) {
        chartJSState.chart.destroy()
        chartJSState.chart = null
      }
    }

    const update = () => {
      //merge component props into chart.js store
      chartJSState.props = { ...chartJSState.props, ...props }
      chartJSState.chart.update()
    }

    const resize = () => chartJSState.chart && chartJSState.chart.resize()

    const render = () => {
      if (chartJSState.chart) {
        return chartJSState.chart.update()
      }

      return chartJSState.chart = new Chart(
          chartRef.value.getContext('2d'), {
            type: chartJSState.props.type,
            data: chartJSState.props.data,
            options: chartJSState.props.options,
            plugins: chartJSState.plugins
          }
      )
    }

    onMounted(() => render())

    return {
      chartJSState,
      chartRef,
      render,
      resize,
      update,
      destroy,
    }
  },

  render () {
    return h('canvas', {
      ref: 'chartRef'
    })
  }
})

export default Vue3ChartJs

</script>
