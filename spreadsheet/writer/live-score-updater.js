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
  var sheet = await ssService.getSheet(SHEET_ID, TAB_INDEX);
  var liveScores = scoreService.getLiveScores(fpl, gw);
  updateBonus(fpl, liveScores.bonusPoints, sheet);
  updateBasePoints(fpl, liveScores.basePoints, sheet);
  await sheet.saveUpdatedCells();
}

function updateBonus(fpl, bonusPoints, sheet) {
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
  sheet.getCell(0, 2).value = bonus;
}

function updateBasePoints(fpl, basePoints, sheet) {
  var players = '',
    points = '';
  for (var i in basePoints) {
    players += fpl.getPlayerName(i) + '|';
    points += basePoints[i] + '|';
  }
  sheet.getCell(0, 0).value = players;
  sheet.getCell(0, 1).value = points;
}

module.exports = {
  updateLive
}