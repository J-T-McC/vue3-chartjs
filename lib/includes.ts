import { Ref, VNodeRef } from 'vue';

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
  'resize',
  'reset',
  'beforeDestroy',
  'afterDestroy',
  'beforeEvent',
  'afterEvent',
];

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
      return !this._defaultPrevented;
    },
    _defaultPrevented: false,
  };
}

function generateChartJsEventListener(emit: (event: string, ...args: any[]) => void, event: EventObject) {
  return {
    [event.type]: () => {
      emit(event.type, event);

      return event.isDefaultPrevented();
    }
  };
}

export {
  chartJsEventNames,
  generateEventObject,
  generateChartJsEventListener,
};