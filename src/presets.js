const presets = {
  doughnut: {
    type: 'doughnut',
    data: {
      labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
      datasets: [
        {
          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
          data: [40, 20, 80, 10]
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  },
  bar: {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: '#41B883',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } }
    }
  },
  line: {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#41B883',
          tension: 0.3
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  },
  pie: {
    type: 'pie',
    data: {
      labels: ['Cats', 'Dogs', 'Hamsters', 'Dragons'],
      datasets: [
        {
          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
          data: [100, 20, 80, 20]
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  },
  radar: {
    type: 'radar',
    data: {
      labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
      datasets: [
        {
          label: 'Model A',
          data: [65, 75, 70, 80, 60],
          borderColor: '#41B883',
          backgroundColor: 'rgba(65, 184, 131, 0.2)'
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  },
  scatter: {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Samples',
          data: [
            { x: -10, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 5 }, { x: 15, y: 22 },
            { x: 22, y: 14 }, { x: 30, y: 28 }, { x: 38, y: 19 }
          ],
          backgroundColor: '#41B883'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { x: { type: 'linear', position: 'bottom' } }
    }
  },
  bubble: {
    type: 'bubble',
    data: {
      datasets: [
        {
          label: 'Clusters',
          data: [
            { x: 10, y: 20, r: 8 }, { x: 15, y: 10, r: 14 }, { x: 26, y: 12, r: 6 },
            { x: 30, y: 25, r: 20 }, { x: 40, y: 18, r: 11 }
          ],
          backgroundColor: 'rgba(65, 184, 131, 0.6)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      // headroom so edge bubbles are not clipped by the axis bounds
      scales: { x: { min: 0, max: 50 }, y: { min: 0, max: 35 } }
    }
  },
  polarArea: {
    type: 'polarArea',
    data: {
      labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
      datasets: [
        {
          data: [11, 16, 7, 3, 14],
          backgroundColor: ['#DD1B16', '#41B883', '#E4C441', '#9AA0A6', '#00D8FF']
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  }
}

export { presets }
