const Database = require('@replit/database');
const bot = require('../bot/bot-service');
const fplService = require('../processor/request/fpl-service');
const dateUtils = require('../utils/date-utils');

const FPL_CHANNEL_ID = process.env.fplChannelId;

const fpl = new fplService();
const db = new Database();

const PLAYER_STATUS_KEY = 'player-status';

const SIGNATURE = '\n\nFollow *FPL Alerts* for more updates: https://t.me/fplalerts';

async function checkChanges() {
  try {
    console.log('Checking for status changes');
    await processChanges();
    console.log('Status check complete');
  } catch (err) {
    console.error(err);
    bot.sendMessage(process.env.author, 'On ' + new Date() + ' execution of status change service failed with error ' + err);
  }
}

async function processChanges() {
  await fpl.init(1000);
  var elements = fpl.getElements();
  let risers = fallers = newPlayers = availability = '';
  var statuses = await db.get(PLAYER_STATUS_KEY);
  for (var i in elements) {
    var element = elements[i];
    var playerId = element.id;
    var newPrice = element.now_cost;
    var chance = element.chance_of_playing_next_round;
    var newsAdded = element.news_added;
    var newStatus = { 'price': newPrice, 'chance': chance, 'newsAdded': newsAdded };
    var msg = '*' + fpl.getPlayerName(playerId) + '*' + ' (' + fpl.getTeamName(element.team) + '): ' + newPrice / 10 + 'm (' + fpl.getPlayerPosition(element.element_type) + ')\n';
    var oldStatus = statuses[playerId];
    if (oldStatus) {
      if (newPrice > oldStatus.price) {
        risers += '🔼  ' + msg;
        statuses[playerId] = newStatus;
      } else if (newPrice < oldStatus.price) {
        fallers += '🔽  ' + msg;
        statuses[playerId] = newStatus;
      }
      if (newsAdded != oldStatus.newsAdded) {
        if (chance == 0) {
          availability += '❌ *';
        } else if (chance == 100 || chance == null) {
          availability += '✅ *';
        } else {
          availability += '⚠ *';
        }
        availability += fpl.getPlayerName(playerId) + '*' + ' (' + fpl.getTeamName(element.team) + ' / ' + fpl.getPlayerPosition(element.element_type) + ') - ' + element.news + '\n';
        statuses[playerId] = newStatus;
      }
    } else {
      newPlayers += '▶️  ' + msg;
      statuses[playerId] = newStatus;
    }
  }
  sendAlerts(risers.trim(), fallers.trim(), newPlayers.trim(), availability.trim());
  await db.set(PLAYER_STATUS_KEY, statuses);
}

function sendAlerts(risers, fallers, newPlayers, availability) {
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
  if (availability.length > 0) {
    var msg = '*Player Status Update ' + '*\n-------------------------\n' + availability + SIGNATURE;
    bot.sendMessage(FPL_CHANNEL_ID, msg);
  }
}

module.exports = { checkChanges }