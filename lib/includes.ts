import { Ref, VNodeRef, EmitFn } from 'vue';

const chartJsEventNames: string[] = [
  'install',
  'uninstall',
  'beforeInit',
  'resize',
  'afterInit',
  'start',
  'stop',
  'beforeUpdate',
  'beforeLayout',
  'beforeDataLimits',
  'afterDataLimits',
  'beforeBuildTicks',
  'afterBuildTicks',
  'afterLayout',
  'beforeElementsUpdate',
  'beforeDatasetsUpdate',
  'beforeDatasetUpdate',
  'afterDatasetUpdate',
  'afterDatasetsUpdate',
  'afterUpdate',
  'beforeRender',
  'beforeDraw',
  'beforeDatasetsDraw',
  'beforeDatasetDraw',
  'afterDatasetDraw',
  'afterDatasetsDraw',
  'beforeTooltipDraw',
  'afterTooltipDraw',
  'afterDraw',
  'afterRender',
  'reset',
  'beforeDestroy',
  'afterDestroy',
  'beforeEvent',
  'afterEvent',
];

/** Transition mode accepted by the exposed update() method. */
type UpdateMode = 'resize' | 'reset' | 'default' | 'none' | 'hide' | 'show' | 'active';

/** Payload passed to every emitted chart.js event. */
interface EventObject {
  type: string;
  chartRef?: Ref<VNodeRef | null>;
  preventDefault: () => void;
  isDefaultPrevented: () => boolean;
  _defaultPrevented: boolean;
}

function generateEventObject(type: string, chartRef?: Ref<VNodeRef | null>): EventObject {
  return {
    type: type,
    chartRef: chartRef,
    preventDefault() {
      this._defaultPrevented = true;
    },
    isDefaultPrevented() {
      return this._defaultPrevented;
    },
    _defaultPrevented: false,
  };
}

function generateChartJsEventListener(emit: EmitFn, event: EventObject) {
  return {
    [event.type]: () => {
      // one event object is shared by every emission of this hook, so the flag
      // has to be cleared first: otherwise a single preventDefault() would keep
      // cancelling for the lifetime of the chart
      event._defaultPrevented = false;

      emit(event.type, event);

      // chart.js cancels a cancellable hook when it returns false
      return !event.isDefaultPrevented();
    }
  };
}

export {
  chartJsEventNames,
  generateEventObject,
  generateChartJsEventListener,
};

export type {
  EventObject,
  UpdateMode,
};
