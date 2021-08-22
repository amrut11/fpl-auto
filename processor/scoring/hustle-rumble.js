const ssService = require('../../spreadsheet/spreadsheet-service');
const scoreService = require('./live-gw-score-service');
const fplTeam = require('../request/fpl-team');

const RUMBLE_SHEET_ID = process.env.HUSTLE_RUMBLE_SHEET_ID;

const ELIMINATIONS = [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 14, 7, 7, 13, 15, 17];

async function eliminations(fpl) {
  var gw = await fpl.init(1000);
  var msg = '*LIVE ELIMINATIONS FOR GW ' + gw + '*\n---------------------';
  var elimCount = ELIMINATIONS[gw];
  var playerDetails = await getPlayersDetails(fpl, gw);
  playerDetails.sort((a, b) => (b.score - a.score));
  for (var currCount = 0, currScore = -1000, i = playerDetails.length - 1; i >= 0; i--) {
    var detail = playerDetails[i];
    if (currScore < detail.score) {
      if (currCount >= elimCount && detail.lives <= 1) {
        break;
      }
      currScore = detail.score;
    }
    msg += '\n*' + detail.name + '*: ' + detail.score;
    if (detail.lives >= 1) {
      msg += ' *(life!)*';
    } else {
      currCount++;
    }
  }
  return msg;
}

async function getPlayersDetails(fpl, gw) {
  let players = [];
  var info = await ssService.getInfo(RUMBLE_SHEET_ID);
  var sheet = info.worksheets[3];
  var cells = await ssService.getCellsLimited(sheet, 200, 8);
  var liveScores = fpl.isGwOngoing() ? scoreService.getLivePoints(fpl, gw) : null;
  for (var rowNum = 3; ; rowNum++) {
    var status = ssService.getCell(cells, rowNum, 7, 8).value;
    if (status === '') {
      break;
    }
    if (status != 'Active') {
      continue;
    }
    var pName = ssService.getCell(cells, rowNum, 4, 8).value;
    var fplId = ssService.getCell(cells, rowNum, 6, 8).value;
    var playerData = await fplTeam.getPlayerData(fpl, fplId, gw, liveScores);
    var lives = ssService.getCell(cells, rowNum, 8, 8).value;
    var playerDetail = { name: pName, score: playerData.score, status: status, lives: lives };
    players.push(playerDetail);
  }
  return players;
}

module.exports = { eliminations }