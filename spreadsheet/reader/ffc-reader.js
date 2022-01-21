const ssService = require('../spreadsheet-service');

const CUP_SHEET_ID = process.env.FFC_CUP_SHEET_ID;

const FAC_ROW_MAP = [3, 12, 29, 38, 43, 46];
const CL_ROW_MAP = [0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19];

async function getScores(fpl) {
  var doc = await ssService.getDoc(CUP_SHEET_ID);
  var gw = await fpl.init(1000);
  var msg = ':::';
  if (gw >= 21 && gw <= 26) {
    msg += await getFacScores(gw, doc);
  } else if (gw >= 27 && gw <= 38) {
    msg += await getClScores(gw, doc);
  }
  return msg;
}

async function getFacScores(gw, doc) {
  var sheet = await ssService.getSheetFromDoc(doc, 'FAC');
  var startRow = FAC_ROW_MAP[gw - 21];
  var msg = '*LIVE FAC SCORES*';
  msg += '\n---------------------';
  for (var i = startRow; ; i++) {
    var homeTeam = ssService.getValue(sheet, i, 2);
    if (!homeTeam) {
      break;
    }
    var homeScore = ssService.getValue(sheet, i, 3);
    var margin = ssService.getValue(sheet, i, 4);
    var awayScore = ssService.getValue(sheet, i, 5);
    var awayTeam = ssService.getValue(sheet, i, 6);
    if (margin == 0) {
      msg += '\n*' + homeTeam + ' - ' + homeScore + '* (' + margin + ') *' + awayScore + ' - ' + awayTeam + '*';
    } else if (homeScore > awayScore) {
      msg += '\n*' + homeTeam + ' - ' + homeScore + '* (' + margin + ') ' + awayScore + ' - ' + awayTeam;
    } else {
      msg += '\n' + homeTeam + ' - ' + homeScore + ' (' + margin + ') *' + awayScore + ' - ' + awayTeam + '*';
    }
  }
  return msg;
}

async function getClScores(gw, doc) {
}

module.exports = { getScores }