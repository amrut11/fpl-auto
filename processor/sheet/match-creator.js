const interfaces = require('../../data/interfaces');
const ssService = require('../../spreadsheet/spreadsheet-service');
const gwDetailsWriter = require('../../spreadsheet/writer/gw-details-writer');
const opponent = require('./opponent');

const FIRST_ROW = 3;
const SECOND_ROW = 4;

const GW_COL = 2;
const THEIR_TEAM_COL = 4;
const HOME_AWAY_COL = 4;
const CAP_COL = 6;
const VC_COL = 8;
const SUB_COL = 10;
const CHIP_COL = 12;

async function createMatch(fpl, updateConfig) {
  var sheetConfig = updateConfig.sheetConfig;
  var matchConfig = updateConfig.matchConfig;

  var ourTeam = matchConfig.teammap.getTeam(matchConfig.ourTeam);
  var sheet = await ssService.getSheetFromDoc(sheetConfig.info, 0);
  var theirTeam = matchConfig.teammap.getTeam(ssService.getValue(sheet, FIRST_ROW, THEIR_TEAM_COL));

  var gw = ssService.getValue(sheet, FIRST_ROW, GW_COL);
  var isHome = ssService.getValue(sheet, SECOND_ROW, HOME_AWAY_COL) == 'Home';

  var tournName = updateConfig.tournament.name;
  if (tournName === 'Opponent') {
    await opponent.handle(fpl, gw, updateConfig);
    return null;
  }

  if (sheetConfig.updateDetails === 'Yes') {
    await gwDetailsWriter.update(fpl, gw, sheet, ourTeam, theirTeam);
  }

  var ourCap = ssService.getValue(sheet, FIRST_ROW, CAP_COL);
  var theirCap = ssService.getValue(sheet, SECOND_ROW, CAP_COL);

  var ourVc = ssService.getValue(sheet, FIRST_ROW, VC_COL);
  var theirVc = ssService.getValue(sheet, SECOND_ROW, VC_COL);

  var ourBench = ssService.getValue(sheet, FIRST_ROW, SUB_COL);
  var theirBench = ssService.getValue(sheet, SECOND_ROW, SUB_COL);

  var ourChip = ssService.getValue(sheet, FIRST_ROW, CHIP_COL);
  var theirChip = ssService.getValue(sheet, SECOND_ROW, CHIP_COL);

  console.log(ourTeam.teamName + ' cap: ' + ourCap + ' vice: ' + ourVc + ' bench: ' + ourBench + ' chip: ' + ourChip + ' ' + theirTeam.teamName + ' cap: ' + theirCap + ' vice: ' + theirVc + ' bench: ' + theirBench + ' chip: ' + theirChip);

  var homeTeam, awayTeam;

  if (isHome) {
    homeTeam = new interfaces.GameweekTeam(ourTeam, ourCap, ourVc, ourBench, ourChip, true);
    awayTeam = new interfaces.GameweekTeam(theirTeam, theirCap, theirVc, theirBench, theirChip, false);
  } else {
    homeTeam = new interfaces.GameweekTeam(theirTeam, theirCap, theirVc, theirBench, theirChip, true);
    awayTeam = new interfaces.GameweekTeam(ourTeam, ourCap, ourVc, ourBench, ourChip, false);
  }

  return new interfaces.Match(gw, homeTeam, awayTeam, isHome);
}

module.exports = {
  createMatch
}