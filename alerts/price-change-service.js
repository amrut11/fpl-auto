const Database = require('@replit/database');
const bot = require('../bot/bot-service');
const fplService = require('../processor/request/fpl-service');

const dbService = require('../db/price-db-service');

const FPL_CHANNEL_ID = process.env.fplChannelId;

const fpl = new fplService();
const db = new Database();

const dateFormat = require('dateformat');

const PRICE_CHANGE_PREFIX = 'player-price-';

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
  for (var i in elements) {
    var element = elements[i];
    var playerId = element.id;
    var playerName = fpl.getPlayerName(playerId);
    playerId += '';
    playerTeam = fpl.getTeamName(element.team);
    playerPosition = fpl.getPlayerPosition(element.element_type);
    var oldPrice = await db.get(PRICE_CHANGE_PREFIX + playerId);
    var newPrice = element.now_cost;
    var priceChange = '*' + playerName + '*' + ' (' + playerTeam + '): ' + newPrice / 10 + 'm (' + playerPosition + ')\n';
    if (oldPrice) {
      if (newPrice > oldPrice) {
        risers += '🔼  ' + priceChange;
        await db.set(PRICE_CHANGE_PREFIX + playerId, newPrice);
      } else if (newPrice < oldPrice) {
        fallers += '🔽  ' + priceChange;
        await db.set(PRICE_CHANGE_PREFIX + playerId, newPrice);
      }
    } else {
      newPlayers += '▶️  ' + priceChange;
      await db.set(PRICE_CHANGE_PREFIX + playerId, newPrice);
    }
  }
  sendAlerts(risers.trim(), fallers.trim(), newPlayers.trim());
}

function sendAlerts(risers, fallers, newPlayers) {
  var sendMessage = false;
  var date = dateFormat(new Date(), 'dd mmm yyyy');
  var message = '*Price changes on ' + date + '*';
  message += '\n-------------------------\n*Risers*\n-------------------------\n';
  if (risers.length > 0) {
    message += risers;
    sendMessage = true;
  } else {
    message += 'None';
  }
  message += '\n-------------------------\n*Fallers*\n-------------------------\n';
  if (fallers.length > 0) {
    message += fallers;
    sendMessage = true;
  } else {
    message += 'None';
  }
  if (sendMessage) {
    message += SIGNATURE;
    bot.sendMessage(FPL_CHANNEL_ID, message);
  }
  if (newPlayers.length > 0) {
    var message = newPlayers + SIGNATURE;
    bot.sendMessage(FPL_CHANNEL_ID, '*New player(s) found on ' + date + '*\n-------------------------\n' + message);
  }
}

async function processChangesFromElephant() {
  var currentPrices = await dbService.getAllPlayers();
  await fpl.init(1000);
  var elements = fpl.getElements();
  let risers = fallers = newPlayers = '';
  for (var i in elements) {
    var element = elements[i];
    var playerId = element.id;
    var playerName = fpl.getPlayerName(playerId);
    playerTeam = fpl.getTeamName(element.team);
    playerPosition = fpl.getPlayerPosition(element.element_type);
    var oldPrice = getCurrentPrice(currentPrices, playerId);
    var newPrice = element.now_cost;
    var priceChange = '*' + playerName + '*' + ' (' + playerTeam + '): ' + newPrice / 10 + 'm (' + playerPosition + ')\n';
    if (oldPrice) {
      if (newPrice > oldPrice) {
        risers += '🔼  ' + priceChange;
        dbService.updateNewPrice(playerId, newPrice);
      } else if (newPrice < oldPrice) {
        fallers += '🔽  ' + priceChange;
        dbService.updateNewPrice(playerId, newPrice);
      }
    } else {
      newPlayers += '▶️  ' + priceChange;
      await dbService.addNewPlayer(playerId, playerName, newPrice);
    }
  }
  sendAlerts(risers.trim(), fallers.trim(), newPlayers.trim());
}

function getCurrentPrice(currentPrices, playerId) {
  for (var i in currentPrices) {
    var currentPrice = currentPrices[i];
    if (currentPrice.player_id == playerId) {
      return currentPrice.player_price;
    }
  }
  return null;
}

module.exports = { checkChanges }