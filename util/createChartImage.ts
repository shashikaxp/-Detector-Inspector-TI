import ChartJSImage from 'chart.js-image';
import { ChartData } from './models/ChartData';

export function createChartImage(chardData: ChartData) {
  const config = {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: chardData.label,
          data: chardData.data,
          pointStyle: {
            radius: '1px',
          },
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: chardData.title,
      },

      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: chardData.label,
            },
          },
        ],
      },
    },
  };

  //@ts-ignore
  const chart = ChartJSImage().chart(config).bkg('white');
  chart.toFile(chardData.title);
}
