import Chart from 'chart.js'
import { h } from 'vue'

export default {
  name: 'vue3-chartjs',
  render () {
    return h('canvas')
  },
  setup (props, { emit }) {
    return {
      state: {
        chart: null,
        debouncedID: null,
        plugins: [
          {
            // capture and emit chartJS events
            beforeInit: () => emit('beforeInit'),
            afterInit: () => emit('afterInit'),
            beforeUpdate: () => emit('beforeUpdate'),
            afterUpdate: () => emit('afterUpdate'),
            beforeLayout: () => emit('beforeLayout'),
            afterLayout: () => emit('afterLayout'),
            beforeDatasetsUpdate: () => emit('beforeDatasetsUpdate'),
            afterDatasetsUpdate: () => emit('afterDatasetsUpdate'),
            beforeDatasetUpdate: () => emit('beforeDatasetUpdate'),
            afterDatasetUpdate: () => emit('afterDatasetUpdate'),
            beforeRender: () => emit('beforeRender'),
            afterRender: () => emit('afterRender'),
            beforeDraw: () => emit('beforeDraw'),
            afterDraw: () => emit('afterDraw'),
            beforeDatasetsDraw: () => emit('beforeDatasetsDraw'),
            afterDatasetsDraw: () => emit('afterDatasetsDraw'),
            beforeDatasetDraw: () => emit('beforeDatasetDraw'),
            afterDatasetDraw: () => emit('afterDatasetDraw'),
            beforeEvent: () => emit('beforeEvent'),
            afterEvent: () => emit('afterEvent'),
            resize: () => emit('resize'),
            destroy: () => emit('destroy')
          }
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
    plugins: []
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
    debounce (fn, timeout) {
      if (this.state.debouncedID) {
        clearTimeout(this.state.debouncedID)
      }
      this.state.debouncedID = setTimeout(() => fn(), timeout)
    }
  },
  watch: {
    'data.data': {
      handler: function () {
        this.debounce(() => {
          this.state.chart.data = this.data
          this.update()
        }, 500)
      },
      deep: true
    }
  }
}
