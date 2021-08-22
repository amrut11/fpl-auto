const euroService = require('../../processor/request/euro-service');
const ssService = require('../spreadsheet-service');
const sorter = require('../../utils/sorter');

const EURO_DATA_SHEET_ID = process.env.EURO_DATA_SHEET_ID;

async function updatePlayerData() {
  console.log('Updating Euro player data');
  var euro = new euroService();
  await euro.init();
  var data = euro.getPlayerData();
  console.dir(data);
  var msg = 'Hi';
  await ssService.updateCell(EURO_DATA_SHEET_ID, 0, 1, 1, msg);
}

module.exports = { updatePlayerData }