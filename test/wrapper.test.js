import { expect, it, describe } from '@jest/globals'
import { mount } from '@vue/test-utils'
import Vue3ChartJs from '../lib/main'
import { Chart } from 'chart.js'

import { createApp } from 'vue'

import { getDoughnutProps } from './chart.props'
import { chartJsEventNames, generateEventObject, generateChartJsEventListener } from '../lib/includes'

const factory = function (props) {
  return mount(Vue3ChartJs, {
    propsData: { ...props }
  })
}

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
  const wrapper = factory(getDoughnutProps())
  wrapper.vm.render()
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
        expect(wrapper.emitted(eventName)).toBeTruthy()
      })
    })

  it('emits resize event', () => {
    wrapper.vm.resize()
    expect(wrapper.emitted('resize')).toHaveLength(1)
  })

  it('emits reset event', () => {
    wrapper.vm.chartJSState.chart.reset()
    expect(wrapper.emitted('reset')).toBeTruthy()
  })

  it('emits destroy, uninstall, stop events', () => {
    wrapper.vm.destroy()
    expect(wrapper.emitted('destroy')).toHaveLength(1)
    expect(wrapper.emitted('uninstall')).toHaveLength(1)
    expect(wrapper.emitted('stop')).toHaveLength(1)
  })

  it('emits render events', () => {
    expect(wrapper.emitted('beforeRender')).toBeTruthy()
    expect(wrapper.emitted('afterRender')).toBeTruthy()
  })
})
