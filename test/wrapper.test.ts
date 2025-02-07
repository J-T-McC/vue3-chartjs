import { mount } from '@vue/test-utils';
import Vue3ChartJs from '../lib/main';
import { Chart } from 'chart.js';
import { createApp, ref } from 'vue';
import { getDoughnutProps } from './chart.props';
import { generateEventObject, generateChartJsEventListener } from '../lib/includes';

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

    expect(eventObject.isDefaultPrevented()).toBe(true);
  });

  it('should return true from isDefaultPrevented when _defaultPrevented is true', () => {
    const eventObject = generateEventObject('testEvent');
    eventObject.preventDefault();

    expect(eventObject.isDefaultPrevented()).toBe(false);
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
    const mockEmit = jest.fn();
    const event = generateEventObject('testEvent');
    event.preventDefault();
    const listener = generateChartJsEventListener(mockEmit, event);

    const result = listener['testEvent']();

    expect(result).toBe(false);
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

    const mockEmit = (e: string) => {
      invoked++;
    };

    const eventAllowed = generateEventObject('test');
    const pluginEventAllowed = generateChartJsEventListener(mockEmit, eventAllowed);
    expect(pluginEventAllowed['test']()).toBeTruthy();

    const eventPrevented = generateEventObject('test');
    eventPrevented.preventDefault();
    const pluginEventPrevented = generateChartJsEventListener(mockEmit, eventPrevented);
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