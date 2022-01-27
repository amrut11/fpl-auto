const Database = require('@replit/database');
const bot = require('../bot/bot-service');
const fplService = require('../processor/request/fpl-service');
const dateUtils = require('../utils/date-utils');

const FPL_CHANNEL_ID = process.env.fplChannelId;

const fpl = new fplService();
const db = new Database();

const PLAYER_PRICES_KEY = 'player-prices';

const SIGNATURE = '\n\nFollow *FPL Alerts* for more updates: https://t.me/fplalerts';

async function checkChanges() {
  try {
    console.log('Checking for price changes');
    await processChanges();
    console.log('Price check complete');
  } catch (err) {
    console.error(err);
    bot.sendMessage(process.env.author, 'On ' + new Date() + ' execution of price change service failed with error ' + err);
  }
}

async function processChanges() {
  await fpl.init(1000);
  var elements = fpl.getElements();
  let risers = fallers = newPlayers = '';
  var prices = await db.get(PLAYER_PRICES_KEY);
  for (var i in elements) {
    var element = elements[i];
    var playerId = element.id;
    var newPrice = element.now_cost;
    var msg = '*' + fpl.getPlayerName(playerId) + '*' + ' (' + fpl.getTeamName(element.team) + '): ' + newPrice / 10 + 'm (' + fpl.getPlayerPosition(element.element_type) + ')\n';
    var oldPrice = prices[playerId];
    if (oldPrice) {
      if (newPrice > oldPrice) {
        risers += '🔼  ' + msg;
        prices[playerId] = newPrice;
      } else if (newPrice < oldPrice) {
        fallers += '🔽  ' + msg;
        prices[playerId] = newPrice;
      }
    } else {
      newPlayers += '▶️  ' + msg;
      prices[playerId] = newPrice;
    }
  }
  sendAlerts(risers.trim(), fallers.trim(), newPlayers.trim());
  await db.set(PLAYER_PRICES_KEY, prices);
}

function sendAlerts(risers, fallers, newPlayers) {
  var isPriceChange = false;
  var date = dateUtils.getFullDate();
  var msg = '*Price changes on ' + date + '*';
  msg += '\n-------------------------\n*Risers*\n-------------------------\n';
  if (risers.length > 0) {
    msg += risers;
    isPriceChange = true;
  } else {
    msg += 'None';
  }
  msg += '\n-------------------------\n*Fallers*\n-------------------------\n';
  if (fallers.length > 0) {
    msg += fallers;
    isPriceChange = true;
  } else {
    msg += 'None';
  }
  if (isPriceChange) {
    msg += SIGNATURE;
    bot.sendMessage(FPL_CHANNEL_ID, msg);
  }
  if (newPlayers.length > 0) {
    var msg = '*New player(s) found on ' + date + '*\n-------------------------\n' + newPlayers + SIGNATURE;
    bot.sendMessage(FPL_CHANNEL_ID, msg);
  }
}

module.exports = { checkChanges }