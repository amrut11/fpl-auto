const ssService = require('../spreadsheet-service');

const TEAM_MAPPING = Object.freeze({
  'Arsenal': 'ARS', 'Aston Villa': 'AVL', 'Birmingham City': 'BIR', 'Blackburn Rovers': 'BLA', 'Bournemouth': 'BOU', 'Brentford': 'BRE', 'Brighton & Hove Albion': 'BHA', 'Burnley': 'BUR', 'Chelsea': 'CHE', 'Crystal Palace': 'CRY', 'Everton': 'EVE', 'Leeds United': 'LEE', 'Leicester City': 'LEI', 'Liverpool': 'LIV', 'Manchester City': 'MCI', 'Manchester United': 'MUN', 'Newcastle United': 'NEW', 'Nottingham Forest': 'NOT', 'Southampton': 'SOU', 'Tottenham Hotspur': 'TOT', 'Watford': 'WAT', 'West Bromwich Albion': 'WBA', 'West Ham United': 'WHU', 'Wolverhampton Wanderers': 'WOL'
});

const NOM_SHEET_ID = process.env.HUSTLE_NOM_SHEET_ID;
const TRACKER_SHEET_ID = process.env.HUSTLE_TRACKER_SHEET_ID;
const PP_SHEET_ID = process.env.HUSTLE_PP_SHEET_ID;

async function updateNoms(gw) {
  gw = parseInt(gw);
  var doc = await ssService.getDoc(PP_SHEET_ID);
  var mapping = await createMapping(doc);
  var noms = await getNoms();
  var sheet = await ssService.getSheetFromDoc(doc, gw - 1);
  for (var rowNum = 1; rowNum <= 12; rowNum++) {
    var homeNoms = noms[sheet.getCell(rowNum, 0).value];
    sheet.getCell(rowNum, 2).value = mapping[homeNoms.cap];
    sheet.getCell(rowNum, 3).value = mapping[homeNoms.vc];

    var awayNoms = noms[sheet.getCell(rowNum, 1).value];
    sheet.getCell(rowNum, 6).value = mapping[awayNoms.cap];
    sheet.getCell(rowNum, 7).value = mapping[awayNoms.vc];
  }
  await sheet.saveUpdatedCells();
  return 'Nominations for ' + gw + ' updated!';
}

async function createMapping(doc) {
  var mapping = new Object();
  var sheet = await ssService.getSheetFromDoc(doc, 38);
  for (var row = 3; row <= 194; row++) {
    var hustleName = ssService.getValue(sheet, row, 5);
    var replName = ssService.getValue(sheet, row, 2);
    mapping[hustleName] = replName;
  }
  return mapping;
}

async function getNoms() {
  var noms = new Object();
  var sheet = await ssService.getSheet(NOM_SHEET_ID, 0, 25, 3);
  for (var rowNum = 2; rowNum <= 25; rowNum++) {
    var team = TEAM_MAPPING[ssService.getValue(sheet, rowNum, 1)];
    noms[team] = new Object();
    noms[team].cap = team + ssService.getValue(sheet, rowNum, 2);
    noms[team].vc = team + ssService.getValue(sheet, rowNum, 3);
  }
  return noms;
}

async function getNomsFromTracker(gw) {
  var noms = new Object();
  var sheet = await ssService.getSheet(TRACKER_SHEET_ID, 4, 161, 48);
  for (var teamCount = 0; teamCount < 20; teamCount++) {
    var team = ssService.getValue(sheet, teamCount * 8 + 2, 3);
    noms[team] = new Object();
    for (var row = 0; row < 8; row++) {
      var nom = ssService.getValue(sheet, teamCount * 8 + row + 2, gw + 10);
      var name = ssService.getValue(sheet, teamCount * 8 + row + 2, 4);
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
  var doc = await ssService.getDoc(PP_SHEET_ID);
  for (var gw = 1; gw <= 38; gw++) {
    var sheet = await ssService.getSheetFromDoc(doc, gw - 1);
    var gwFixs = getGwFixs(fixs, gw);
    var rowNum = 1;
    for (var i in gwFixs) {
      var fix = gwFixs[i];
      sheet.getCell(rowNum, 0).value = fix.home;
      sheet.getCell(rowNum++, 1).value = fix.away;
    }
    await sheet.saveUpdatedCells();
  }
}

async function createFixs() {
  var sheet = await ssService.getSheet(TRACKER_SHEET_ID, 5, 25, 40);
  let fixs = [];
  for (var col = 3; col <= 25; col++) {
    let doneTeams = [];
    for (var row = 2; row <= 25; row++) {
      var homeTeam = ssService.getValue(sheet, row, 2);
      if (doneTeams.includes(homeTeam)) {
        continue;
      }
      var awayTeam = ssService.getValue(sheet, row, col);
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

module.exports = { updateNoms, updateFixs }