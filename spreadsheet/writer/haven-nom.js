const ssService = require('../spreadsheet-service');

const NOM_SHEET_ID = process.env.HAVEN_NOM_SHEET_ID;
const PP_SHEET_ID = process.env.HAVEN_PP_SHEET_ID;
const TEAM_PP_SHEET_ID = process.env.HAVEN_TEAM_PP_SHEET_ID;
const CUP_SHEET_ID = process.env.HAVEN_CUP_SHEET_ID;

const TEAMS = ['Atletico', 'Barca', 'Betis', 'Bilbao', 'Celta', 'R Madrid', 'Sevilla', 'Sociedad', 'Valencia', 'Villarreal', 'Arsenal', 'Chelsea', 'Everton', 'Leeds', 'Leicester', 'Liverpool', 'Man City', 'Man Utd', 'Spurs', 'Wolves'];

async function updateNoms(competition) {
  var sheet = await ssService.getSheet(NOM_SHEET_ID,0);
  if (competition == 'League') {
    var noms = getLeagueNoms(sheet);
    await updatePpSheet(noms);
    await updateTeamPpSheet(noms);
  } else if (competition == 'CL') {
    var noms = getClNoms(sheet);
    await updateClNoms(noms);
  }
  return 'Nominations for ' + competition + ' updated!';
}

function getLeagueNoms(sheet) {
  var noms = new Object();
  noms.match = ssService.getValue(sheet, 1, 3);
  for (var rowNum = 7; rowNum <= 31; rowNum++) {
    var team = ssService.getValue(sheet, rowNum, 2);
    if (team == '') {
      continue;
    }
    var nomination = new Object();
    nomination.cap = ssService.getValue(sheet, rowNum, 3);
    nomination.vc = ssService.getValue(sheet, rowNum, 4);
    nomination.sub = ssService.getValue(sheet, rowNum, 5);
    nomination.chip = ssService.getValue(sheet, rowNum, 6);
    nomination.chipGw = ssService.getValue(sheet, rowNum, 7);
    noms[team] = nomination;
  }
  return noms;
}

async function updatePpSheet(noms) {
  var doc = await ssService.getDoc(PP_SHEET_ID);
  var firstGameSheet =await ssService.getSheetFromDoc(doc,(noms.match - 1)*2);
  var secondGameSheet =await ssService.getSheetFromDoc(doc,(noms.match - 1)*2+1);
  for (var rowNum = 1; rowNum <= 10; rowNum++) {
    updatePpRow(noms, firstGameSheet, secondGameSheet, rowNum, 0, 2);
    updatePpRow(noms, firstGameSheet, secondGameSheet, rowNum, 1, 6);
  }
  await firstGameSheet.saveUpdatedCells();
  await secondGameSheet.saveUpdatedCells();
}

function updatePpRow(noms, firstGameSheet, secondGameSheet, rowNum, teamCol, capCol) {
  var nom = noms[ssService.getValue(firstGameSheet, rowNum + 1, teamCol + 1)];
  firstGameSheet.getCell(rowNum,capCol).value = nom.cap;
  secondGameSheet.getCell(rowNum,capCol).value = nom.cap;
  firstGameSheet.getCell(rowNum, capCol+1).value = nom.vc;
  secondGameSheet.getCell(rowNum,capCol+2).value = nom.sub;
  var chip = nom.chip;
  if (chip == 'DVC' || ((chip == 'TC' || chip == 'ACE') && nom.chipGw == 'Game 1')) {
    firstGameSheet.getCell(rowNum,capCol+3).value = chip;
  } else if (chip == 'SS' || ((chip == 'TC' || chip == 'ACE') && nom.chipGw == 'Game 2')) {
    secondGameSheet.getCell(rowNum,capCol+3).value = chip;
  }
}

async function updateTeamPpSheet(noms) {
  var doc = await ssService.getDoc(TEAM_PP_SHEET_ID);
  for (var i =0;i<TEAMS.length;i++) {
    var team = TEAMS[i];
    var sheet = await ssService.getSheetFromDoc(doc,i);
    var nom = noms[team];
    var playerRowMap = new Object();
    var col = (noms.match - 1) * 2 + 2;
    for (var rowNum = 2; rowNum <= 11; rowNum++) {
      playerRowMap[ssService.getValue(sheet, rowNum,1)] = rowNum-1;
    }
    var capRow = playerRowMap[nom.cap];
    if (capRow) {
      sheet.getCell(capRow,col).value = 'C';
      sheet.getCell(capRow,col+1).value = 'C';
      if (nom.chip == 'TC') {
        if (nom.chipGw == 'Game 1') {
          sheet.getCell(capRow,col).value = 'TC';
        } else {
          sheet.getCell(capRow+1,col).value = 'TC';
        }
      }
    }
    var vcRow = playerRowMap[nom.vc];
    if (vcRow) {
      sheet.getCell(vcRow,col).value = nom.chip == 'DVC' ? 'DVC' : 'VC';
    }
    var subRow = playerRowMap[nom.sub];
    if (subRow) {
      sheet.getCell(subRow,col+1).value = nom.chip == 'SS' ? 'SS' : 'S';
    }
    await sheet.saveUpdatedCells();
  }
}

function getClNoms(cells) {
  var noms = new Object();
  noms.match = parseInt(ssService.getCell(cells, 1, 11, NO_OF_COLS).value);
  for (var rowNum = 5; rowNum <= 14; rowNum++) {
    var nomination = new Object();
    nomination.chip = ssService.getCell(cells, rowNum, 11, NO_OF_COLS).value;
    nomination.sp = ssService.getCell(cells, rowNum, 12, NO_OF_COLS).value;
    nomination.bench1 = ssService.getCell(cells, rowNum, 13, NO_OF_COLS).value;
    nomination.bench2 = ssService.getCell(cells, rowNum, 14, NO_OF_COLS).value;
    nomination.bench3 = ssService.getCell(cells, rowNum, 15, NO_OF_COLS).value;
    var team = ssService.getCell(cells, rowNum, 10, NO_OF_COLS).value;
    noms[team] = nomination;
  }
  return noms;
}

async function updateClNoms(noms) {
  var info = await ssService.getInfo(CUP_SHEET_ID);
  var sheet = info.worksheets[noms.match + 7];
  var cells = await ssService.getCells(sheet);
  for (var teamRow = 4; teamRow <= 17; teamRow += 13) {
    for (var col = 1; col <= 21; col += 5) {
      var nom = noms[ssService.getCell(cells, teamRow, col, 25).value.toUpperCase()];
      if (nom.chip == 'Yes') {
        ssService.getCell(cells, teamRow, col + 2, 25).setValue('Chip');
        continue;
      } else if (nom.bench1 == '') {
        ssService.getCell(cells, teamRow, col + 2, 25).setValue('Pen');
        continue;
      }
      var playerRowMap = new Object();
      for (var rowNum = teamRow; rowNum <= teamRow + 10; rowNum++) {
        playerRowMap[ssService.getCell(cells, rowNum, col + 1, 25).value] = rowNum;
      }
      var spRow = playerRowMap[nom.sp];
      if (spRow) {
        ssService.getCell(cells, spRow, col + 2, 25).setValue('SP');
      }
      var bench1Row = playerRowMap[nom.bench1];
      if (bench1Row) {
        ssService.getCell(cells, bench1Row, col + 2, 25).setValue('B');
      }
      var bench2Row = playerRowMap[nom.bench2];
      if (bench2Row) {
        ssService.getCell(cells, bench2Row, col + 2, 25).setValue('B');
      }
      var bench3Row = playerRowMap[nom.bench3];
      if (bench3Row) {
        ssService.getCell(cells, bench3Row, col + 2, 25).setValue('B');
      }
    }
  }
  await sheet.bulkUpdateCells(cells);
}

module.exports = { updateNoms }