const ssService = require('../spreadsheet-service');

const CUP_SHEET_ID = process.env.FFC_CUP_SHEET_ID;

const FAC_ROW_MAP = [3, 12, 29, 38, 43, 46];
const CL_ROW_MAP = {
  27: { 'start': 105, 'end': 113 },
  28: { 'start': 3, 'end': 19 },
  29: { 'start': 20, 'end': 36 },
  30: { 'start': 37, 'end': 53 },
  31: { 'start': 54, 'end': 70 },
  32: { 'start': 71, 'end': 87 },
  33: { 'start': 88, 'end': 104 },
  34: { 'start': 150, 'end': 158 },
  35: { 'start': 114, 'end': 130 },
  36: { 'start': 131, 'end': 139 },
  37: { 'start': 140, 'end': 144 },
  38: { 'start': 145, 'end': 149 },
};

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
  var sheet = await ssService.getSheetFromDoc(doc, 'CL');
  var rows = CL_ROW_MAP[gw];
  var msg = '*CL: ' + ssService.getValue(sheet, rows.start, 1) + '*';
  msg += '\n---------------------';
  for (var i = rows.start + 1; i <= rows.end; i++) {
    var homeTeam = ssService.getValue(sheet, i, 2);
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

module.exports = { getScores }