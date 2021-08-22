const ssService = require('../spreadsheet-service');

const NOM_SHEET_ID = process.env.HAVEN_NOM_SHEET_ID;
const PP_SHEET_ID = process.env.HAVEN_PP_SHEET_ID;
const TEAM_PP_SHEET_ID = process.env.HAVEN_TEAM_PP_SHEET_ID;
const CUP_SHEET_ID = process.env.HAVEN_CUP_SHEET_ID;

const NO_OF_COLS = 15;

const TEAMS = ['Atletico', 'Barca', 'Betis', 'Bilbao', 'Celta', 'R Madrid', 'Sevilla', 'Sociedad', 'Valencia', 'Villarreal', 'Arsenal', 'Chelsea', 'Everton', 'Leeds', 'Leicester', 'Liverpool', 'Man City', 'Man Utd', 'Spurs', 'Wolves'];

async function updateNoms(competition) {
  var info = await ssService.getInfo(NOM_SHEET_ID);
  var sheet = info.worksheets[0];
  var cells = await ssService.getCells(sheet);
  if (competition == 'League') {
    var noms = getLeagueNoms(cells);
    await updatePpSheet(noms);
    await updateTeamPpSheet(noms);
  } else if (competition == 'CL') {
    var noms = getClNoms(cells);
    await updateClNoms(noms);
  }
  return 'Nominations for ' + competition + ' updated!';
}

function getLeagueNoms(cells) {
  var noms = new Object();
  noms.match = ssService.getCell(cells, 1, 3, NO_OF_COLS).value;
  for (var rowNum = 7; rowNum <= 31; rowNum++) {
    var team = ssService.getCell(cells, rowNum, 2, NO_OF_COLS).value;
    if (team == '') {
      continue;
    }
    var nomination = new Object();
    nomination.cap = ssService.getCell(cells, rowNum, 3, NO_OF_COLS).value;
    nomination.vc = ssService.getCell(cells, rowNum, 4, NO_OF_COLS).value;
    nomination.sub = ssService.getCell(cells, rowNum, 5, NO_OF_COLS).value;
    nomination.chip = ssService.getCell(cells, rowNum, 6, NO_OF_COLS).value;
    nomination.chipGw = ssService.getCell(cells, rowNum, 7, NO_OF_COLS).value;
    noms[team] = nomination;
  }
  return noms;
}

async function updatePpSheet(noms) {
  var info = await ssService.getInfo(PP_SHEET_ID);
  var firstGameSheet = info.worksheets[(noms.match - 1) * 2];
  var secondGameSheet = info.worksheets[(noms.match - 1) * 2 + 1];
  var firstSheetCells = await ssService.getCells(firstGameSheet);
  var secondSheetCells = await ssService.getCells(secondGameSheet);
  for (var rowNum = 2; rowNum <= 11; rowNum++) {
    updatePpRow(noms, firstSheetCells, secondSheetCells, rowNum, 1, 3);
    updatePpRow(noms, firstSheetCells, secondSheetCells, rowNum, 2, 7);
  }
  await firstGameSheet.bulkUpdateCells(firstSheetCells);
  await secondGameSheet.bulkUpdateCells(secondSheetCells);
}

function updatePpRow(noms, firstSheetCells, secondSheetCells, rowNum, teamCol, capCol) {
  var nom = noms[ssService.getCell(firstSheetCells, rowNum, teamCol, 10).value];
  ssService.getCell(firstSheetCells, rowNum, capCol, 10).setValue(nom.cap);
  ssService.getCell(secondSheetCells, rowNum, capCol, 10).setValue(nom.cap);
  ssService.getCell(firstSheetCells, rowNum, capCol + 1, 10).setValue(nom.vc);
  ssService.getCell(secondSheetCells, rowNum, capCol + 2, 10).setValue(nom.sub);
  var chip = nom.chip;
  if (chip == 'DVC' || ((chip == 'TC' || chip == 'ACE') && nom.chipGw == 'Game 1')) {
    ssService.getCell(firstSheetCells, rowNum, capCol + 3, 10).setValue(chip);
  } else if (chip == 'SS' || ((chip == 'TC' || chip == 'ACE') && nom.chipGw == 'Game 2')) {
    ssService.getCell(secondSheetCells, rowNum, capCol + 3, 10).setValue(chip);
  }
}

async function updateTeamPpSheet(noms) {
  var info = await ssService.getInfo(TEAM_PP_SHEET_ID);
  for (var i in TEAMS) {
    var team = TEAMS[i];
    console.dir(team);
    var sheet = info.worksheets[i];
    var cells = await ssService.getCells(sheet);
    var nom = noms[team];
    var playerRowMap = new Object();
    var col = (noms.match - 1) * 2 + 3;
    for (var rowNum = 2; rowNum <= 11; rowNum++) {
      playerRowMap[ssService.getCell(cells, rowNum, 1, 40).value] = rowNum;
    }
    var capRow = playerRowMap[nom.cap];
    if (capRow) {
      ssService.getCell(cells, capRow, col, 40).setValue('C');
      ssService.getCell(cells, capRow, col + 1, 40).setValue('C');
      if (nom.chip == 'TC') {
        if (nom.chipGw == 'Game 1') {
          ssService.getCell(cells, capRow, col, 40).setValue('TC');
        } else {
          ssService.getCell(cells, capRow, col + 1, 40).setValue('TC');
        }
      }
    }
    var vcRow = playerRowMap[nom.vc];
    if (vcRow) {
      ssService.getCell(cells, vcRow, col, 40).setValue(nom.chip == 'DVC' ? 'DVC' : 'VC');
    }
    var subRow = playerRowMap[nom.sub];
    if (subRow) {
      ssService.getCell(cells, subRow, col + 1, 40).setValue(nom.chip == 'SS' ? 'SS' : 'S');
    }
    await sheet.bulkUpdateCells(cells);
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