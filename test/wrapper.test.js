import { expect, it, describe, jest } from '@jest/globals'
import { mount } from '@vue/test-utils'
import Vue3ChartJs from '../lib/main'

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
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('afterInit').length).toEqual(1)
    expect(wrapper.emitted('afterUpdate').length).toEqual(1)
    wrapper.vm.render()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('afterUpdate').length).toEqual(2)
    expect(wrapper.emitted('afterInit').length).toEqual(1)
  })

})

describe('component methods', () => {

  it('destroys if chart exists', () => {
    const wrapper = factory(getDoughnutProps())
    expect(wrapper.vm.chartJSState.chart).toBeTruthy()
    wrapper.vm.destroy()
    expect(wrapper.emitted('destroy').length).toEqual(1)

    wrapper.vm.destroy()
    expect(wrapper.emitted('destroy').length).toEqual(1)
  })

  it('updates data', () => {
    const doughnutProps = getDoughnutProps();
    const wrapper = factory(doughnutProps)
    const chart = wrapper.vm.chartJSState.chart
    expect(wrapper.emitted('afterUpdate').length).toEqual(1)
    expect(chart.data.datasets[0].data).toEqual(doughnutProps.data.datasets[0].data)
    doughnutProps.data.datasets[0].data = [1, 2, 3, 4]
    wrapper.vm.update()
    expect(wrapper.emitted('afterUpdate').length).toEqual(2)
    expect(chart.data.datasets[0].data).toEqual(doughnutProps.data.datasets[0].data)
  })

  it('updates options', () => {
    const doughnutProps = getDoughnutProps();
    const wrapper = factory(doughnutProps)
    const chart = wrapper.vm.chartJSState.chart
    expect(wrapper.emitted('afterUpdate').length).toEqual(1)
    expect(chart.options.title.display).toBeFalsy()
    expect(chart.options.title.text).toBeFalsy()
    doughnutProps.options.title = {
      text: 'Updated',
      display: true
    }
    wrapper.vm.update()
    expect(wrapper.emitted('afterUpdate').length).toEqual(2)
    expect(chart.options.title.text).toEqual('Updated')
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

  const skipEvents = [
    'resize',
    'beforeEvent',
    'afterEvent',
    'destroy',
  ]

  chartJsEventNames
    .filter((eventName) => !skipEvents.includes(eventName))
    .forEach((eventName, index) => {
      it(`emits ${eventName} events`, async () => {
        if (!index) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        expect(wrapper.emitted(eventName).length).toBeTruthy()
      })
    })

  it('emits resize event', () => {
    wrapper.vm.resize()
    expect(wrapper.emitted('resize').length).toBeTruthy()
  })

  it('emits destroy event', () => {
    wrapper.vm.destroy()
    expect(wrapper.emitted('destroy').length).toBeTruthy()
  })

})
