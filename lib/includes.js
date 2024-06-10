const chartJsEventNames = [
  "install",
  'uninstall',
  'beforeInit',
  'resize',
  'afterInit',
  "start",
  "stop",
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
]

function generateEventObject(type , chartRef = null) {
  //chart js allows some events to be cancelled if they return false
  //this implements familiar logic to allow vue emitted chart events to be canceled
  return {
    type: type,
    chartRef: chartRef,
    preventDefault () {
      this._defaultPrevented = true
    },
    isDefaultPrevented () {
      return !this._defaultPrevented
    },
    _defaultPrevented: false,
  }
}

function generateChartJsEventListener(emit, event) {
  return {
    [event.type]: () => {
      emit(event.type, event)
      return event.isDefaultPrevented()
    }
  }
}

export {
  chartJsEventNames,
  generateEventObject,
  generateChartJsEventListener,
}
