const ssService = require('../spreadsheet-service');
const sorter = require('../../utils/sorter');

const FIXTURE_SHEET_ID = process.env.HAVEN_FIXTURE_SHEET_ID;
const CUP_SHEET_ID = process.env.HAVEN_CUP_SHEET_ID;

const HLL = { 'name': 'HLL', 'fixIndex': 0, 'bonusRow': 3 };
const HPL = { 'name': 'HPL', 'fixIndex': 1, 'bonusRow': 20 };
const BONUS_INDEX = 6;

const FIX_ROW_MAP = [0, 3, 3, 8, 8, 13, 13, 18, 18, 23, 23, 28, 28, 28, 33, 33, 38, 38, 43, 43, 48, 48, 48, 53, 53, 58, 58, 63, 63, 68, 68, 73, 73, 78, 78, 83, 83, 88, 88];
const BONUS_COL_MAP = [0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19];
const HMT_ROW_MAP = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 71, 0, 139, 0, 175, 0, 195, 0, 207, 0, 215, 215, 0, 221, 0, 0];
const HCL_ROW_MAP = [164, 174, 184, 190, 196, 200, 204];

async function getScores(fpl) {
  var doc = await ssService.getDoc(FIXTURE_SHEET_ID);
  var gw = await fpl.init(1000);
  var msg = await getLeagueScores(gw, doc, HLL);
  msg += ':::' + await getLeagueScores(gw, doc, HPL);
  if (gw >= 8 && gw <= 16) {
    msg += ':::' + await getCupScores(gw, doc, 3);
    msg += ':::' + await getCupScores(gw, doc, 17);
  }
  if (gw >= 32 && gw <= 37) {
    msg += ':::' + await getHclScores(gw);
  }
  var hmtRow = HMT_ROW_MAP[gw];
  if (hmtRow > 0) {
    msg += ':::' + await getHmtScores(hmtRow);
  }
  return msg;
}

async function getLeagueScores(gw, doc, league) {
  var msg = '*LIVE OVERALL ' + league.name + ' SCORES*';
  msg += '\n---------------------';
  var fixtureSheet = await ssService.getSheetFromDoc(doc, league.fixIndex);
  msg += getFixtureScores(fixtureSheet, gw);
  msg += '\n\n=====================\n\n';
  msg += '*LIVE BONUS SCORES*';
  msg += '\n---------------------';
  var bonusSheet = await ssService.getSheetFromDoc(doc, BONUS_INDEX);
  msg += getBonusScores(bonusSheet, gw, league.bonusRow);
  return msg;
}

function getFixtureScores(sheet, gw) {
  var rowNumber = FIX_ROW_MAP[gw];
  var output = '';
  for (var i = 0; i < 5; i++) {
    var homeTeam = ssService.getValue(sheet, rowNumber + i, 2);
    var homeScore = ssService.getValue(sheet, rowNumber + i, 3);
    var margin = ssService.getValue(sheet, rowNumber + i, 4);
    var awayScore = ssService.getValue(sheet, rowNumber + i, 5);
    var awayTeam = ssService.getValue(sheet, rowNumber + i, 6);
    if (margin < 10) {
      output += '\n*' + homeTeam + ' - ' + homeScore + '* (' + margin + ') *' + awayScore + ' - ' + awayTeam + '*';
    } else if (homeScore > awayScore) {
      output += '\n*' + homeTeam + ' - ' + homeScore + '* (' + margin + ') ' + awayScore + ' - ' + awayTeam;
    } else {
      output += '\n' + homeTeam + ' - ' + homeScore + ' (' + margin + ') *' + awayScore + ' - ' + awayTeam + '*';
    }
  }
  return output;
}

function getBonusScores(sheet, gw, bonusRow) {
  var colNumber = BONUS_COL_MAP[gw];
  var bonuses = new Object();
  for (var i = bonusRow; i < bonusRow + 10; i++) {
    var teamName = ssService.getValue(sheet, i, 1);
    var score = ssService.getValue(sheet, i, colNumber);
    bonuses[teamName] = score;
  }
  bonuses = sorter.sort(bonuses);
  var output = '';
  for (var i in bonuses) {
    output += '\n*' + bonuses[i][0] + '* - ' + bonuses[i][1];
  }
  return output;
}

async function getCupScores(gw, doc, colIndex) {
  var sheet = await ssService.getSheetFromDoc(doc, 'Cups');
  var startRow = 2 + (gw - 8) * 13;
  var scores = new Object();
  for (var i = 2; i < 12; i++) {
    var score = ssService.getValue(sheet, startRow + i, colIndex + 9);
    if (score == 'ELIM') {
      break;
    }
    var teamName = ssService.getValue(sheet, startRow + i, colIndex);
    scores[teamName] = score;
  }
  scores = sorter.sort(scores);
  var msg = '*' + ssService.getValue(sheet, startRow, colIndex - 1) + '*';
  for (var i in scores) {
    msg += '\n*' + scores[i][0] + '* - ' + scores[i][1];
  }
  return msg;
}

async function getHclScores(gw) {
  var sheet = await ssService.getSheet(CUP_SHEET_ID, 'CL', 210, 6);
  var msg = '*LIVE CL SCORES*';
  msg += '\n---------------------';
  msg += getHclRoundScores(sheet, gw);
  return msg;
}

function getHclRoundScores(sheet, gw) {
  var msg = '';
  var rowNum = HCL_ROW_MAP[gw - 32];
  for (var i = 0; i < HCL_ROW_MAP[gw - 31] - rowNum; i++) {
    var homeTeam = ssService.getValue(sheet, rowNum + i, 2);
    if (!homeTeam || homeTeam == '') {
      msg += '\n---------------------';
      continue;
    }
    var homeScore = ssService.getValue(sheet, rowNum + i, 3);
    var margin = ssService.getValue(sheet, rowNum + i, 4);
    var awayScore = ssService.getValue(sheet, rowNum + i, 5);
    var awayTeam = ssService.getValue(sheet, rowNum + i, 6);
    if (homeScore > awayScore) {
      msg += '\n*' + homeTeam + ' - ' + homeScore + '* (' + margin + ') ' + awayScore + ' - ' + awayTeam;
    } else {
      msg += '\n' + homeTeam + ' - ' + homeScore + ' (' + margin + ') *' + awayScore + ' - ' + awayTeam + '*';
    }
  }
  return msg;
}

async function getHmtScores(rowNum) {
  var sheet = await ssService.getSheet(CUP_SHEET_ID, 'HMT-Qual', 250, 10);
  var msg = '*LIVE HMT SCORES*';
  msg += '\n---------------------';
  msg += getHmtRoundScores(sheet, rowNum);
  return msg;
}

function getHmtRoundScores(sheet, rowNum) {
  var msg = '';
  var i = 0;
  while (true) {
    var p1 = ssService.getValue(sheet, rowNum + i, 6);
    if (!p1 || p1 == '') {
      break;
    }
    var p1Score = ssService.getValue(sheet, rowNum + i, 7);
    var margin = ssService.getValue(sheet, rowNum + i, 8);
    var p2Score = ssService.getValue(sheet, rowNum + i, 9);
    var p2 = ssService.getValue(sheet, rowNum + i, 10);
    if (p1Score > p2Score) {
      msg += '\n*' + p1 + ' - ' + p1Score + '* (' + margin + ') ' + p2Score + ' - ' + p2;
    } else {
      msg += '\n' + p1 + ' - ' + p1Score + ' (' + margin + ') *' + p2Score + ' - ' + p2 + '*';
    }
    i++;
  }
  return msg;
}

module.exports = { getScores }