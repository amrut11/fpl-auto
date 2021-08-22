const ssService = require('../spreadsheet-service');

const LAST_ROW_NUM = 13;

async function readLive(sheet) {
  await ssService.loadCells(sheet);
  var scores = '';
  for (var i = 1; i <= LAST_ROW_NUM; i++) {
    scores += ssService.getValue(sheet, i, 1) + '\t';
    scores += ssService.getValue(sheet, i, 2) + '\t';
    scores += ssService.getValue(sheet, i, 3) + '\t';
    scores += ssService.getValue(sheet, i, 4) + '\t';
    scores += '\n';
  }
  return scores;
}

async function readFinal(sheet) {
  await ssService.loadCells(sheet);
  return ssService.getValue(sheet, 2, 2);
}

async function readDiffs(sheet) {
  await ssService.loadCells(sheet);
  return ssService.getValue(sheet, 2, 1);
}

module.exports = { readLive, readFinal, readDiffs }