const ssService = require('../spreadsheet-service');
const scoreService = require('../../processor/scoring/live-gw-score-service');
const sorter = require('../../utils/sorter');

const SHEET_ID = process.env.LIVE_SHEET_ID;
const TAB_INDEX = 3;

async function updateLive(fpl, gw) {
  if (!fpl.isAnyLiveMatch()) {
    console.log('No live score update needed');
    return;
  }
  var info = await ssService.getInfo(SHEET_ID);
  var sheet = info.worksheets[TAB_INDEX];
  var cells = await ssService.getCells(sheet);
  var liveScores = scoreService.getLiveScores(fpl, gw);
  updateBonus(fpl, liveScores.bonusPoints, cells);
  updateBasePoints(fpl, liveScores.basePoints, cells);
  await sheet.bulkUpdateCells(cells);
}

function updateBonus(fpl, bonusPoints, cells) {
  var bonus = '';
  for (var i in bonusPoints) {
    var bp = bonusPoints[i];
    bonus += bp['fix-header'] + '/';
    var fixBonus = sorter.sort(bp['fix-bonus']);
    for (var j in fixBonus) {
      bonus += fpl.getPlayerName(fixBonus[j][0]) + '#' + fixBonus[j][1] + ':';
    }
    bonus += ',';
  }
  var cell = ssService.getCell(cells, 1, 3, 3);
  cell.setValue(bonus);
}

function updateBasePoints(fpl, basePoints, cells) {
  var players = '', points = '';
  for (var i in basePoints) {
    players += fpl.getPlayerName(i) + '|';
    points += basePoints[i] + '|';
  }

  var playerCell = ssService.getCell(cells, 1, 1, 3);
  playerCell.setValue(players);
  var pointsCell = ssService.getCell(cells, 1, 2, 3);
  pointsCell.setValue(points);
}

module.exports = { updateLive }