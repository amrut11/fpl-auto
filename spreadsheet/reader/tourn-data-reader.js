const ssService = require('../spreadsheet-service');

const LAST_ROW_NUM = 13;

async function readLive(sheet) {
  var scoreCells = await ssService.getCells(sheet);
  var scores = '';
  for (var i = 1; i <= LAST_ROW_NUM; i++) {
    scores += ssService.getCell(scoreCells, i, 1, 4).value + '\t';
    scores += ssService.getCell(scoreCells, i, 2, 4).value + '\t';
    scores += ssService.getCell(scoreCells, i, 3, 4).value + '\t';
    scores += ssService.getCell(scoreCells, i, 4, 4).value + '\t';
    scores += '\n';
  }
  return scores;
}

async function readFinal(sheet) {
  var scoreCells = await ssService.getCells(sheet);
  return ssService.getCell(scoreCells, 2, 2, 2).value;
}

async function readDiffs(sheet) {
  var scoreCells = await ssService.getCells(sheet);
  return ssService.getCell(scoreCells, 2, 1, 2).value;
}

module.exports = { readLive, readFinal, readDiffs }