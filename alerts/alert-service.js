const fplService = require('../processor/request/fpl-service');
const bot = require('../bot/bot-service');

const configCreator = require('../processor/command/command-config-creator');
const start = require('../processor/start');

const dbService = require('../db/alert-db-service');
const Database = require('@replit/database');

const dateUtils = require('../utils/date-utils');

const PERSONAL_CHANNEL_ID = process.env.personalChannelId;
const LEAGUE_CHANNEL_ID = process.env.leagueChannelId;
const LIVE_MATCH_CHANNEL_ID = process.env.fplChannelId;

// process for 12 hours after last game to capture updates
const TIME_TO_PROCESS_FINISHED = 12 * 60 * 60 * 1000;
// start processing next game from 45 minutes the start
const TIME_TO_START_BEFORE_GW = 45 * 60 * 1000;

const LEAGUE_ALERT_COMMANDS = ['get_bonus', 'league_h2h', 'league_individual', 'haven_overall', 'league_diffs'];

const fpl = new fplService();
const db = new Database();

var executing = false;

async function alert() {
  if (executing) {
    console.log('Previous execution overrunning. Discarding current request');
    return;
  }
  executing = true;
  try {
    await fpl.init(1000);
    if (!isMatchOngoing()) {
      console.log('No FPL games to alert');
      return;
    }
    var alerts = await dbService.getAlerts();
    if (!alerts || alerts.length < 1) {
      console.log('No alerts found');
      return;
    }
    await executeAlerts(alerts);
  } catch (err) {
    console.error(err);
    console.dir(err.stack);
    bot.sendMessage(process.env.author, 'On ' + dateUtils.getISTTimeMilis() + ' execution of alert service failed with error ' + err);
  } finally {
    executing = false;
  }
}

function isMatchOngoing() {
  const now = new Date();
  var timeSinceLastMatch = now - fpl.getLatestCompletedMatchTime();
  var timeToNextMatch = fpl.getNextMatchTime() - now;
  var curGwRequired = fpl.isAnyLiveMatch() || timeSinceLastMatch < TIME_TO_PROCESS_FINISHED;
  var nextGwRequired = fpl.isGwOngoing() && timeToNextMatch < TIME_TO_START_BEFORE_GW;
  return curGwRequired || nextGwRequired;
}

async function executeAlerts(allAlerts) {
  console.log('Running alert service');
  var alerts = await findAlerts(allAlerts);
  if (alerts.length > 0) {
    for (var i in alerts) {
      var alert = alerts[i];
      var command = alert.command;
      console.log('Executing command ' + command);
      var configs = await configCreator.createConfig(command);
      var chatId;
      if (command === 'live_matches') {
        chatId = LIVE_MATCH_CHANNEL_ID;
      } else {
        chatId = LEAGUE_ALERT_COMMANDS.includes(command) ? LEAGUE_CHANNEL_ID : PERSONAL_CHANNEL_ID;
      }
      await start.start(bot.getBot(), chatId, configs);
      await dbService.updateAlert(alert['process-order'], 'last-processed');
    }
  } else {
    console.log('No alerts to process currently')
  }
}

async function findAlerts(allAlerts) {
  let alerts = [];
  for (var i in allAlerts) {
    var alert = allAlerts[i];
    const now = (new Date()).getTime();
    var timeElapsed = (now - alert['last-processed']) / 1000 > alert.frequency;
    if (timeElapsed) {
      if (fpl.isAnyLiveMatch()) {
        if (alert['is-live']) {
          var liveUpdate = await db.get('live-update');
          if (alert.command == 'get_live_score' || alert.command == 'league_h2h' || alert.command == 'personal_fast') {
            if ((liveUpdate - alert['last-processed']) > 0) {
              alerts.push(alert);
            }
          } else {
            alerts.push(alert);
          }
        }
      } else {
        if (!alert['is-live']) {
          alerts.push(alert);
        }
      }
    }
    await dbService.updateAlert(alert['process-order'], 'last-checked');
  }
  return alerts;
}

module.exports = { alert }