const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require(`./client-secret`);

async function getDoc(sheetId) {
  const doc = new GoogleSpreadsheet(sheetId);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  return doc;
}

async function getSheet(sheetId, tabIndex, rows, cols) {
  var doc = await getDoc(sheetId);
  return getSheetFromDoc(doc, tabIndex, rows, cols);
}

async function getSheetFromDoc(doc, tabIndex, rows, cols) {
  var sheet = doc.sheetsByIndex[tabIndex];
  await loadCells(sheet, rows, cols);
  return sheet;
}

async function loadCells(sheet, rows, cols) {
  var rowIndex = rows ? rows : sheet.rowCount;
  var colIndex = cols ? cols : sheet.columnCount;
  await sheet.loadCells({
    startRowIndex: 0, endRowIndex: rowIndex, startColumnIndex: 0, endColumnIndex: colIndex
  });
}

function getValue(sheet, row, col) {
  var value = sheet.getCell(row - 1, col - 1).value;
  if (value == null) {
    value = '';
  }
  return value;
}

async function updateValue(input, tabIndex, row, col, value) {
  var doc = typeof input === 'string' ? await getDoc(input) : input;
  var sheet = doc.sheetsByIndex[tabIndex];
  await loadCells(sheet, row, col);
  var cell = sheet.getCell(row - 1, col - 1);
  cell.value = value;
  await sheet.saveUpdatedCells();
}

module.exports = { getDoc, getSheet, getSheetFromDoc, loadCells, getValue, updateValue }