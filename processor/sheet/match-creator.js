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

  var detailsSheet = sheetConfig.info.worksheets[0];
  var ourTeam = matchConfig.teammap.getTeam(matchConfig.ourTeam);
  var detailsCells = await ssService.getCells(detailsSheet);
  var detColCount = detailsSheet.colCount;
  var theirTeamCell = ssService.getCell(detailsCells, FIRST_ROW, THEIR_TEAM_COL, detColCount);
  var theirTeam = matchConfig.teammap.getTeam(theirTeamCell.value);

  var gw = ssService.getCell(detailsCells, FIRST_ROW, GW_COL, detColCount).value;
  var isHome = ssService.getCell(detailsCells, SECOND_ROW, HOME_AWAY_COL, detColCount).value == 'Home';

  var tournName = updateConfig.tournament.name;
  if (tournName === 'Opponent') {
    await opponent.handle(fpl, gw, updateConfig);
    return null;
  }

  if (sheetConfig.updateDetails === 'Yes') {
    await gwDetailsWriter.update(fpl, gw, detailsSheet, detailsCells, ourTeam, theirTeam);
  }

  var ourCap = theirCap = ourVc = theirVc = ourBench = theirBench = ourChip = theirChip = 'no one';

  ourCap = ssService.getCell(detailsCells, FIRST_ROW, CAP_COL, detColCount).value;
  theirCap = ssService.getCell(detailsCells, SECOND_ROW, CAP_COL, detColCount).value;

  ourVc = ssService.getCell(detailsCells, FIRST_ROW, VC_COL, detColCount).value;
  theirVc = ssService.getCell(detailsCells, SECOND_ROW, VC_COL, detColCount).value;

  ourBench = ssService.getCell(detailsCells, FIRST_ROW, SUB_COL, detColCount).value;
  theirBench = ssService.getCell(detailsCells, SECOND_ROW, SUB_COL, detColCount).value;

  ourChip = ssService.getCell(detailsCells, FIRST_ROW, CHIP_COL, detColCount).value;
  theirChip = ssService.getCell(detailsCells, SECOND_ROW, CHIP_COL, detColCount).value;

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

module.exports = { createMatch }