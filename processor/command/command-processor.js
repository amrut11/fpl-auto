const QueueEventEmitter = require('queue-event-emitter');

const configCreator = require('./command-config-creator');
const start = require('../start');
const db = require('../../db/repldb-service');

const teamIdMap = require('../../data/team-id-map');

const dateUtils = require('../../utils/date-utils');

const COMMAND_EMITTER = new QueueEventEmitter();

var commandRunner = async function(command) {
  bot.sendMessage(command.chatId, 'Execution of ' + command.command + ' started at ' + dateUtils.getISTTimeMilis());
  try {
    var configs = await configCreator.createConfig(command.command, command.input);
    await start.start(bot, command.chatId, configs);
    bot.sendMessage(command.chatId, 'Execution of ' + command.command + ' completed at ' + dateUtils.getISTTimeMilis());
  } catch (err) {
    console.error(err);
    bot.sendMessage(command.chatId, 'Execution of ' + command.command + ' failed with error ' + err);
  }
}

COMMAND_EMITTER.on('RunCommand', commandRunner);

function runCommand(command, chatId, input) {
  if (chatId != process.env.author) {
    db.storeBotAccess(teamIdMap.getTgUser(chatId), command.command + (input ? ' ' + input : ''));
  }
  if (!isAuthorized(command['type'], chatId)) {
    bot.sendMessage(chatId, 'Sorry. You\'re not authorised to use this. Contact @Amrut116 if you wish to gain access.');
    return;
  }
  COMMAND_EMITTER.emit('RunCommand', Object.create({command: command.command, chatId: chatId, input: input}));
}

function isAuthorized(type, chatId) {
  if (type == 'public') {
    return process.env.publicUsers.includes(chatId);
  }
  if (type == 'mod') {
    return process.env.mods.includes(chatId);
  }
  return process.env.admins.includes(chatId);
}

module.exports = { runCommand }