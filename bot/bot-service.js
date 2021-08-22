const botConfig = require('./bot-config');

var bot;

function startBot() {
  bot = botConfig.configure();
}

function getBot() {
  return bot;
}

function sendMessage(chatId, msg) {
  bot.sendMessage(chatId, msg, { parse_mode: 'markdown' });
}

module.exports = { startBot, getBot, sendMessage }