import { mount } from '@vue/test-utils';
import Vue3ChartJs from '../lib/main';
import { Chart } from 'chart.js';
import { createApp, nextTick, reactive, ref } from 'vue';
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

  it('creates the chart on mount without an explicit render()', () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;

    // the init hooks only fire when a Chart is constructed
    expect(wrapper.emitted('beforeInit')).toHaveLength(1);
    expect(wrapper.emitted('afterInit')).toHaveLength(1);
    expect(ref.chartJSState.chart).toBeTruthy();
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
    doughnutProps.options!.plugins = {
      title: {
        text: 'Updated',
        display: true
      }
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

describe('update() and the chart.js options proxy', () => {
  // chart.js resolves options behind a proxy whose get handler assumes string
  // keys. Reading a symbol off it throws, so update() must assign rather than
  // copy. jsdom charts never reach that state, so the proxy is simulated here.
  const resolvedOptionsProxy = (onSymbolRead: () => void) => {
    const cacheMarker = Symbol('cachedOptions');
    return new Proxy({ responsive: true } as Record<string, unknown>, {
      get (target, key) {
        if (typeof key !== 'string') {
          onSymbolRead();
          throw new TypeError('name.startsWith is not a function');
        }
        return target[key as string];
      },
      ownKeys: (target) => [...Reflect.ownKeys(target), cacheMarker],
      getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true, value: 1 }),
    });
  };

  it('assigns options instead of copying them', () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;

    let symbolWasRead = false;
    let assigned: unknown;
    Object.defineProperty(ref.chartJSState.chart, 'options', {
      get: () => resolvedOptionsProxy(() => { symbolWasRead = true; }),
      set: (value) => { assigned = value; },
      configurable: true,
    });

    try {
      ref.update();
    } catch {
      // chart.js internals fail against the stand-in proxy; only the read matters
    }

    expect(symbolWasRead).toBe(false);
    expect(assigned).toEqual(ref.chartJSState.props.options);
    expect(assigned).not.toBe(ref.chartJSState.props.options);
  });
});

describe('options isolation', () => {
  it('does not write chart.js internals back onto the caller\'s options', () => {
    const doughnutProps = getDoughnutProps();
    const callerOptions = doughnutProps.options!;
    const wrapper = factory(doughnutProps);
    const ref = wrapper.vm as any;

    // chart.js derives `plugins` and `scales` while resolving; they belong on
    // the chart, not on the object the consumer handed us
    expect(Object.keys(callerOptions)).toEqual(['responsive']);

    ref.update();

    expect(Object.keys(callerOptions)).toEqual(['responsive']);
    expect(ref.chartJSState.chart.config.options).not.toBe(callerOptions);
  });
});

describe('automatic rebuild on structural props', () => {
  // the rebuild is debounced through a timer, then a tick for the new canvas
  const settle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();
  };

  it('rebuilds when type changes', async () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;
    expect(ref.chartJSState.chart.config.type).toEqual('doughnut');

    await wrapper.setProps({ type: 'bar' });
    await settle();

    expect(ref.chartJSState.chart.config.type).toEqual('bar');
  });

  it('rebuilds when height or width change', async () => {
    const doughnutProps = getDoughnutProps();
    doughnutProps.options!.responsive = false;
    doughnutProps.height = doughnutProps.width = 400;
    const wrapper = factory(doughnutProps);
    const ref = wrapper.vm as any;
    expect(ref.chartJSState.chart.height).toEqual(400);

    await wrapper.setProps({ height: 150, width: 250 });
    await settle();

    expect(ref.chartJSState.chart.height).toEqual(150);
    expect(ref.chartJSState.chart.width).toEqual(250);
  });

  it('coalesces a burst of changes into one rebuild', async () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;

    await wrapper.setProps({ type: 'bar' });
    await wrapper.setProps({ type: 'line' });
    await wrapper.setProps({ type: 'pie' });
    await settle();

    expect(ref.chartJSState.chart.config.type).toEqual('pie');
    // one teardown for the burst, not three
    expect(wrapper.emitted('afterDestroy')).toHaveLength(1);
  });

  it('does not rebuild when data changes, which chart.js mutates', async () => {
    const wrapper = factory(getDoughnutProps());
    const ref = wrapper.vm as any;
    const chart = ref.chartJSState.chart;

    await wrapper.setProps({
      data: { labels: ['x'], datasets: [{ data: [1] }] },
    });
    await settle();

    // same instance: a data watcher would loop, since chart.js writes
    // resolved colours back onto the datasets it is given
    expect(ref.chartJSState.chart).toBe(chart);
    expect(wrapper.emitted('afterDestroy')).toBeUndefined();
  });
});

describe('automatic updates from data and options', () => {
  const settle = async () => {
    for (let i = 0; i < 4; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      await nextTick();
    }
  };

  it('applies an in-place data mutation without an explicit update()', async () => {
    const data = reactive(getDoughnutProps().data);
    const wrapper = factory({ ...getDoughnutProps(), data });
    const ref = wrapper.vm as any;

    data.datasets[0].data = [5, 6, 7, 8];
    await settle();

    expect(ref.chartJSState.chart.data.datasets[0].data).toEqual([5, 6, 7, 8]);
  });

  it('applies a replaced data object', async () => {
    const state = reactive({ data: getDoughnutProps().data });
    const wrapper = factory({ ...getDoughnutProps(), data: state.data });
    const ref = wrapper.vm as any;

    await wrapper.setProps({
      data: { labels: ['x', 'y'], datasets: [{ data: [11, 22] }] },
    });
    await settle();

    expect(ref.chartJSState.chart.data.datasets[0].data).toEqual([11, 22]);
  });

  it('applies an options change', async () => {
    const options = reactive({ responsive: false, plugins: {} } as Record<string, any>);
    const wrapper = factory({ ...getDoughnutProps(), options });
    const ref = wrapper.vm as any;

    options.plugins = { title: { display: true, text: 'Reactive' } };
    await settle();

    expect(ref.chartJSState.chart.options.plugins.title.text).toEqual('Reactive');
  });

  it('drops a pending update if the chart was destroyed first', async () => {
    const data = reactive(getDoughnutProps().data);
    const wrapper = factory({ ...getDoughnutProps(), data });
    const ref = wrapper.vm as any;

    ref.destroy();
    data.datasets[0].data = [3, 3, 3, 3];

    await expect(settle()).resolves.not.toThrow();
    expect(ref.chartJSState.chart).toBeNull();
  });

  it('leaves chart.options alone when only data changed', async () => {
    // plugins keep state on chart.options — zoom stores its applied range in
    // options.scales — so replacing it on every data change discards their work
    const data = reactive(getDoughnutProps().data);
    const wrapper = factory({ ...getDoughnutProps(), data });
    const ref = wrapper.vm as any;
    const optionsBefore = ref.chartJSState.chart.config.options;

    data.datasets[0].data = [4, 3, 2, 1];
    await settle();

    expect(ref.chartJSState.chart.data.datasets[0].data).toEqual([4, 3, 2, 1]);
    expect(ref.chartJSState.chart.config.options).toBe(optionsBefore);
  });

  it('costs a single update per change', async () => {
    const data = reactive(getDoughnutProps().data);
    const wrapper = factory({ ...getDoughnutProps(), data });
    await settle();
    const atRest = wrapper.emitted('afterUpdate')?.length ?? 0;

    data.datasets[0].data = [1, 2, 3, 4];
    await settle();
    expect((wrapper.emitted('afterUpdate')?.length ?? 0) - atRest).toEqual(1);

    data.labels = ['w', 'x', 'y', 'z'];
    await settle();
    expect((wrapper.emitted('afterUpdate')?.length ?? 0) - atRest).toEqual(2);
  });
});

describe('autoUpdate opt-out', () => {
  const settle = async () => {
    for (let i = 0; i < 4; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      await nextTick();
    }
  };

  // chart.data is the props object by reference, so its contents follow a
  // mutation either way. What autoUpdate governs is whether the chart is
  // told to redraw, which is what the emitted hooks record.
  const updates = (wrapper: ReturnType<typeof factory>) =>
    wrapper.emitted('afterUpdate')?.length ?? 0;

  it('does not redraw on prop changes when disabled', async () => {
    const data = reactive(getDoughnutProps().data);
    const wrapper = factory({ ...getDoughnutProps(), data, autoUpdate: false });
    const ref = wrapper.vm as any;
    const before = updates(wrapper);

    data.datasets[0].data = [9, 9, 9, 9];
    await wrapper.setProps({ options: { responsive: false } });
    await settle();

    expect(updates(wrapper)).toEqual(before);
  });

  it('does not rebuild on a type change when disabled', async () => {
    const wrapper = factory({ ...getDoughnutProps(), autoUpdate: false });
    const ref = wrapper.vm as any;

    await wrapper.setProps({ type: 'bar' });
    await settle();

    expect(ref.chartJSState.chart.config.type).toEqual('doughnut');
    expect(wrapper.emitted('afterDestroy')).toBeUndefined();
  });

  it('still applies an explicit update() when disabled', async () => {
    const wrapper = factory({ ...getDoughnutProps(), autoUpdate: false });
    const ref = wrapper.vm as any;
    const before = updates(wrapper);

    ref.update();

    expect(updates(wrapper)).toEqual(before + 1);
  });

  it('starts and stops watching as the prop is toggled', async () => {
    const data = reactive(getDoughnutProps().data);
    const wrapper = factory({ ...getDoughnutProps(), data, autoUpdate: false });

    await wrapper.setProps({ autoUpdate: true });
    const enabled = updates(wrapper);
    data.datasets[0].data = [1, 1, 1, 1];
    await settle();
    expect(updates(wrapper)).toEqual(enabled + 1);

    await wrapper.setProps({ autoUpdate: false });
    const disabled = updates(wrapper);
    data.datasets[0].data = [2, 2, 2, 2];
    await settle();
    expect(updates(wrapper)).toEqual(disabled);
  });
});
