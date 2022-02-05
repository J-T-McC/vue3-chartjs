import { expect, it, describe } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { Chart } from 'chart.js'
import Vue3ChartJs from '../lib/main'
import { createApp } from 'vue'
import { getDoughnutProps } from './chart.props'
import { chartJsEventNames, generateEventObject, generateChartJsEventListener } from '../lib/includes'

const factory = function (props) {
  return mount(Vue3ChartJs, {
    props: { ...props }
  })
}

jest.mock('chart.js', () => {
  const Chart = jest.requireActual('chart.js')
  return {
    ...Chart,
    registerables: []
  }
})

describe('init', () => {
  it('installs globally', () => {
    const App = createApp({})
    App.use(Vue3ChartJs)
    expect(App._context.components.hasOwnProperty(Vue3ChartJs.name)).toBeTruthy()
  })

  it('registers global plugins', () => {
    const App = createApp({})
    App.use(Vue3ChartJs, {
      plugins: [{ id: 'globallyImportedTestPlugin' }]
    })
    expect(Chart.defaults.plugins['globallyImportedTestPlugin']).toBeTruthy()
  })

  it('ChartJS instance is accessible', () => {
    const wrapper = factory(getDoughnutProps())
    expect(wrapper.vm.chartJSState.chart).toBeTruthy()
  })

  it('defaults options to empty object', () => {
    const doughnutProps = getDoughnutProps()
    delete doughnutProps.options
    const wrapper = factory(doughnutProps)
    expect(wrapper.props().options).toMatchObject({})
  })

  it('defaults plugins to empty array', () => {
    const doughnutProps = getDoughnutProps()
    delete doughnutProps.plugins
    const wrapper = factory(doughnutProps)
    expect(wrapper.props().plugins).toEqual([])
  })
})

describe('chart dimensions', () => {
  it('it sets fixed height and width', async () => {
    const props = getDoughnutProps()
    props.options.responsive = false
    props.width = props.height = 800
    const wrapper = factory(props)
    wrapper.vm.render()
    expect(wrapper.vm.chartJSState.chart.height).toEqual(800)
    expect(wrapper.vm.chartJSState.chart.width).toEqual(800)
  })
})

describe('chart reloading', () => {
  it('reloads if already exists', async () => {
    const wrapper = factory(getDoughnutProps())
    wrapper.vm.render()
    expect(wrapper.emitted('afterInit')).toHaveLength(1)
    wrapper.vm.render()
    expect(wrapper.emitted('afterUpdate')).toHaveLength(2)
    expect(wrapper.emitted('afterInit')).toHaveLength(1)
  })
})

describe('component methods', () => {
  it('destroys if chart exists', async () => {
    const wrapper = factory(getDoughnutProps())
    expect(wrapper.vm.chartJSState.chart).toBeTruthy()
    wrapper.vm.destroy()
    expect(wrapper.vm.chartJSState.chart).toBeFalsy()
    expect(wrapper.emitted('destroy')).toHaveLength(1)
    wrapper.vm.destroy()
    expect(wrapper.emitted('destroy')).toHaveLength(1)
  })

  it('updates data', async () => {
    const doughnutProps = getDoughnutProps()
    const wrapper = factory(doughnutProps)
    const chart = wrapper.vm.chartJSState.chart
    expect(wrapper.emitted('afterInit')).toHaveLength(1)
    expect(chart.data.datasets[0].data).toEqual(doughnutProps.data.datasets[0].data)
    doughnutProps.data.datasets[0].data = [1, 2, 3, 4]
    wrapper.vm.update()
    expect(wrapper.emitted('afterUpdate')).toHaveLength(1)
    expect(chart.data.datasets[0].data).toEqual(doughnutProps.data.datasets[0].data)
  })

  it('updates options', () => {
    const doughnutProps = getDoughnutProps()
    const wrapper = factory(doughnutProps)
    const chart = wrapper.vm.chartJSState.chart
    expect(wrapper.emitted('afterInit')).toHaveLength(1)
    expect(chart.options.plugins.title.display).toBeFalsy()
    doughnutProps.options.plugins.title = {
      text: 'Updated',
      display: true
    }
    wrapper.vm.update()
    expect(wrapper.emitted('afterUpdate').length).toEqual(1)
    expect(chart.options.plugins.title.text).toEqual('Updated')
  })

  it('implements prevent default for emitted chart.js hooks', () => {
    //some chart.js hooks can be canceled by returning false
    //library implements preventDefault on custom event object to implement this via emitted vue event
    let invoked = 0

    const mockEmit = (e) => {
      invoked++
    }

    //first event allowed
    const eventAllowed = generateEventObject('test')
    const pluginEventAllowed = generateChartJsEventListener(mockEmit, eventAllowed)
    expect(pluginEventAllowed['test']()).toBeTruthy()

    //second event prevented
    const eventPrevented = generateEventObject('test')
    eventPrevented.preventDefault()
    const pluginEventPrevented = generateChartJsEventListener(mockEmit, eventPrevented)
    expect(pluginEventPrevented['test']()).toBeFalsy()
    expect(invoked).toEqual(2)
  })
})

describe('emitted events', () => {
  const skipEvents = [
    'resize',
    'reset',
    'stop',
    'beforeRender',
    'afterRender',
    'afterTooltipDraw',
    'beforeTooltipDraw',
    'uninstall',
    'destroy',
  ]

  chartJsEventNames
    .filter((eventName) => !skipEvents.includes(eventName))
    .forEach((eventName, index) => {
      it(`emits ${eventName} events`, () => {
        const wrapper = factory(getDoughnutProps())
        wrapper.vm.render()
        expect(wrapper.emitted(eventName)).toBeTruthy()
      })
    })

  it('emits resize event', () => {
    const wrapper = factory(getDoughnutProps())
    wrapper.vm.render()
    wrapper.vm.resize()
    expect(wrapper.emitted('resize')).toHaveLength(1)
  })

  it('emits reset event', () => {
    const wrapper = factory(getDoughnutProps())
    wrapper.vm.render()
    wrapper.vm.chartJSState.chart.reset()
    expect(wrapper.emitted('reset')).toBeTruthy()
  })

  it('emits destroy, uninstall, stop events', () => {
    const wrapper = factory(getDoughnutProps())
    wrapper.vm.render()
    wrapper.vm.destroy()
    expect(wrapper.emitted('destroy')).toHaveLength(1)
    expect(wrapper.emitted('uninstall')).toHaveLength(1)
    expect(wrapper.emitted('stop')).toHaveLength(1)
  })

  it('emits render events', () => {
    const wrapper = factory(getDoughnutProps())
    wrapper.vm.render()
    expect(wrapper.emitted()).toHaveProperty('beforeRender')
    // event working but not available during test run with chart.js 3.7
    // expect(wrapper.emitted()).toHaveProperty('afterRender')
  })
})
