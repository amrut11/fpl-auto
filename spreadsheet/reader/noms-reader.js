const ssService = require('../spreadsheet-service');

const SHEET_ID = process.env.H2H_FIXTURE_SHEET_ID;
const NOMS_SHEET = 'Noms';

const TOURNAMENTS = { 'ffc': ['FFC'], 'hustle': ['HUSTLE'], 'fffl': ['FFFL'], 'haven': ['HAVEN'], 'all': ['FFC', 'Hustle', 'FFFL', 'Haven'] };

async function getNoms(tournament) {
  var msg = ':::';
  var tournaments = TOURNAMENTS[tournament.toLowerCase()];
  var doc = await ssService.getDoc(SHEET_ID);
  var nomsSheet = await ssService.getSheetFromDoc(doc, NOMS_SHEET);
  for (var col = 2; col <= 11; col += 3) {
    var tournament = ssService.getValue(nomsSheet, 2, col);
    if (tournaments.includes(tournament)) {
      msg += '*' + tournament + ' ' + ssService.getValue(nomsSheet, 3, col + 1) + '*\n' + readNoms(nomsSheet, col);
      var tournSheet = await ssService.getSheetFromDoc(doc, tournament, 42, 3);
      msg += '\n\n' + readFixs(tournSheet) + ':::';
    }
  }
  return msg;
}

function readNoms(sheet, col) {
  var msg = '';
  for (var row = 4; row <= 14; row++) {
    var pName = ssService.getValue(sheet, row, col);
    if (pName == '') {
      break;
    }
    msg += '*' + pName + '*\t' + ssService.getValue(sheet, row, col + 1) + '\n';
  }
  return msg;
}

function readFixs(sheet) {
  var msg = '';
  var row = ssService.getValue(sheet, 42, 3) + 2;
  for (var i = row;; i++) {
    var team = ssService.getValue(sheet, i, 2);
    if (team == '') {
      break;
    }
    var isHome = ssService.getValue(sheet, i, 3) == 'Home';
    msg += (isHome ? team.toUpperCase() : team.toLowerCase()) + ' ';
  }
  return msg;
}

module.exports = { getNoms };