const ssService = require('../../spreadsheet/spreadsheet-service');
const scoreService = require('./live-gw-score-service');
const fplTeam = require('../request/fpl-team');

const RUMBLE_SHEET_ID = process.env.HUSTLE_RUMBLE_SHEET_ID;

const ELIMINATIONS = [0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 0];

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
  var sheet = await ssService.getSheet(RUMBLE_SHEET_ID, 'Lives', 203, 9);
  var liveScores = fpl.isGwOngoing() ? scoreService.getLivePoints(fpl, gw) : null;
  for (var rowNum = 3; ; rowNum++) {
    var status = ssService.getValue(sheet, rowNum, 7);
    if (status === '') {
      break;
    }
    if (status != 'Active') {
      continue;
    }
    var pName = ssService.getValue(sheet, rowNum, 4);
    var fplId = ssService.getValue(sheet, rowNum, 6);
    var playerData = await fplTeam.getPlayerData(fpl, fplId, gw, liveScores);
    var lives = ssService.getValue(sheet, rowNum, 9);
    var playerDetail = { name: pName, score: playerData.score, status: status, lives: lives };
    players.push(playerDetail);
  }
  return players;
}

module.exports = { eliminations }