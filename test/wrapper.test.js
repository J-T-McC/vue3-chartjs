import { expect, it, describe } from '@jest/globals'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import Vue3ChartJs from '../src/Vue3ChartJs.vue'

import { doughnutProps } from './chart.props'
import { kebabCase } from '../src/includes'

const Vue3ChartJsComponent = defineComponent(Vue3ChartJs)

describe('events', () => {
  const wrapper = mount(Vue3ChartJsComponent, {
    propsData: { ...doughnutProps }
  })

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

describe('chart reload', () => {
  it('reloads chart on series change', async () => {
    const wrapper = mount(Vue3ChartJsComponent, {
      propsData: doughnutProps
    })

    await wrapper.vm.$nextTick()

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
    const wrapper = mount(Vue3ChartJsComponent, {
      propsData: doughnutProps
    })

    await wrapper.vm.$nextTick()

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
