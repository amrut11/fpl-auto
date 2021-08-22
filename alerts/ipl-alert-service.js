const bot = require('../bot/bot-service');
const configCreator = require('../processor/command/command-config-creator');
const start = require('../processor/start');

const dateUtils = require('../utils/date-utils');

const BotCommands = require('../data/enums').BotCommands;

const IPL_CHANNEL_ID = process.env.iplChannelId;
const AUTHOR_ID = process.env.author;

var executing = false;

async function alert() {
  if (executing) {
    console.log('Previous execution overrunning. Discarding current request');
    return;
  }
  executing = true;
  try {
    console.log('Running IPL alert service');
    await executeAlert(BotCommands.IPL_LIVE, IPL_CHANNEL_ID);
    await executeAlert(BotCommands.IPL_SCORE, IPL_CHANNEL_ID);
    await executeAlert(BotCommands.MY_IPL_SCORE, AUTHOR_ID);
  } catch (err) {
    console.error(err);
    console.dir(err.stack);
    bot.sendMessage(process.env.author, 'On ' + dateUtils.getISTTimeMilis() + ' execution of IPL alert service failed with error ' + err);
  } finally {
    executing = false;
  }
}

async function executeAlert(command, channelId) {
  var configs = await configCreator.createConfig(command.command);
  await start.start(bot.getBot(), channelId, configs);
}

module.exports = { alert }