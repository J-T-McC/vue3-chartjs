export interface DoughnutProps {
  id: string;
  type: string;
  width?: number;
  height?: number;
  data: {
    labels: string[];
    datasets: {
      backgroundColor: string[];
      data: number[];
    }[];
  };
  options?: {
    responsive?: boolean;
    plugins?: {
      title?: {
        display?: boolean;
        text?: string;
      }
    };
  };
  plugins?: [];
}

const getDoughnutProps = (): DoughnutProps => {
  return {
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
      responsive: true
    },
  }
}

export {
  getDoughnutProps,
}
