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

const kebabCase = (string) => {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

export {
  chartJsEventNames,
  kebabCase
}
