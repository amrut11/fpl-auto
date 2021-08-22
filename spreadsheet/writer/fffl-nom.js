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
  var mapping = await createMapping();
  var noms = await getNoms();
  var info = await ssService.getInfo(PP_SHEET_ID);
  var sheet = info.worksheets[gw - 1];
  var cells = await ssService.getCells(sheet);
  for (var rowNum = 2; rowNum <= 9; rowNum++) {
    var homeTeam = ssService.getCell(cells, rowNum, 1, 10).value;
    var homeNoms = noms[homeTeam];
    var homeC = ssService.getCell(cells, rowNum, 3, 10);
    homeC.setValue(mapping[homeNoms.cap]);
    var homeVC = ssService.getCell(cells, rowNum, 4, 10);
    homeVC.setValue(mapping[homeNoms.vc]);
    var homeSub = ssService.getCell(cells, rowNum, 5, 10);
    homeSub.setValue(mapping[homeNoms.sub]);

    var awayTeam = ssService.getCell(cells, rowNum, 2, 10).value;
    var awayNoms = noms[awayTeam];
    var awayC = ssService.getCell(cells, rowNum, 7, 10);
    awayC.setValue(mapping[awayNoms.cap]);
    var awayVC = ssService.getCell(cells, rowNum, 8, 10);
    awayVC.setValue(mapping[awayNoms.vc]);
    var awaySub = ssService.getCell(cells, rowNum, 9, 10);
    awaySub.setValue(mapping[awayNoms.sub]);
  }
  await sheet.bulkUpdateCells(cells);
  return 'Nominations for ' + gw + ' updated!';
}

async function createMapping() {
  var mapping = new Object();
  var info = await ssService.getInfo(PP_SHEET_ID);
  var sheet = info.worksheets[38];
  var cells = await ssService.getCells(sheet);
  for (var row = 3; row <= 130; row++) {
    var hustleName = ssService.getCell(cells, row, 5, 11).value;
    var replName = ssService.getCell(cells, row, 2, 11).value;
    mapping[hustleName] = replName;
  }
  return mapping;
}

async function getNoms() {
  var noms = new Object();
  var info = await ssService.getInfo(NOM_SHEET_ID);
  var sheet = info.worksheets[2];
  var cells = await ssService.getCellsLimited(sheet, 17, 5);
  for (var rowNum = 2; rowNum <= 17; rowNum++) {
    var team = TEAM_MAPPING[ssService.getCell(cells, rowNum, 1, 5).value];
    noms[team] = new Object();
    noms[team].cap = team + ssService.getCell(cells, rowNum, 3, 5).value;
    noms[team].vc = team + ssService.getCell(cells, rowNum, 4, 5).value;
    noms[team].sub = team + ssService.getCell(cells, rowNum, 5, 5).value;
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
      fixs.push({ gw: (col - 2), home: homeTeam, away: awayTeam });
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

module.exports = { updateNoms, updateFixs }