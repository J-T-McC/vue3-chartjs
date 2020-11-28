<script>
import Chart from 'chart.js'
import { h } from 'vue'
import { chartJsEventNames, kebabCase } from './includes'

export default {
  name: 'Vue3ChartJs',
  render () {
    return h('canvas')
  },
  setup (props, { emit }) {
    const chartJsEventsPlugin = chartJsEventNames
      .reduce((previous, current) => {
        const eventToPush = {}
        eventToPush[current] = () => emit(kebabCase(current))
        return { ...previous, ...eventToPush }
      }, {})

    return {
      state: {
        chart: null,
        debouncedID: null,
        plugins: [
          chartJsEventsPlugin
        ].concat(props.plugins)
      }
    }
  },
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
  },
  mounted () {
    this.render()
  },
  unmounted () {
    this.destroy()
  },
  methods: {
    render () {
      this.destroy()
      this.state.chart = new Chart(
        this.$el.getContext('2d'), {
          type: this.type,
          data: this.data,
          options: this.options,
          plugins: this.state.plugins
        }
      )
    },
    update () {
      if (this.state.chart) {
        this.state.chart.update()
      }
    },
    destroy () {
      if (this.state.chart) {
        this.state.chart.destroy()
      }
    },
    debouncedReload (fn, timeout) {
      if (this.state.debouncedID) {
        clearTimeout(this.state.debouncedID)
      }
      this.state.debouncedID = setTimeout(() => fn(), timeout)
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
  }
}
</script>
