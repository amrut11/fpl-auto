const ssService = require('../spreadsheet-service');
const iplService = require('../../processor/request/ipl-service');

const dateUtils = require('../../utils/date-utils');

const ipl = new iplService();

const SHEET_ID = process.env.IPL_SCORE_SHEET_ID;
const GAME_NUMBER = parseInt(process.env.IPL_GAME_NO);

async function updateScores() {
  await ipl.init(GAME_NUMBER);
  var innings = ipl.getInnings();
  if (innings.length > 0) {
    var batStats = innings[0].scorecard.battingStats;
    var bowlStats = innings[0].scorecard.bowlingStats;
    if (innings.length > 1) {
      batStats = batStats.concat(innings[1].scorecard.battingStats);
      bowlStats = bowlStats.concat(innings[1].scorecard.bowlingStats);
    }
    var batMsg = createBatMsg(batStats);
    var bowlMsg = createBowlMsg(bowlStats);
    var msg = batMsg + '%' + bowlMsg + '%' + dateUtils.getISTTimeSeconds();
    ssService.updateCell(SHEET_ID, 0, 1, 1, msg);
  }
}

function createBatMsg(batStats) {
  var msg = '';
  var fieldStats = getFieldStats(batStats);
  for (var i in batStats) {
    var batStat = batStats[i];
    var playerId = batStat.playerId;
    msg += ipl.getPlayerName(playerId) + ',';
    msg += batStat.r + ',' + batStat.b + ',' + batStat['4s'] + ',' + batStat['6s'] + ',';
    msg += batStat.mod ? 'Y' : 'N';
    if (fieldStats[playerId]) {
      msg += ',' + fieldStats[playerId];
      delete fieldStats[playerId];
    }
    msg += '^';
  }
  for (var i in fieldStats) {
    msg += ipl.getPlayerName(i) + ',0,0,0,0,N,' + fieldStats[i];
    msg += '^';
  }
  return msg;
}

function getFieldStats(batStats) {
  var stats = new Object();
  for (var i in batStats) {
    var batStat = batStats[i];
    if (batStat.mod) {
      var points = batStat.mod.dismissedMethod == 'st' ? 15 : 10;
      var fielders = batStat.mod.additionalPlayerIds;
      if (fielders) {
        fielders.forEach(function(pId) {
          if (stats[pId]) {
            stats[pId] += points;
          } else {
            stats[pId] = points;
          }
        });
      }
    }
  }
  return stats;
}

function createBowlMsg(bowlStats) {
  var msg = '';
  for (var i in bowlStats) {
    var bowlStat = bowlStats[i];
    msg += ipl.getPlayerName(bowlStat.playerId) + ',';
    msg += bowlStat.ov + ',' + bowlStat.maid + ',' + bowlStat.r + ',' + bowlStat.w + ',' + bowlStat.d;
    msg += '^';
  }
  return msg;
}


module.exports = { updateScores }