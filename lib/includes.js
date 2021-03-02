const chartJsEventNames = [
  'beforeInit',
  'afterInit',
  'beforeUpdate',
  'afterUpdate',
  'beforeLayout',
  'afterLayout',
  'beforeDatasetsUpdate',
  'afterDatasetsUpdate',
  'beforeDatasetUpdate',
  'afterDatasetUpdate',
  'beforeRender',
  'afterRender',
  'beforeDraw',
  'afterDraw',
  'beforeDatasetsDraw',
  'afterDatasetsDraw',
  'beforeDatasetDraw',
  'afterDatasetDraw',
  'beforeEvent',
  'afterEvent',
  'resize',
  'destroy'
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
