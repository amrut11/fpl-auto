const fplService = require('./request/fpl-service');

const playerDetails = require('./request/player-details');
const managerGwScore = require('./scoring/manager-gw-score');
const matchCreator = require('./sheet/match-creator');
const fullLeague = require('./full-league');
const havenClDiff = require('./diff/haven-cl-diff');
const ffcCupsDiff = require('./diff/ffc-cups-diff');
const liveMatches = require('./live/live-matches');

const bonusReader = require('../spreadsheet/reader/bonus-reader');
const tournDataReader = require('../spreadsheet/reader/tourn-data-reader');
const havenScoreReader = require('../spreadsheet/reader/haven-reader');
const ffcReader = require('../spreadsheet/reader/ffc-reader');
const nomsReader = require('../spreadsheet/reader/noms-reader');
const hustleRumble = require('./scoring/hustle-rumble');

const liveScoreUpdater = require('../spreadsheet/writer/live-score-updater');
const gwTeamWriter = require('../spreadsheet/writer/gw-team-writer');
const chipWriter = require('../spreadsheet/writer/fpl-chips-writer');
const havenNom = require('../spreadsheet/writer/haven-nom');
const hustleNom = require('../spreadsheet/writer/hustle-nom');
const ffflNom = require('../spreadsheet/writer/fffl-nom');

const dbService = require('../db/alert-db-service');
const LEAGUE_CONFIGS = require('../data/enums').LEAGUE_CONFIGS;

var liveScoresDone = false;

async function start(bot, chatId, updateConfigs) {
  liveScoresDone = false;
  var fpl = new fplService();
  for (var i = 0; i < updateConfigs.length; i++) {
    var updateConfig = updateConfigs[i];
    var response = await readDetails(fpl, updateConfig);
    if (response) {
      if (await isSendResponse(chatId, updateConfig, response)) {
        var messages = response.split(':::');
        for (var resp in messages) {
          if (messages[resp] == '') {
            continue;
          }
          var msg = '*' + updateConfig.tournament.name + '*';
          msg += '\n---------------------\n';
          msg += messages[resp];
          bot.sendMessage(chatId, msg, {
            parse_mode: 'markdown'
          });
        }
      }
      continue;
    }
    await runConfig(fpl, updateConfig);
  }
}

async function readDetails(fpl, updateConfig) {
  var sheetConfig = updateConfig.sheetConfig;
  var findDiffs = sheetConfig.findDiffs;
  var calculateScores = sheetConfig.calculateScores;
  if (findDiffs === 'Read') {
    console.log('Reading diffs');
    return await tournDataReader.readDiffs(sheetConfig.info.sheetsByIndex[3]);
  } else if (findDiffs === 'FFC-H2H') {
    console.log('Fetching H2H diffs for FFC');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.FFC_DIFFS);
  } else if (findDiffs === 'Hustle-H2H') {
    console.log('Fetching H2H diffs for Hustle league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.HUSTLE_DIFFS);
  } else if (findDiffs === 'FFFL-H2H') {
    console.log('Fetching H2H diffs for FFFL league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.FFFL_DIFFS);
  } else if (findDiffs === 'Haven-H2H') {
    console.log('Fetching H2H diffs for Haven league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.HAVEN_DIFFS);
  } else if (findDiffs === 'Haven-CL') {
    console.log('Fetching H2H diffs for Haven CL');
    return await havenClDiff.getDiffs(fpl, updateConfig, LEAGUE_CONFIGS.HAVEN_CL_DIFFS);
  } else if (findDiffs === 'FFC-Cups') {
    console.log('Fetching H2H diffs for FFC Cups');
    return await ffcCupsDiff.getDiffs(fpl, updateConfig, LEAGUE_CONFIGS.FFC_CUPS_DIFFS);
  } else if (calculateScores === 'ReadLive') {
    console.log('Reading live scores');
    return await tournDataReader.readLive(sheetConfig.info.sheetsByIndex[5]);
  } else if (calculateScores === 'ReadFinal') {
    console.log('Reading final scores');
    return await tournDataReader.readFinal(sheetConfig.info.sheetsByIndex[3]);
  } else if (calculateScores === 'ReadBonus') {
    console.log('Reading LIVE bonus');
    return await bonusReader.readBonus(fpl);
  } else if (calculateScores === 'FFC-Individual') {
    console.log('Fetching Individual scores for FFC league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.FFC_INDIVIDUAL);
  } else if (calculateScores === 'FFC2-Individual') {
    console.log('Fetching Individual scores for FFC-2 league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.FFC2_INDIVIDUAL);
  } else if (calculateScores === 'Hustle-Individual') {
    console.log('Fetching Individual scores for Hustle league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.HUSTLE_INDIVIDUAL);
  } else if (calculateScores === 'FFFL-Individual') {
    console.log('Fetching Individual scores for FFFL league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.FFFL_INDIVIDUAL);
  } else if (calculateScores === 'Haven-Individual') {
    console.log('Fetching Individual scores for Haven league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.HAVEN_INDIVIDUAL);
  } else if (calculateScores === 'FFC-H2H') {
    console.log('Fetching H2H scores for FFC league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.FFC_H2H);
  } else if (calculateScores === 'FFC2-H2H') {
    console.log('Fetching H2H scores for FFC-2 league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.FFC2_H2H);
  } else if (calculateScores === 'Hustle-H2H') {
    console.log('Fetching H2H scores for Hustle league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.HUSTLE_H2H);
  } else if (calculateScores === 'FFFL-H2H') {
    console.log('Fetching H2H scores for FFFL league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.FFFL_H2H);
  } else if (calculateScores === 'Haven-H2H') {
    console.log('Fetching H2H scores for Haven league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.HAVEN_H2H);
  } else if (calculateScores === 'FFC-Ownership') {
    console.log('Fetching Ownership for FFC league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.FFC_OWNERSHIP);
  } else if (calculateScores === 'Hustle-Ownership') {
    console.log('Fetching Ownership for Hustle league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.HUSTLE_OWNERSHIP);
  } else if (calculateScores === 'FFFL-Ownership') {
    console.log('Fetching Ownership for FFFL league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.FFFL_OWNERSHIP);
  } else if (calculateScores === 'Haven-Ownership') {
    console.log('Fetching Ownership for Haven league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.HAVEN_OWNERSHIP);
  } else if (calculateScores === 'Haven-Ownership-Top10') {
    console.log('Fetching Ownership for Haven league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.HAVEN_OWNERSHIP_TOP10);
  } else if (calculateScores === 'Haven-Captains') {
    console.log('Fetching Captains for Haven league');
    return await fullLeague.calculateLeague(fpl, updateConfig, LEAGUE_CONFIGS.HAVEN_CAPTAINS);
  } else if (calculateScores === 'FFC-Chips') {
    console.log('Fetching Chips for FFC league');
    return await chipWriter.updateChips(fpl, updateConfig, LEAGUE_CONFIGS.FFC_CHIPS);
  } else if (calculateScores === 'Hustle-Chips') {
    console.log('Fetching Chips for Hustle league');
    return await chipWriter.updateChips(fpl, updateConfig, LEAGUE_CONFIGS.HUSTLE_CHIPS);
  } else if (calculateScores === 'FFFL-Chips') {
    console.log('Fetching Chips for FFFL league');
    return await chipWriter.updateChips(fpl, updateConfig, LEAGUE_CONFIGS.FFFL_CHIPS);
  } else if (calculateScores === 'Haven-Chips') {
    console.log('Fetching Chips for Haven league');
    return await chipWriter.updateChips(fpl, updateConfig, LEAGUE_CONFIGS.HAVEN_CHIPS);
  } else if (calculateScores === 'Haven-Overall') {
    console.log('Fetching Overall scores for Haven league');
    return await havenScoreReader.getScores(fpl);
  } else if (calculateScores === 'FFC-Cups') {
    console.log('Fetching Cup scores for FFC');
    return await ffcReader.getScores(fpl);
  } else if (calculateScores === 'LiveMatch') {
    console.log('Fetching Live Match Details');
    return await liveMatches.getLiveMatches(fpl);
  } else if (calculateScores === 'Hustle-Rumble') {
    console.log('Fetching Hustle Rumble Eliminations');
    return await hustleRumble.eliminations(fpl);
  } else if (calculateScores.startsWith('Haven-League-Nomination')) {
    console.log('Updating Haven League Nominations');
    return await havenNom.updateNoms('League');
  } else if (calculateScores.startsWith('Haven-CL-Nomination')) {
    console.log('Updating Haven CL Nominations');
    return await havenNom.updateNoms('CL');
  } else if (calculateScores.startsWith('Hustle-Nomination')) {
    var gw = calculateScores.split('::')[1];
    console.log('Updating Hustle Nominations for GW' + gw);
    return await hustleNom.updateNoms(gw);
  } else if (calculateScores.startsWith('FFFL-Nomination')) {
    var gw = calculateScores.split('::')[1];
    console.log('Updating FFFL Nominations for GW' + gw);
    return await ffflNom.updateNoms(gw);
  } else if (calculateScores.startsWith('Noms')) {
    var tournament = calculateScores.split('::')[1];
    console.log('Reading nominations for ' + tournament);
    return await nomsReader.getNoms(tournament);
  } else if (calculateScores.startsWith('PlayerSearch')) {
    var playerName = calculateScores.split('::')[1];
    return await playerDetails.getPlayerDetails(fpl, playerName);
  } else if (calculateScores.startsWith('TeamScore')) {
    var input = calculateScores.split('::')[1];
    return await managerGwScore.getTeamScore(fpl, input);
  }
}

async function runConfig(fpl, updateConfig) {
  console.log('------------------------------\nRunning update for ' + updateConfig.tournament.name);
  var match = await matchCreator.createMatch(fpl, updateConfig);
  if (match === null) {
    return;
  }

  var currEvent = await fpl.init(match.gw);
  var futureGame = match.gw > currEvent;

  var teamWriter = new gwTeamWriter();
  await teamWriter.updateTeams(fpl, updateConfig, match, currEvent, futureGame);

  var diff = new updateConfig.tournament.differential();
  await diff.calculateDiffs(fpl, updateConfig, match, currEvent, futureGame);

  await updateScores(fpl, updateConfig, match, futureGame);
}

async function updateScores(fpl, updateConfig, match, futureGame) {
  var sheetConfig = updateConfig.sheetConfig;
  var calculateScores = sheetConfig.calculateScores;
  if (calculateScores === 'None') {
    console.log('Scores not required');
  } else {
    if (futureGame) {
      console.log('Scores unavailable');
      return;
    }
    if (calculateScores === 'Live') {
      if (!liveScoresDone) {
        console.log('Updating live scores');
        await liveScoreUpdater.updateLive(fpl, match.gw);
        liveScoresDone = true;
        console.log('Live scores updated');
      }
    } else if (calculateScores === 'Final') {
      var calc = new updateConfig.tournament.calculator();
      console.log('Calculating team scores');
      await calc.calculateHome(fpl, sheetConfig, match);
      console.log('Final scores updated in sheet');
    }
  }
}

async function isSendResponse(chatId, updateConfig, response) {
  if (chatId != process.env.personalChannelId && chatId != process.env.leagueChannelId) {
    return true;
  }
  var lastResponse = await dbService.getAlertResponse(updateConfig.tournament.name, updateConfig.sheetConfig.findDiffs, updateConfig.sheetConfig.calculateScores);
  response = response.replace(/'/g, '"');
  if (lastResponse != response) {
    await dbService.updateAlertResponse(updateConfig.tournament.name, updateConfig.sheetConfig.findDiffs, updateConfig.sheetConfig.calculateScores, response);
    return true;
  }
  console.log('Results have not changed. No alert required');
  return false;
}

module.exports = {
  start
}