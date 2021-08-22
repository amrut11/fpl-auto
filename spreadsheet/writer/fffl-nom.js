const ssService = require('../spreadsheet-service');

const TEAM_MAPPING = Object.freeze({
  'Barnsley': 'Barnsley',
  'Birmingham City': 'Birmingham',
  'Blackburn Rovers': 'Blackburn',
  'Bournemouth': 'Bournemouth',
  'Cardiff City': 'Cardiff',
  'Derby County': 'Derby',
  'Fulham': 'Fulham',
  'Hull City': 'Hull',
  'Middlesbrough': 'Middlesbrough',
  'Millwall': 'Millwall',
  'Nottingham Forest': 'Nottingham',
  'Preston North End': 'Preston',
  'QPR': 'Qpr',
  'Reading': 'Reading',
  'Stoke City': 'Stoke',
  'Swansea City': 'Swansea',
});

const NOM_SHEET_ID = process.env.FFFL_NOM_SHEET_ID;
const TRACKER_SHEET_ID = process.env.FFFL_TRACKER_SHEET_ID;
const PP_SHEET_ID = process.env.FFFL_PP_SHEET_ID;

async function updateNoms(gw) {
  gw = parseInt(gw);
  var doc = await ssService.getDoc(PP_SHEET_ID);
  var mapping = await createMapping(doc);
  var noms = await getNoms();
  var sheet = await ssService.loadCellsFromDoc(doc, gw - 1);
  for (var rowNum = 1; rowNum <= 8; rowNum++) {
    var homeNoms = noms[sheet.getCell(rowNum, 0).value];
    sheet.getCell(rowNum, 2).value = mapping[homeNoms.cap];
    sheet.getCell(rowNum, 3).value = mapping[homeNoms.vc];
    sheet.getCell(rowNum, 4).value = mapping[homeNoms.sub];

    var awayNoms = noms[sheet.getCell(rowNum, 1).value];
    sheet.getCell(rowNum, 6).value = mapping[awayNoms.cap];
    sheet.getCell(rowNum, 7).value = mapping[awayNoms.vc];
    sheet.getCell(rowNum, 8).value = mapping[awayNoms.sub];
  }
  await sheet.saveUpdatedCells();
  return 'Nominations for ' + gw + ' updated!';
}

async function createMapping(doc) {
  var mapping = new Object();
  var sheet = await ssService.loadCellsFromDoc(doc, 38);
  for (var row = 3; row <= 130; row++) {
    var hustleName = ssService.getValue(sheet, row, 5);
    var replName = ssService.getValue(sheet, row, 2);
    mapping[hustleName] = replName;
  }
  return mapping;
}

async function getNoms() {
  var noms = new Object();
  var sheet = await ssService.getSheet(NOM_SHEET_ID, 2, 17, 5);
  for (var rowNum = 2; rowNum <= 17; rowNum++) {
    var team = TEAM_MAPPING[ssService.getValue(sheet, rowNum, 1)];
    noms[team] = new Object();
    noms[team].cap = team + ssService.getValue(sheet, rowNum, 3);
    noms[team].vc = team + ssService.getValue(sheet, rowNum, 4);
    noms[team].sub = team + ssService.getValue(sheet, rowNum, 5);
  }
  return noms;
}

async function getNomsFromTracker(gw) {
  var noms = new Object();
  var info = await ssService.getInfo(TRACKER_SHEET_ID);
  var sheet = info.worksheets[4];
  var cells = await ssService.getCellsLimited(sheet, 161, 48);
  for (var teamCount = 0; teamCount < 20; teamCount++) {
    var team = ssService.getCell(cells, teamCount * 8 + 2, 3, 48).value;
    noms[team] = new Object();
    for (var row = 0; row < 8; row++) {
      var nom = ssService.getCell(cells, teamCount * 8 + row + 2, gw + 10, 48).value;
      var name = ssService.getCell(cells, teamCount * 8 + row + 2, 4, 48).value;
      if (nom == 'C') {
        noms[team].cap = team + name;
      } else if (nom == 'VC') {
        noms[team].vc = team + name;
      }
    }
  }
  return noms;
}

async function updateFixs() {
  var fixs = await createFixs();
  var info = await ssService.getInfo(PP_SHEET_ID);
  for (var gw = 1; gw <= 38; gw++) {
    var sheet = info.worksheets[gw - 1];
    var cells = await ssService.getCells(sheet);
    var gwFixs = getGwFixs(fixs, gw);
    var rowNum = 2;
    for (var i in gwFixs) {
      var fix = gwFixs[i];
      var homeCell = ssService.getCell(cells, rowNum, 1, 10);
      homeCell.setValue(fix.home);
      var awayCell = ssService.getCell(cells, rowNum++, 2, 10);
      awayCell.setValue(fix.away);
    }
    await sheet.bulkUpdateCells(cells);
  }
}

async function createFixs() {
  var info = await ssService.getInfo(TRACKER_SHEET_ID);
  var sheet = info.worksheets[5];
  var cells = await ssService.getCellsLimited(sheet, 25, 40);
  let fixs = [];
  for (var col = 3; col <= 25; col++) {
    let doneTeams = [];
    for (var row = 2; row <= 25; row++) {
      var homeTeam = ssService.getCell(cells, row, 2, 40).value;
      if (doneTeams.includes(homeTeam)) {
        continue;
      }
      var awayTeam = ssService.getCell(cells, row, col, 40).value;
      fixs.push({
        gw: (col - 2),
        home: homeTeam,
        away: awayTeam
      });
      doneTeams.push(awayTeam);
    }
  }
  return fixs;
}

function getGwFixs(fixs, gw) {
  let gwFixs = [];
  for (var i in fixs) {
    var fix = fixs[i];
    if (fix.gw == gw) {
      gwFixs.push(fix);
    }
  }
  return gwFixs;
}

module.exports = {
  updateNoms,
  updateFixs
}