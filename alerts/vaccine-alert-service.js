const bot = require('../bot/bot-service');
const configCreator = require('../processor/command/command-config-creator');
const start = require('../processor/start');

const dateUtils = require('../utils/date-utils');

const BotCommands = require('../data/enums').BotCommands;

const VACCINE_CHANNEL_ID = process.env.vaccineChannelId;

var executing = false;

async function alert() {
  if (executing) {
    console.log('Previous execution overrunning. Discarding current request');
    return;
  }
  executing = true;
  try {
    console.log('Running Vaccine alert service');
    await executeAlert(BotCommands.VACCINE_ALERT, VACCINE_CHANNEL_ID);
  } catch (err) {
    console.error(err);
    console.dir(err.stack);
    bot.sendMessage(process.env.author, 'On ' + dateUtils.getISTTimeMilis() + ' execution of Vaccine alert service failed with error ' + err);
  } finally {
    executing = false;
  }
}

async function executeAlert(command, channelId) {
  var configs = await configCreator.createConfig(command.command);
  await start.start(bot.getBot(), channelId, configs);
}

module.exports = { alert }