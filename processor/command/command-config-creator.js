const ssService = require('../../spreadsheet/spreadsheet-service');
const interfaces = require('../../data/interfaces');
const BotCommands = require('../../data/enums').BotCommands;
const tournMap = require('../../data/enums').TOURN_MAP;
const matchConfigMap = require('../../data/enums').MATCH_CONFIG_MAP;

const TOURNAMENTS = ['FFC', 'Hustle', 'Haven', 'FFFL'];

async function createConfig(command, input) {
  let configs = [];
  switch (command) {
    case BotCommands.NEW_GW.command:
      await addCompositeConfig(configs, BotCommands.UPDATE_DETAILS, BotCommands.UPDATE_DIFFS, BotCommands.UPDATE_TEAMS, BotCommands.LEAGUE_CHIPS, BotCommands.LEAGUE_STATS);
      break;
    case BotCommands.UPDATE_LEAGUE.command:
      await addCompositeConfig(configs, BotCommands.LEAGUE_INDIVIDUAL, BotCommands.LEAGUE_H2H, BotCommands.LEAGUE_DIFFS);
      break;
    case BotCommands.UPDATE_GW.command:
      await addCompositeConfig(configs, BotCommands.UPDATE_LIVE, BotCommands.UPDATE_DIFFS);
      break;
    case BotCommands.GET_INFO.command:
      await addCompositeConfig(configs, BotCommands.GET_DIFFS, BotCommands.GET_LIVE_SCORE);
      break;
    case BotCommands.UPDATE_DETAILS.command:
      await addConfigs(configs, 'Yes', 'None', 'None', 'None');
      break;
    case BotCommands.UPDATE_LIVE.command:
      await addScoringConfig(configs, 'FFC', 'Live');
      break;
    case BotCommands.GET_LIVE_SCORE.command:
      await addConfigs(configs, 'No', 'None', 'None', 'ReadLive');
      break;
    case BotCommands.UPDATE_DIFFS.command:
      await addConfigs(configs, 'No', 'None', 'Update', 'None');
      break;
    case BotCommands.GET_DIFFS.command:
      await addConfigs(configs, 'No', 'None', 'Read', 'None');
      break;
    case BotCommands.UPDATE_TEAMS.command:
      await addConfigs(configs, 'No', 'Yes', 'None', 'None');
      break;
    case BotCommands.FINAL_SCORE.command:
      await addConfigs(configs, 'No', 'None', 'None', 'Final');
      break;
    case BotCommands.GET_FINAL_SCORE.command:
      await addConfigs(configs, 'No', 'None', 'None', 'ReadFinal');
      break;
    case BotCommands.LEAGUE_H2H.command:
      await addScoringConfig(configs, 'Haven', 'Haven-Overall');
      break;
    case BotCommands.LEAGUE_INDIVIDUAL.command:
      await addScoringConfig(configs, 'Haven', 'Haven-Individual');
      await addScoringConfig(configs, 'Haven', 'Haven-H2H');
      await addScoringConfig(configs, 'Haven', 'Haven-Ownership-Top10');
      // await addDiffConfig(configs, 'Haven', 'Haven-CL');
      break;
    case BotCommands.LEAGUE_DIFFS.command:
      await addDiffConfig(configs, 'Haven', 'Haven-H2H');
      break;
    case BotCommands.PERSONAL_FAST.command:
      // await addScoringConfig(configs, 'FFC', 'FFC-H2H');
      await addScoringConfig(configs, 'FFFL', 'FFFL-H2H');
      await addScoringConfig(configs, 'Hustle', 'Hustle-H2H');
      configs.push(createCustomUpdateConfig('HUSTLE RUMBLE', 'Hustle-Rumble'));
      break;
    case BotCommands.PERSONAL_SLOW.command:
      // await addScoringConfig(configs, 'FFC', 'FFC-Individual');
      await addScoringConfig(configs, 'Hustle', 'Hustle-Individual');
      await addScoringConfig(configs, 'FFFL', 'FFFL-Individual');

      await addDiffConfig(configs, 'Hustle', 'Hustle-H2H');
      await addDiffConfig(configs, 'FFFL', 'FFFL-H2H');
      break;
    case BotCommands.LEAGUE_CHIPS.command:
      await addScoringConfig(configs, 'FFC', 'FFC-Chips');
      await addScoringConfig(configs, 'Hustle', 'Hustle-Chips');
      await addScoringConfig(configs, 'FFFL', 'FFFL-Chips');
      await addScoringConfig(configs, 'Haven', 'Haven-Chips');
      break;
    case BotCommands.LEAGUE_STATS.command:
      // await addScoringConfig(configs, 'FFC', 'FFC-Ownership');
      await addScoringConfig(configs, 'Hustle', 'Hustle-Ownership');
      await addScoringConfig(configs, 'FFFL', 'FFFL-Ownership');
      await addScoringConfig(configs, 'Haven', 'Haven-Ownership');
      await addScoringConfig(configs, 'Haven', 'Haven-Captains');
      break;
    case BotCommands.GET_BONUS.command:
      configs.push(createCustomUpdateConfig('Bonus Points', 'ReadBonus', input));
      break;
    case BotCommands.LIVE_MATCHES.command:
      configs.push(createCustomUpdateConfig('Live Match Alert', 'LiveMatch', input));
      break;
    case BotCommands.HAVEN_LEAGUE_PP.command:
      configs.push(createCustomUpdateConfig('Haven League Nomination', 'Haven-League-Nomination', input));
      break;
    case BotCommands.HAVEN_CL_PP.command:
      // configs.push(createCustomUpdateConfig('Haven CL Nomination', 'Haven-Cl-Nomination', input));
      break;
    case BotCommands.HUSTLE_NOMINATION.command:
      configs.push(createCustomUpdateConfig('Hustle Nomination', 'Hustle-Nomination', input));
      break;
    case BotCommands.FFFL_NOMINATION.command:
      configs.push(createCustomUpdateConfig('FFFL Nomination', 'FFFL-Nomination', input));
      break;
    case BotCommands.NOMS.command:
      configs.push(createCustomUpdateConfig('Nominations', 'Noms', input));
      break;
    case BotCommands.PLAYER_SEARCH.command:
      configs.push(createCustomUpdateConfig('Player Search', 'PlayerSearch', input));
      break;
    case BotCommands.TEAM_SCORE.command:
      configs.push(createCustomUpdateConfig('Team Score', 'TeamScore', input));
      break;
    case BotCommands.IPL_LIVE.command:
      configs.push(createCustomUpdateConfig('Live IPL', 'IPL-Live', input));
      break;
    case BotCommands.IPL_SCORE.command:
      configs.push(createCustomUpdateConfig('IPL Score', 'IPL-Score', input));
      break;
    case BotCommands.MY_IPL_SCORE.command:
      configs.push(createCustomUpdateConfig('IPL Score', 'My-IPL-Score', input));
      break;
    case BotCommands.VACCINE_ALERT.command:
      configs.push(createCustomUpdateConfig('Bangalore Vaccine', 'vaccine', input));
      break;
  }
  return configs;
}

async function addConfigs(configs, updateDetails, updateTeams, findDiffs, calculateScores) {
  for (var i in TOURNAMENTS) {
    configs.push(await createBotConfig(TOURNAMENTS[i], updateDetails, updateTeams, findDiffs, calculateScores));
  }
}

async function addDiffConfig(configs, tournament, findDiffs) {
  configs.push(await createBotConfig(tournament, 'No', 'None', findDiffs, 'None'));
}

async function addScoringConfig(configs, tournament, calculateScores) {
  configs.push(await createBotConfig(tournament, 'No', 'None', 'None', calculateScores));
}

async function addCompositeConfig(configs, ...commands) {
  for (var i in commands) {
    configs.push(...await createConfig(commands[i].command));
  }
}

async function createBotConfig(tournName, updateDetails, updateTeams, findDiffs, calculateScores) {
  var tournament = tournMap[tournName];
  var sheetDoc = await ssService.getDoc(tournament.sheetId);
  var sheetConfig = new interfaces.SheetConfig(sheetDoc, updateDetails, updateTeams, findDiffs, calculateScores);
  return new interfaces.UpdateConfig(tournament, sheetConfig, matchConfigMap[tournName]);
}

function createCustomUpdateConfig(tournName, scoreType, input) {
  var tournament = new interfaces.Tournament(tournName);
  var calculateScores = scoreType;
  if (input) {
    calculateScores += '::' + input;
  }
  var sheetConfig = new interfaces.SheetConfig(null, null, null, null, calculateScores);
  return new interfaces.UpdateConfig(tournament, sheetConfig);
}

module.exports = {
  createConfig
}