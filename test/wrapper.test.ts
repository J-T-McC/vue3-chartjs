import { mount } from '@vue/test-utils';
import Vue3ChartJs from '../lib/main';
import { Chart } from 'chart.js';
import { createApp, ref } from 'vue';
import { getDoughnutProps } from './chart.props';
import { generateEventObject, generateChartJsEventListener } from '../lib/includes';
import type { EventObject } from '../lib/includes';

const Vue3ChartJsPlugin = Vue3ChartJs as any;

const factory = function (props: Record<string, any>) {
  return mount(Vue3ChartJsPlugin, {
    props: { ...props }
  });
};

describe('generateEventObject', () => {
  it('should create an event object with the given type and chartRef', () => {
    const type = 'testEvent';
    const chartRef = ref(null);
    const eventObject = generateEventObject(type, chartRef);

    expect(eventObject.type).toBe(type);
    expect(eventObject.chartRef).toBe(chartRef);
    expect(eventObject._defaultPrevented).toBe(false);
  });

  it('should set _defaultPrevented to true when preventDefault is called', () => {
    const eventObject = generateEventObject('testEvent');

    eventObject.preventDefault();
    expect(eventObject._defaultPrevented).toBe(true);
  });

  it('should return false from isDefaultPrevented when _defaultPrevented is false', () => {
    const eventObject = generateEventObject('testEvent');

    expect(eventObject.isDefaultPrevented()).toBe(false);
  });

  it('should return true from isDefaultPrevented when _defaultPrevented is true', () => {
    const eventObject = generateEventObject('testEvent');
    eventObject.preventDefault();

    expect(eventObject.isDefaultPrevented()).toBe(true);
  });
});

describe('generateChartJsEventListener', () => {
  it('should emit the event with the correct type and event object', () => {
    const mockEmit = jest.fn();
    const event = generateEventObject('testEvent');
    const listener = generateChartJsEventListener(mockEmit, event);

    listener['testEvent']();

    expect(mockEmit).toHaveBeenCalledWith('testEvent', event);
  });

  it('should return true if the event is not prevented', () => {
    const mockEmit = jest.fn();
    const event = generateEventObject('testEvent');
    const listener = generateChartJsEventListener(mockEmit, event);

    const result = listener['testEvent']();

    expect(result).toBe(true);
  });

  it('should return false if the event is prevented', () => {
    const mockEmit = jest.fn((_type: string, event: EventObject) => event.preventDefault());
    const event = generateEventObject('testEvent');
    const listener = generateChartJsEventListener(mockEmit, event);

    const result = listener['testEvent']();

    expect(result).toBe(false);
  });

  it('re-evaluates cancellation on every invocation', () => {
    let invocations = 0;
    const mockEmit = jest.fn((_type: string, event: EventObject) => {
      invocations += 1;
      // only the first invocation cancels
      if (invocations === 1) {
        event.preventDefault();
      }
    });
    const event = generateEventObject('testEvent');
    const listener = generateChartJsEventListener(mockEmit, event);

    expect(listener['testEvent']()).toBe(false);
    expect(listener['testEvent']()).toBe(true);
    expect(listener['testEvent']()).toBe(true);
  });
});

describe('init', () => {
  it('installs globally', () => {
    const App = createApp({});
    App.use(Vue3ChartJsPlugin);
    expect(App._context.components.hasOwnProperty('Vue3ChartJs')).toBeTruthy();
  });

  it('ChartJS instance is accessible', () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;
    expect(ref.chartJSState.chart).toBeTruthy(); // Ensures that the Chart.js instance is initialized
  });

  it('should create a chart instance on mount', async () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;
    await ref.render();
    expect(ref.chartJSState.chart).toBeTruthy();
  });

  it('registers global plugins', () => {
    const App = createApp({});
    App.use(Vue3ChartJsPlugin, {
      plugins: [{ id: 'globallyImportedTestPlugin' }]
    });
    const plugins = Chart.defaults.plugins as { [key: string]: any };
    expect(plugins['globallyImportedTestPlugin']).toBeTruthy();
  });

  it('ChartJS instance is accessible', () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;
    expect(ref.chartJSState.chart).toBeTruthy();
  });

  it('defaults options to empty object', () => {
    const doughnutProps = getDoughnutProps();
    delete doughnutProps.options;
    const wrapper = factory(doughnutProps);
    const props = wrapper.props() as any;
    expect(props.options).toMatchObject({});
  });

  it('defaults plugins to empty array', () => {
    const doughnutProps = getDoughnutProps();
    delete doughnutProps.plugins;
    const wrapper = factory(doughnutProps);
    const props = wrapper.props() as any;
    expect(props.plugins).toEqual([]);
  });

  it("calls render on mounted", () => {
    const doughnutProps = getDoughnutProps();
    const renderSpy = jest.spyOn(Vue3ChartJsPlugin, "render");

    mount(Vue3ChartJsPlugin, {
      props: doughnutProps
    });

    expect(renderSpy).toHaveBeenCalled();
  });
});

describe('chart dimensions', () => {
  it('it sets fixed height and width', async () => {
    const doughnutProps = getDoughnutProps();
    doughnutProps.options!.responsive = false;
    doughnutProps.width = doughnutProps.height = 800;
    const wrapper = factory(doughnutProps);
    const ref = wrapper.vm as any;
    ref.render();
    expect(ref.chartJSState.chart.height).toEqual(800);
    expect(ref.chartJSState.chart.width).toEqual(800);
  });
});

describe('chart reloading', () => {
  it('reloads if already exists', async () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;
    ref.render();
    expect(wrapper.emitted('afterInit')).toHaveLength(1);
    ref.render();
    expect(wrapper.emitted('afterUpdate')).toHaveLength(2);
    expect(wrapper.emitted('afterInit')).toHaveLength(1);
  });
});

describe('component methods', () => {
  it('destroys if chart exists', async () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;
    expect(ref.chartJSState.chart).toBeTruthy();
    ref.destroy();
    expect(ref.chartJSState.chart).toBeFalsy();
  });

  it('updates data', async () => {
    const doughnutProps = getDoughnutProps();
    const wrapper = factory(doughnutProps);
    const ref = wrapper.vm as any;
    const chart = ref.chartJSState.chart;
    expect(wrapper.emitted('afterInit')).toHaveLength(1);
    expect(chart.data.datasets[0].data).toEqual(doughnutProps.data.datasets[0].data);
    doughnutProps.data.datasets[0].data = [1, 2, 3, 4];
    ref.update();
    expect(wrapper.emitted('afterUpdate')).toHaveLength(1);
    expect(chart.data.datasets[0].data).toEqual(doughnutProps.data.datasets[0].data);
  });

  it('updates options', () => {
    const doughnutProps = getDoughnutProps();
    const wrapper = factory(doughnutProps);
    const ref = wrapper.vm as any;
    const chart = ref.chartJSState.chart;
    expect(wrapper.emitted('afterInit')).toHaveLength(1);
    expect(chart.options.plugins.title.display).toBeFalsy();
    doughnutProps.options!.plugins!.title = {
      text: 'Updated',
      display: true
    };
    ref.update();
    expect(wrapper.emitted('afterUpdate')).toHaveLength(1);
    expect(chart.options.plugins.title.text).toEqual('Updated');
  });

  it('implements prevent default for emitted chart.js hooks', () => {
    let invoked = 0;

    const allow = () => {
      invoked++;
    };

    const cancel = (_type: string, event: EventObject) => {
      invoked++;
      event.preventDefault();
    };

    const eventAllowed = generateEventObject('test');
    const pluginEventAllowed = generateChartJsEventListener(allow, eventAllowed);
    expect(pluginEventAllowed['test']()).toBeTruthy();

    const eventPrevented = generateEventObject('test');
    const pluginEventPrevented = generateChartJsEventListener(cancel, eventPrevented);
    expect(pluginEventPrevented['test']()).toBeFalsy();
    expect(invoked).toEqual(2);
  });
});

describe('emitted events', () => {
  it('subscribes to chartjs events', () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;
    ref.render();
    expect(wrapper.emitted()).toHaveProperty('beforeRender');

    ref.resize();
    expect(wrapper.emitted('resize')).toHaveLength(1);

    ref.chartJSState.chart.reset();
    expect(wrapper.emitted('reset')).toBeTruthy();

    ref.destroy();
    expect(wrapper.emitted('uninstall')).toHaveLength(1);
    expect(wrapper.emitted('stop')).toHaveLength(1);
  });
});

describe('reactive props', () => {
  it('picks up a replaced data prop on update', async () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;

    await wrapper.setProps({
      data: {
        labels: ['Cats', 'Dogs', 'Hamsters', 'Dragons'],
        datasets: [
          {
            backgroundColor: ['#333333', '#E46651', '#00D8FF', '#DD1B16'],
            data: [1, 2, 3, 4]
          }
        ]
      }
    });
    ref.update();

    expect(ref.chartJSState.chart.data.datasets[0].data).toEqual([1, 2, 3, 4]);
    expect(ref.chartJSState.chart.data.labels).toEqual(['Cats', 'Dogs', 'Hamsters', 'Dragons']);
  });

  it('picks up a replaced options prop on update', async () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;

    await wrapper.setProps({
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Replaced' } }
      }
    });
    ref.update();

    expect(ref.chartJSState.chart.options.plugins.title.text).toEqual('Replaced');
  });

  it('renders a replaced type prop after destroy', async () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;

    ref.destroy();
    await wrapper.setProps({ type: 'pie' });
    ref.render();

    expect(ref.chartJSState.chart.config.type).toEqual('pie');
  });
});

describe('lifecycle cleanup', () => {
  it('destroys the chart when the component unmounts', () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;
    expect(ref.chartJSState.chart).toBeTruthy();

    wrapper.unmount();

    expect(ref.chartJSState.chart).toBeNull();
  });

  it('unmounting after a manual destroy is a no-op', () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;

    ref.destroy();
    expect(ref.chartJSState.chart).toBeNull();
    expect(wrapper.emitted('uninstall')).toHaveLength(1);

    expect(() => wrapper.unmount()).not.toThrow();
    expect(ref.chartJSState.chart).toBeNull();
  });
});

describe('event cancellation', () => {
  it('cancels a cancellable chart.js hook when preventDefault is called', () => {
    const proceeded = factory(getDoughnutProps());
    (proceeded.vm as any).update();

    expect(proceeded.emitted('beforeUpdate')).toHaveLength(1);
    expect(proceeded.emitted('afterUpdate')).toHaveLength(1);

    const cancelled = factory({
      ...getDoughnutProps(),
      onBeforeUpdate: (event: EventObject) => event.preventDefault(),
    });
    (cancelled.vm as any).update();

    // chart.js abandons the update, so the matching after hook never runs
    expect(cancelled.emitted('beforeUpdate')).toHaveLength(1);
    expect(cancelled.emitted('afterUpdate')).toBeUndefined();
  });

  it('stops cancelling once the handler no longer calls preventDefault', () => {
    let calls = 0;
    const wrapper = factory({
      ...getDoughnutProps(),
      onBeforeUpdate: (event: EventObject) => {
        calls += 1;
        // mirrors a reactive guard such as `if (isLoading.value)`
        if (calls === 1) {
          event.preventDefault();
        }
      },
    });
    const ref = wrapper.vm as any;

    ref.update();
    ref.update();
    ref.update();

    expect(calls).toEqual(3);
    // first update cancelled, the other two ran to completion
    expect(wrapper.emitted('afterUpdate')).toHaveLength(2);
  });
});
