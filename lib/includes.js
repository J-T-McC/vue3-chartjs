const chartJsEventNames = [
  "install",
  "start",
  "stop",
  'beforeInit',
  'afterInit',
  'beforeUpdate',
  'afterUpdate',
  'beforeElementsUpdate',
  'reset',
  'beforeDatasetsUpdate',
  'afterDatasetsUpdate',
  'beforeDatasetUpdate',
  'afterDatasetUpdate',
  'beforeLayout',
  'afterLayout',
  'afterLayout',
  'beforeRender',
  'afterRender',
  'resize',
  'destroy',
  'uninstall',
  'afterTooltipDraw',
  'beforeTooltipDraw',
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
