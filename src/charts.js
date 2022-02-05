const barChart = {
  id: 'bar',
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
      borderRadius: Number.MAX_VALUE,
      borderSkipped: false,
    }]
  },
  options: {
    scales: {
      x: {
        beginAtZero: true
      }
    }
  }
}

const doughnutChart = {
  id: 'doughnut',
  type: 'doughnut',
  data: {
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    datasets: [
      {
        backgroundColor: [
          '#41B883',
          '#E46651',
          '#00D8FF',
          '#DD1B16'
        ],
        data: [40, 20, 80, 10]
      }
    ]
  },
  options: {
    plugins: {
      zoom: {
        zoom: {
          enabled: true,
          mode: 'xy',
        }
      }
    }
  }
}

export {
  barChart,
  doughnutChart
}