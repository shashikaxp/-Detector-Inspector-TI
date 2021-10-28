import { createChartImage } from './util/createChartImage';
import { getChartData } from './util/getChartDetails';

async function fetchHTML() {
  try {
    const url = process.argv[2];
    const chartData = await getChartData(url);
    createChartImage(chartData);
    console.log('Chart generated');
  } catch (error) {
    console.log('Sorry, could not find matching data to generate a chart');
  }
}

fetchHTML();
