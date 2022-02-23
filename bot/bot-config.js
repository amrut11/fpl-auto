const TelegramBot = require('node-telegram-bot-api');

const NOM_GROUP_ID = process.env.nomGroupId;

const BotCommands = require('../data/enums').BotCommands;
const commandProcessor = require('../processor/command/command-processor');
const teamIdMap = require('../data/team-id-map');

function configure() {
  bot = new TelegramBot(process.env.botToken, { polling: true });

  bot.onText(/\/new_gw/, async (msg) => {
    commandProcessor.runCommand(BotCommands.NEW_GW, msg.chat.id);
  });

  bot.onText(/\/update_league/, async (msg) => {
    commandProcessor.runCommand(BotCommands.UPDATE_LEAGUE, msg.chat.id);
  });

  bot.onText(/\/update_gw/, async (msg) => {
    commandProcessor.runCommand(BotCommands.UPDATE_GW, msg.chat.id);
  });

  bot.onText(/\/get_info/, async (msg) => {
    commandProcessor.runCommand(BotCommands.GET_INFO, msg.chat.id);
  });

  bot.onText(/\/final_score/, async (msg) => {
    commandProcessor.runCommand(BotCommands.FINAL_SCORE, msg.chat.id);
  });

  bot.onText(/\/get_final_score/, async (msg) => {
    commandProcessor.runCommand(BotCommands.GET_FINAL_SCORE, msg.chat.id);
  });

  bot.onText(/\/get_bonus/, async (msg) => {
    commandProcessor.runCommand(BotCommands.GET_BONUS, msg.chat.id);
  });

  bot.onText(/\/update_details/, async (msg) => {
    commandProcessor.runCommand(BotCommands.UPDATE_DETAILS, msg.chat.id);
  });

  bot.onText(/\/update_live/, async (msg) => {
    commandProcessor.runCommand(BotCommands.UPDATE_LIVE, msg.chat.id);
  });

  bot.onText(/\/get_live_score/, async (msg) => {
    commandProcessor.runCommand(BotCommands.GET_LIVE_SCORE, msg.chat.id);
  });

  bot.onText(/\/update_diffs/, async (msg) => {
    commandProcessor.runCommand(BotCommands.UPDATE_DIFFS, msg.chat.id);
  });

  bot.onText(/\/get_diffs/, async (msg) => {
    commandProcessor.runCommand(BotCommands.GET_DIFFS, msg.chat.id);
  });

  bot.onText(/\/update_teams/, async (msg) => {
    commandProcessor.runCommand(BotCommands.UPDATE_TEAMS, msg.chat.id);
  });

  bot.onText(/\/league_h2h/, async (msg) => {
    commandProcessor.runCommand(BotCommands.LEAGUE_H2H, msg.chat.id);
  });

  bot.onText(/\/league_individual/, async (msg) => {
    commandProcessor.runCommand(BotCommands.LEAGUE_INDIVIDUAL, msg.chat.id);
  });

  bot.onText(/\/league_diffs/, async (msg) => {
    commandProcessor.runCommand(BotCommands.LEAGUE_DIFFS, msg.chat.id);
  });

  bot.onText(/\/league_chips/, async (msg) => {
    commandProcessor.runCommand(BotCommands.LEAGUE_CHIPS, msg.chat.id);
  });

  bot.onText(/\/league_stats/, async (msg) => {
    commandProcessor.runCommand(BotCommands.LEAGUE_STATS, msg.chat.id);
  });

  bot.onText(/\/my_team/, async (msg) => {
    var teamId = teamIdMap.getTeamId(msg.chat.id);
    commandProcessor.runCommand(BotCommands.TEAM_SCORE, msg.chat.id, teamId);
  });

  bot.onText(/[Ff]fc (.+)/, async (msg, match) => {
    commandProcessor.runCommand(BotCommands.FFC_SCORES, msg.chat.id, match[1]);
  });

  bot.onText(/\/haven_league_pp/, async (msg) => {
    var teamId = teamIdMap.getTeamId(msg.chat.id);
    commandProcessor.runCommand(BotCommands.HAVEN_LEAGUE_PP, msg.chat.id, teamId);
  });

  bot.onText(/\/haven_cl_pp/, async (msg) => {
    var teamId = teamIdMap.getTeamId(msg.chat.id);
    commandProcessor.runCommand(BotCommands.HAVEN_CL_PP, msg.chat.id, teamId);
  });

  bot.onText(/[Hh]ustle (.+)/, async (msg, match) => {
    commandProcessor.runCommand(BotCommands.HUSTLE_NOMINATION, msg.chat.id, match[1]);
  });

  bot.onText(/[Ff]ffl (.+)/, async (msg, match) => {
    commandProcessor.runCommand(BotCommands.FFFL_NOMINATION, msg.chat.id, match[1]);
  });

  bot.onText(/[Nn]oms (.+)/, async (msg, match) => {
    commandProcessor.runCommand(BotCommands.NOMS, NOM_GROUP_ID, match[1]);
  });

  bot.onText(/[Pp]layer (.+)/, async (msg, match) => {
    commandProcessor.runCommand(BotCommands.PLAYER_SEARCH, msg.chat.id, match[1]);
  });

  bot.onText(/[Tt]eam (.+)/, async (msg, match) => {
    var split = match[1].split(',');
    var teamId = teamIdMap.getTeamIdByName(split[0]);
    var input = teamId + (split.length > 1 ? (',' + split[1].trim()) : '');
    commandProcessor.runCommand(BotCommands.TEAM_SCORE, msg.chat.id, input);
  });

  return bot;
}

module.exports = { configure }