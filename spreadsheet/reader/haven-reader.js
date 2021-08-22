const ssService = require('../spreadsheet-service');
const sorter = require('../../utils/sorter');

const FIXTURE_SHEET_ID = process.env.HAVEN_FIXTURE_SHEET_ID;

const HLL = {  'name': 'HLL',  'fixIndex': 0,  'bonusRow': 3};
const HPL = {  'name': 'HPL',  'fixIndex': 1,  'bonusRow': 20};
const BONUS_INDEX = 6;
const FACUP_INDEX = 6; // TBD
const HCL_INDEX = 9; // TBD
const HMT_INDEX = 10; // TBD

const FIX_NO_OF_COLS = 9;
const BONUS_NO_OF_COLS = 19;
const FACUP_NO_OF_COLS = 5;
const HCL_NO_OF_COLS = 22;
const HMT_NO_OF_COLS = 11;

const FIX_ROW_MAP = [0, 3, 3, 8, 8, 13, 13, 18, 18, 23, 23, 28, 28, 28, 33, 33, 38, 38, 43, 43, 48, 48, 48, 53, 53, 58, 58, 63, 63, 68, 68, 73, 73, 78, 78, 83, 83, 88, 88];
const BONUS_COL_MAP = [0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19];
const HMT_ROW_MAP = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 39, 0, 75, 0, 95, 0, 107, 0, 115, 115, 0, 121];

async function getScores(fpl) {
  var info = await ssService.getInfo(FIXTURE_SHEET_ID);
  var gw = await fpl.init(1000);
  var msg = await getLeagueScores(gw, info, HLL);
  msg += ':::';
  msg += await getLeagueScores(gw, info, HPL);
  //msg += await getFaCupScores(info);
  // msg += await getHclScores(gw, info);
  var hmtRow = HMT_ROW_MAP[gw];
  if (hmtRow > 0) {
    msg += ':::';
    msg += await getHmtScores(hmtRow, info);
  }
  return msg;
}

async function getLeagueScores(gw, info, league) {
  var msg = '*LIVE OVERALL ' + league.name + ' SCORES*';
  msg += '\n---------------------';
  var fixtureCells = await ssService.getCells(info.worksheets[league.fixIndex]);
  msg += getFixtureScores(fixtureCells, gw);
  msg += '\n\n=====================\n\n';
  msg += '*LIVE BONUS SCORES*';
  msg += '\n---------------------';
  var bonusCells = await ssService.getCells(info.worksheets[BONUS_INDEX]);
  msg += getBonusScores(bonusCells, gw,league.bonusRow);
  return msg;
}

function getFixtureScores(cells, gw) {
  var rowNumber = FIX_ROW_MAP[gw];
  var output = '';
  for (var i = 0; i < 5; i++) {
    var homeTeam = ssService.getCell(cells, rowNumber + i, 2, FIX_NO_OF_COLS).value;
    var homeScore = ssService.getCell(cells, rowNumber + i, 3, FIX_NO_OF_COLS).value;
    var margin = ssService.getCell(cells, rowNumber + i, 4, FIX_NO_OF_COLS).value;
    var awayScore = ssService.getCell(cells, rowNumber + i, 5, FIX_NO_OF_COLS).value;
    var awayTeam = ssService.getCell(cells, rowNumber + i, 6, FIX_NO_OF_COLS).value;
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

function getBonusScores(cells, gw, bonusRow) {
  var colNumber = BONUS_COL_MAP[gw];
  var bonuses = new Object();
  for (var i = bonusRow; i < bonusRow + 10; i++) {
    var teamName = ssService.getCell(cells, i, 1, BONUS_NO_OF_COLS).value;
    var score = ssService.getCell(cells, i, colNumber, BONUS_NO_OF_COLS).value;
    bonuses[teamName] = score;
  }
  bonuses = sorter.sort(bonuses);
  var output = '';
  var scores = Object.values(bonuses);
  for (var i = 0; i < scores.length; i++) {
    var score = scores[i];
    output += '\n*' + score[0] + '* - ' + score[1];
  }
  return output;
}

async function getFaCupScores(info) {
  var msg = '*LIVE FACUP SCORES*';
  msg += '\n---------------------';
  var faCupCells = await ssService.getCells(info.worksheets[FACUP_INDEX]);
  msg += getSfScores(faCupCells);
  return msg;
}

function getSfScores(cells) {
  var output = '';
  for (var i = 0; i < 1; i++) {
    var colNumber = i * 5 + 1;
    var homeTeam = ssService.getCell(cells, 4, colNumber, FACUP_NO_OF_COLS).value;
    var homeScore = ssService.getCell(cells, 14, colNumber + 3, FACUP_NO_OF_COLS).value;
    var awayTeam = ssService.getCell(cells, 15, colNumber, FACUP_NO_OF_COLS).value;
    var awayScore = ssService.getCell(cells, 25, colNumber + 3, FACUP_NO_OF_COLS).value;
    var margin = ssService.getCell(cells, 27, colNumber + 2, FACUP_NO_OF_COLS).value;
    if (homeScore > awayScore) {
      output += '\n*' + homeTeam + ' - ' + homeScore + '* (' + margin + ') ' + awayScore + ' - ' + awayTeam;
    } else {
      output += '\n' + homeTeam + ' - ' + homeScore + ' (' + margin + ') *' + awayScore + ' - ' + awayTeam + '*';
    }
  }
  return output;
}

async function getHclScores(gw, info) {
  var msg = '*LIVE CL SCORES*';
  msg += '\n---------------------';
  var hclCells = await ssService.getCells(info.worksheets[HCL_INDEX]);
  msg += getHclRoundScores(gw, hclCells);
  return msg;
}

function getHclRoundScores(gw, cells) {
  var output = '';
  var rowNum = (gw - 22) * 10 + 5;
  for (var i = 0; i < 7; i++) {
    var homeTeam = ssService.getCell(cells, rowNum + i, 2, HCL_NO_OF_COLS).value;
    var homeScore = ssService.getCell(cells, rowNum + i, 3, HCL_NO_OF_COLS).value;
    var margin = ssService.getCell(cells, rowNum + i, 4, HCL_NO_OF_COLS).value;
    var awayScore = ssService.getCell(cells, rowNum + i, 5, HCL_NO_OF_COLS).value;
    var awayTeam = ssService.getCell(cells, rowNum + i, 6, HCL_NO_OF_COLS).value;
    if (homeTeam) {
      if (homeScore > awayScore) {
        output += '\n*' + homeTeam + ' - ' + homeScore + '* (' + margin + ') ' + awayScore + ' - ' + awayTeam;
      } else {
        output += '\n' + homeTeam + ' - ' + homeScore + ' (' + margin + ') *' + awayScore + ' - ' + awayTeam + '*';
      }
    }
  }
  return output;
}

async function getHmtScores(rowNum, info) {
  var msg = '*LIVE HMT SCORES*';
  msg += '\n---------------------';
  var hmtCells = await ssService.getCells(info.worksheets[HMT_INDEX]);
  msg += getHmtRoundScores(rowNum, hmtCells);
  return msg;
}

function getHmtRoundScores(rowNum, cells) {
  var output = '';
  var i = 0;
  while (true) {
    var player1 = ssService.getCell(cells, rowNum + i, 6, HMT_NO_OF_COLS).value;
    if (!player1 || player1 == '') {
      break;
    }
    var p1Score = ssService.getCell(cells, rowNum + i, 7, HMT_NO_OF_COLS).value;
    var margin = ssService.getCell(cells, rowNum + i, 8, HMT_NO_OF_COLS).value;
    var p2Score = ssService.getCell(cells, rowNum + i, 9, HMT_NO_OF_COLS).value;
    var player2 = ssService.getCell(cells, rowNum + i, 10, HMT_NO_OF_COLS).value;
    if (p1Score > p2Score) {
      output += '\n*' + player1 + ' - ' + p1Score + '* (' + margin + ') ' + p2Score + ' - ' + player2;
    } else {
      output += '\n' + player1 + ' - ' + p1Score + ' (' + margin + ') *' + p2Score + ' - ' + player2 + '*';
    }
    i++;
  }
  return output;
}

module.exports = { getScores }