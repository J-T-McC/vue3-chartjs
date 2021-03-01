<script>
import { h, ref, reactive, onMounted, onUnmounted, defineComponent } from 'vue'
import { chartJsEventNames, kebabCase } from './includes'
import Chart from 'chart.js'

const emits = chartJsEventNames.map((chartJsEvent) => {
  return kebabCase(chartJsEvent)
})

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
  emits,
  setup (props, { emit }) {
    const chartRef = ref(null)

    //inject plugin to emit chart.js events
    const chartJsEventsPlugin = chartJsEventNames
        .reduce((previous, current) => {
          const eventToPush = {}
          eventToPush[current] = () => emit(kebabCase(current), chartRef)
          return { ...previous, ...eventToPush }
        }, {})

    const state = reactive({
      chart: null,
      debouncedID: null,
      plugins: [
        chartJsEventsPlugin,
        ...props.plugins
      ]
    })

    const destroy = () => state.chart && state.chart.destroy()
    const update = () => state.chart && state.chart.update()

    const render = () => {
      destroy()
      state.chart = new Chart(
          chartRef.value.getContext('2d'), {
            type: props.type,
            data: props.data,
            options: props.options,
            plugins: state.plugins
          }
      )
    }

    const debouncedReload = (fn, timeout) => {
      if (state.debouncedID) {
        window.clearTimeout(state.debouncedID)
      }
      state.debouncedID = window.setTimeout(() => fn(), timeout)
    }

    onMounted(() => render())
    onUnmounted(() => destroy())

    return {
      state,
      chartRef,
      render,
      update,
      destroy,
      debouncedReload
    }
  },
  watch: {
    'data.data': {
      handler: function () {
        return this.debouncedReload(() => {
          this.state.chart.data = this.data
          this.update()
        }, 500)
      },
      deep: true
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
