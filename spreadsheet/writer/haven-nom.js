const ssService = require('../spreadsheet-service');

const NOM_SHEET_ID = process.env.HAVEN_NOM_SHEET_ID;
const PP_SHEET_ID = process.env.HAVEN_PP_SHEET_ID;
const TEAM_PP_SHEET_ID = process.env.HAVEN_TEAM_PP_SHEET_ID;
const CUP_SHEET_ID = process.env.HAVEN_CUP_SHEET_ID;

const TEAMS = ['Atletico', 'Barca', 'Betis', 'Bilbao', 'Celta', 'R Madrid', 'Sevilla', 'Sociedad', 'Valencia', 'Villarreal', 'Arsenal', 'Chelsea', 'Everton', 'Leeds', 'Leicester', 'Liverpool', 'Man City', 'Man Utd', 'Spurs', 'Wolves'];

async function updateNoms(competition) {
  var sheet = await ssService.getSheet(NOM_SHEET_ID, 'PP-All');
  if (competition == 'League') {
    var noms = getLeagueNoms(sheet);
    await updatePpSheet(noms);
    await updateTeamPpSheet(noms);
  } else if (competition == 'CL') {
    var noms = getClNoms(sheet);
    await updateClNoms(noms);
  } else if (competition == 'Cups') {
    var noms = getCupsNoms(sheet);
    await updateCupsNoms(noms);
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
  var firstGameSheet = await ssService.getSheetFromDoc(doc, (noms.match - 1) * 2 + 2);
  var secondGameSheet = await ssService.getSheetFromDoc(doc, (noms.match - 1) * 2 + 3);
  for (var rowNum = 1; rowNum <= 10; rowNum++) {
    updatePpRow(noms, firstGameSheet, secondGameSheet, rowNum, 0, 2);
    updatePpRow(noms, firstGameSheet, secondGameSheet, rowNum, 1, 6);
  }
  await firstGameSheet.saveUpdatedCells();
  await secondGameSheet.saveUpdatedCells();
}

function updatePpRow(noms, firstGameSheet, secondGameSheet, rowNum, teamCol, capCol) {
  var nom = noms[ssService.getValue(firstGameSheet, rowNum + 1, teamCol + 1)];
  firstGameSheet.getCell(rowNum, capCol).value = nom.cap;
  secondGameSheet.getCell(rowNum, capCol).value = nom.cap;
  firstGameSheet.getCell(rowNum, capCol + 1).value = nom.vc;
  secondGameSheet.getCell(rowNum, capCol + 2).value = nom.sub;
  var chip = nom.chip;
  if (chip == 'DVC' || ((chip == 'TC' || chip == 'ACE') && nom.chipGw == 'Game 1')) {
    firstGameSheet.getCell(rowNum, capCol + 3).value = chip;
  } else if (chip == 'SS' || ((chip == 'TC' || chip == 'ACE') && nom.chipGw == 'Game 2')) {
    secondGameSheet.getCell(rowNum, capCol + 3).value = chip;
  }
}

async function updateTeamPpSheet(noms) {
  var doc = await ssService.getDoc(TEAM_PP_SHEET_ID);
  for (var i = 0; i < TEAMS.length; i++) {
    var team = TEAMS[i];
    var sheet = await ssService.getSheetFromDoc(doc, i);
    var nom = noms[team];
    var playerRowMap = new Object();
    var col = (noms.match - 1) * 2 + 4;
    for (var rowNum = 2; rowNum <= 11; rowNum++) {
      playerRowMap[ssService.getValue(sheet, rowNum, 1)] = rowNum - 1;
    }
    var capRow = playerRowMap[nom.cap];
    if (capRow) {
      sheet.getCell(capRow, col).value = 'C';
      sheet.getCell(capRow, col + 1).value = 'C';
      if (nom.chip == 'TC') {
        if (nom.chipGw == 'Game 1') {
          sheet.getCell(capRow, col).value = 'TC';
        } else {
          sheet.getCell(capRow + 1, col).value = 'TC';
        }
      }
    }
    var vcRow = playerRowMap[nom.vc];
    if (vcRow) {
      sheet.getCell(vcRow, col).value = nom.chip == 'DVC' ? 'DVC' : 'VC';
    }
    var subRow = playerRowMap[nom.sub];
    if (subRow) {
      sheet.getCell(subRow, col + 1).value = nom.chip == 'SS' ? 'SS' : 'S';
    }
    await sheet.saveUpdatedCells();
  }
}

function getClNoms(sheet) {
  var noms = new Object();
  noms.match = ssService.getValue(sheet, 2, 3);
  for (var rowNum = 7; rowNum <= 31; rowNum++) {
    var team = ssService.getValue(sheet, rowNum, 10);
    if (team == '') {
      continue;
    }
    noms[team] = {
      'chip': ssService.getValue(sheet, rowNum, 11),
      'sp': ssService.getValue(sheet, rowNum, 12),
      'bench1': ssService.getValue(sheet, rowNum, 13),
      'bench2': ssService.getValue(sheet, rowNum, 14),
      'bench3': ssService.getValue(sheet, rowNum, 15)
    }
  }
  return noms;
}

async function updateClNoms(noms) {
  var sheet = await ssService.getSheet(CUP_SHEET_ID, 'CL-R' + noms.match);
  for (var teamRow = 4; teamRow <= 43; teamRow += 13) {
    for (var col = 1; col <= 21; col += 5) {
      var nom = noms[ssService.getValue(sheet, teamRow, col)];
      if (nom.chip == 'Yes') {
        sheet.getCell(teamRow - 1, col + 1).value = 'Chip';
        continue;
      } else if (nom.bench1 == '') {
        sheet.getCell(teamRow - 1, col + 1).value = 'Pen';
        continue;
      }
      for (var rowNum = teamRow; rowNum < teamRow + 10; rowNum++) {
        updateClRow(sheet, nom, rowNum - 1, col + 1);
      }
    }
  }
  await sheet.saveUpdatedCells();
}

function updateClRow(sheet, nom, row, col) {
  var player = ssService.getValue(sheet, row + 1, col);
  if (player == nom.sp) {
    sheet.getCell(row, col).value = 'SP';
  } else if (player == nom.bench1) {
    sheet.getCell(row, col).value = 'B';
  } else if (player == nom.bench2) {
    sheet.getCell(row, col).value = 'B';
  } else if (player == nom.bench3) {
    sheet.getCell(row, col).value = 'B';
  }
}

function getCupsNoms(sheet) {
  var noms = new Object();
  noms.match = ssService.getValue(sheet, 3, 3);
  for (var colNum = 2; colNum <= 10; colNum += 8) {
    for (var rowNum = 37; rowNum <= 46; rowNum++) {
      var team = ssService.getValue(sheet, rowNum, colNum);
      if (team == '') {
        continue;
      }
      noms[team] = ssService.getValue(sheet, rowNum, colNum + 1);
    }
  }
  return noms;
}

async function updateCupsNoms(noms) {
  var doc = await ssService.getDoc(TEAM_PP_SHEET_ID);
  for (var i = 0; i < TEAMS.length; i++) {
    var team = TEAMS[i];
    var sheet = await ssService.getSheetFromDoc(doc, i);
    var col = noms.match + 8;
    for (var rowNum = 14; rowNum <= 23; rowNum++) {
      var pName = ssService.getValue(sheet, rowNum, 1);
      if (noms[team] == pName) {
        sheet.getCell(rowNum - 1, col).value = 'L';
        break;
      }
    }
    await sheet.saveUpdatedCells();
  }
}

module.exports = { updateNoms }