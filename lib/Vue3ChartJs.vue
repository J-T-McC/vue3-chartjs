<script>
import { h, ref, onMounted, readonly, defineComponent } from 'vue'
import { chartJsEventNames, generateEventObject, generateChartJsEventListener } from './includes'
import Chart from 'chart.js'

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

    const state = {
      chart: null,
      debouncedID: null,
      plugins: [
        chartJsEventsPlugin,
        ...props.plugins
      ],
      //clone props for chart use due to chart.js mutations
      props: { ...props }
    }

    const destroy = () => {
      if (state.chart) {
        state.chart.destroy()
        state.chart = null
      }
    }

    const update = () => {
      //merge component props into chart.js store
      state.props = { ...state.props, ...props }
      state.chart.update()
    }

    const resize = () =>  state.chart && state.chart.resize()

    const render = () => {
      if (state.chart) {
        return state.chart.update()
      }

      return state.chart = new Chart(
          chartRef.value.getContext('2d'), {
            type: state.props.type,
            data: state.props.data,
            options: state.props.options,
            plugins: state.plugins
          }
      )
    }

    onMounted(() => render())

    return {
      state: readonly(state),
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
