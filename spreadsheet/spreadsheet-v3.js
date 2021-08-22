const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const creds = require(`./client_secret`);

async function getInfo(sheetId) {
  const doc = new GoogleSpreadsheet(sheetId);
  await promisify(doc.useServiceAccountAuth)(creds);
  return await promisify(doc.getInfo)();
}

async function getCells(sheet) {
  return await getCellsRowCol(sheet, 1, sheet.rowCount, 1, sheet.colCount);
}

async function getCellsLimited(sheet, rows, cols) {
  return await getCellsRowCol(sheet, 1, rows, 1, cols);
}

async function getCellsRowCol(sheet, rowStart, rowEnd, colStart, colEnd) {
  return await promisify(sheet.getCells)({
    'min-row': rowStart,
    'max-row': rowEnd,
    'min-col': colStart,
    'max-col': colEnd,
    'return-empty': true,
  });
}

function getCell(cells, row, column, columns) {
  return cells[(row - 1) * columns + column - 1];
}

async function updateCell(input, tabIndex, row, col, value) {
  var info = typeof input === 'string' ? await getInfo(input) : input;
  var sheet = info.worksheets[tabIndex];
  var cells = await getCellsLimited(sheet, row, col);
  var cell = getCell(cells, row, col, col);
  cell.setValue(value);
  await sheet.bulkUpdateCells(cells);
}

module.exports = { getInfo, getCells, getCellsLimited, getCell, updateCell }