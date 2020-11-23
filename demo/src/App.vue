<template>
  <div style="height:600px;width: 600px;">
    <Vue3ChartJS
        v-bind="{...barChart}"
        @before-init="bar"
    ></Vue3ChartJS>

    <Vue3ChartJS
        v-bind="{...doughnutChart}"
        @before-init="doughtnut"
    ></Vue3ChartJS>

    <button type="submit" @click="updateDoughnut">TEST</button>
  </div>
</template>

<script>

import Vue3ChartJS from 'vue3-chartjs'

export default {
  name: 'App',
  components: {
    Vue3ChartJS
  },
  setup() {
    return {
      bar() {
        console.log('bar is before init')
      },
      doughtnut() {
        console.log('doughnut is before init')
      }
    }
  },

  data() {
    return {
      barChart: {
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
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      },

      doughnutChart: {
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
        }
      }
    }
  },
  methods: {
    updateDoughnut() {
      this.doughnutChart = {
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
              data: [30, 30, 70, 20]
            }
          ]
        }
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
