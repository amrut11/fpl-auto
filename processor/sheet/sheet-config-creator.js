const ssService = require('../../spreadsheet/spreadsheet-service');
const interfaces = require('../../data/interfaces');
const tournMap = require('../../data/enums').TOURN_MAP;
const matchConfigMap = require('../../data/enums').MATCH_CONFIG_MAP;

const configSheetId = process.env.UPDATE_CONFIG_SHEET_ID;

async function createConfigs() {
  var info = await ssService.getInfo(configSheetId);
  var configSheet = info.worksheets[0];
  var configCells = await ssService.getCells(configSheet);
  var colCount = configSheet.colCount;

  var tournName = ssService.getCell(configCells, 2, 2, colCount).value;

  let configs = [];

  if (tournName === 'All') {
    for (var i in tournMap) {
      if (i === 'Opponent') {
        continue;
      }
      var tournament = tournMap[i];
      var sheetConfig = await createSheetConfig(tournament.sheetId, configCells, colCount);
      configs.push(new interfaces.UpdateConfig(tournament, sheetConfig, matchConfigMap[tournament.name]));
    }
  } else {
    var tournament = tournMap[tournName];
    var sheetConfig = await createSheetConfig(tournament.sheetId, configCells, colCount);
    configs.push(new interfaces.UpdateConfig(tournament, sheetConfig, matchConfigMap[tournName]));
  }
  return configs;
}

async function createSheetConfig(sheetId, configCells, colCount) {
  var doc = await ssService.getDoc(sheetId);

  var updateDetails = ssService.getCell(configCells, 3, 2, colCount).value;
  var updateTeams = ssService.getCell(configCells, 4, 2, colCount).value;
  var findDiffs = ssService.getCell(configCells, 5, 2, colCount).value;
  var calculateScores = ssService.getCell(configCells, 6, 2, colCount).value;

  return new interfaces.SheetConfig(doc, updateDetails, updateTeams, findDiffs, calculateScores);
}

module.exports = { createConfigs }