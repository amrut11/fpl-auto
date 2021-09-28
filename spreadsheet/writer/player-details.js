const fplService = require('../request/fpl-service');
const ssService = require('../../spreadsheet/spreadsheet-service');

const fpl = new fplService();

async function getDetails() {
  await fpl.init(1000);
  var elements = fpl.getElements();
  var msg = '';
  for (var i in elements) {
    var name = fpl.getPlayerName(elements[i].id);
    var type = fpl.getPlayerPosition(elements[i].element_type);
    msg += name + '%' + type + '$';
  }
  console.dir(msg);
  ssService.updateValue(process.env.H2H_FIXTURE_SHEET_ID, 'PlayerData', 1, 8, msg);
  return msg;
}

module.exports = { getDetails }