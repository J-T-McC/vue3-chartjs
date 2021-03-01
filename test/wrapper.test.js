import { expect, it, describe } from '@jest/globals'
import { mount } from '@vue/test-utils'
import Vue3ChartJs from '../lib/main'

import { createApp } from 'vue'

import { doughnutProps } from './chart.props'
import { kebabCase } from '../lib/includes'

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

  it('renders', () => {
    const wrapper = factory(doughnutProps)
    expect(wrapper.vm.state.chart).toBeTruthy()
  })
})

describe('chart reload', () => {

  it('reloads if already exists', async () => {
    const wrapper = factory(doughnutProps)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('after-init').length).toEqual(1)
    expect(wrapper.emitted('after-update').length).toEqual(1)
    wrapper.vm.render()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('after-update').length).toEqual(2)
    expect(wrapper.emitted('after-init').length).toEqual(1)
  })

  it('reloads chart on series change', async () => {
    const wrapper = factory(doughnutProps)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('after-update').length).toEqual(1)

    await wrapper.setProps({
      id: 'doughnut',
      type: 'doughnut',
      data: {
        labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
        datasets: [
          {
            backgroundColor: [
              '#41B883',
              '#E46651',
              '#00D8FF',
              '#DD1B16'
            ],
            data: [20, 30, 10, 15]
          }
        ]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))
    expect(wrapper.emitted('after-update').length).toEqual(2)
  })

  it('has debounced reload on series change', async () => {
    const wrapper = factory(doughnutProps)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('after-update').length).toEqual(1)

    for (let i = 1; i < 5; i++) {
      await wrapper.setProps({
        id: 'doughnut',
        type: 'doughnut',
        data: {
          labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
          datasets: [
            {
              backgroundColor: [
                '#41B883',
                '#E46651',
                '#00D8FF',
                '#DD1B16'
              ],
              data: [20, 30, 10, 15]
            }
          ]
        }
      })
    }
    await new Promise(resolve => setTimeout(resolve, 500))
    expect(wrapper.emitted('after-update').length).toEqual(2)
  })
})

describe('methods', () => {

  it('destroys chart', () => {
    const wrapper = factory(doughnutProps)
    expect(wrapper.vm.state.chart).toBeTruthy()
    wrapper.vm.destroy()
    expect(wrapper.emitted('destroy').length).toBeTruthy()
  })

  it('updates if chart exists', async () => {
    const wrapper = factory(doughnutProps)
    expect(wrapper.emitted('after-update').length).toEqual(1)
    wrapper.vm.update()
    expect(wrapper.emitted('after-update').length).toEqual(2)
    wrapper.vm.state.chart = null
    wrapper.vm.update()
    expect(wrapper.emitted('after-update').length).toEqual(2)
  })
})

describe('events', () => {
  const wrapper = factory(doughnutProps)

  it('converts chartjs event names to kebab case', () => {
    expect(kebabCase('beforeInit')).toEqual('before-init')
  })

  it('emits chartjs events', () => {
    expect(wrapper.emitted('before-init').length).toBeTruthy()
  })

  it('destroys chart', () => {
    wrapper.vm.destroy()
    expect(wrapper.emitted('destroy').length).toBeTruthy()
  })
})
