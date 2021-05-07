<script>
import { h, ref, onMounted, defineComponent } from 'vue'
import { chartJsEventNames, generateEventObject, generateChartJsEventListener } from './includes'
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js'

Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
)

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
      default: () => ({})
    },
    plugins: {
      type: Array,
      default: () => []
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
      props: { ...props }
    }

    const destroy = () => {
      if (chartJSState.chart) {
        chartJSState.chart.destroy()
        chartJSState.chart = null
      }
    }

    const update = (animateSpeed = 750) => {
      chartJSState.chart.data = { ...chartJSState.chart.data, ...chartJSState.props.data }
      chartJSState.chart.options = { ...chartJSState.chart.options, ...chartJSState.props.options }
      chartJSState.chart.update(animateSpeed)
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