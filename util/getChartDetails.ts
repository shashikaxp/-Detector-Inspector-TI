import fetch from 'cross-fetch';
import * as cheerio from 'cheerio';

import { ChartData, Position } from './models/ChartData';

export async function getChartData(url: string): Promise<ChartData> {
  const response = await fetch(url);
  const body = await response.text();
  const $ = cheerio.load(body);
  const tableData = $('table').first();
  const title = $('#firstHeading').text();

  const { validColumnIndex, validWordIndex } = await getValidColumnDetails(
    tableData
  );

  if (validColumnIndex === -1 || validWordIndex === -1)
    throw Error('Not a valid url');

  // had to pass body string and load into cheerio object each time.
  // if I passed cheerio object it did not work.
  // tried deep cloning the object, still won't work

  return {
    data: getData(body, validColumnIndex, validWordIndex),
    label: getLabel(body, validColumnIndex),
    title: title,
  };
}

async function getValidColumnDetails(tableData: cheerio.Cheerio) {
  // Use second row to identify a cell with numeric value
  const rowContent = [];
  tableData.find('tr:nth-child(2) td').each((i, el) => {
    const $ = cheerio.load(el);
    rowContent.push($('td').text());
  });

  let validColumnIndex: number = -1;
  let validWordIndex: number = -1;

  for (let i = 0; i < rowContent.length; i++) {
    const cell = rowContent[i];
    const wordIndex = getValidCellWordIndex(cell);
    if (wordIndex > -1) {
      validColumnIndex = i;
      validWordIndex = wordIndex;
      break;
    }
  }

  return {
    validColumnIndex,
    validWordIndex,
  };
}

// some cell values are not numeric values (ex: '168.2 cm (5 ft 6 in)') , this function will identify which word is contains the
// numeric values and return the word index, so it can used when getting data to chart
function getValidCellWordIndex(data: string): number {
  const words = data.split(/\s/g);
  let wordIndex: number = -1;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    //@ts-ignore (isNaN in typescript expect a number as parameter,
    // which is not helpful so disable the ts check for next line)
    if (!isNaN(word)) {
      wordIndex = i;
      break;
    }
  }
  return wordIndex;
}

function getLabel(body: string, validHeaderIndex: number) {
  const $ = cheerio.load(body);
  const tableData = $('table').first();
  const rowContent = [];
  tableData.find('th').each((i, el) => {
    const $ = cheerio.load(el);
    rowContent.push($('th').text());
  });

  const updatedHeadings = rowContent.filter((heading) => heading !== '');
  const heading = updatedHeadings[validHeaderIndex];
  console.log(heading);
  return heading ? heading : 'Legend 1';
}

function getData(
  body: string,
  columnIndex: number,
  wordIndex: number
): Position[] {
  const $ = cheerio.load(body);
  const tableData = $('table').first();
  const columnsData = [];
  // change index to correct child element by adding 1
  tableData.find('tr').each((i, el) => {
    const $ = cheerio.load(el);
    columnsData.push($(`td:nth-child(${columnIndex + 1})`).text());
  });

  const filteredData = columnsData.filter((data) => {
    const wordsArray = data.split(/\s/g);
    return wordsArray[wordIndex] !== '' && !isNaN(wordsArray[wordIndex]);
  });

  // could not decide what to do for the x axes, so used hard code value (5)
  return filteredData.map((data) => {
    const wordsArray = data.split(/\s/g);
    return {
      y: Number(wordsArray[wordIndex]),
      x: 5,
    };
  });
}
