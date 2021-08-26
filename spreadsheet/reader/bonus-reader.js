const ssService = require('../spreadsheet-service');

const SHEET_ID = process.env.LIVE_SHEET_ID;

const TAB_INDEX = 0;

async function readBonus(fpl) {
  var gw = await fpl.init(1000);
  var msg = '*LIVE FPL BONUS POINTS FOR GW ' + fpl.getCurrentEvent() + '*';
  msg += '\n---------------------';
  var sheet = await ssService.getSheet(SHEET_ID, TAB_INDEX);
  var rowNum = 1;
  while (true) {
    var fixture = ssService.getValue(sheet, rowNum++, 1);
    if (!fixture || fixture == '' || fixture.startsWith('#VALUE!') || rowNum > 110) {
      break;
    }
    var gameBonus = '';
    for (var i = 0; i < 6; i++) {
      var playerName = ssService.getValue(sheet, rowNum, 1);
      var bonusPoints = ssService.getValue(sheet, rowNum++, 2);
      if (playerName == '') {
        continue;
      }
      gameBonus += playerName + ': ' + bonusPoints + '\t';
    }
    if (gameBonus != '') {
      msg += '\n\n*' + fixture + '*\n';
      msg += gameBonus;
    }
  }
  return msg;
}

module.exports = { readBonus }