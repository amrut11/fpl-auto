const fplService = require('../processor/request/fpl-service');

const Database = require('@replit/database');
const dateUtils = require('../utils/date-utils');

const DefaultAlerts = require('../data/default-alerts').DefaultAlerts;

const db = new Database();

async function showRaw() {
  var list = await db.list();
  for (var i in list) {
    if (list[i].includes('b Jayant Yadav') || list[i].includes('Kagiso Rabada')) {
      // await db.delete(list[i]);
      console.dir('deleted ' + list[i]);
    }
  }
}

async function showAll() {
  var list = await db.list();
  var allRecords = new Object();
  allRecords.length = list.length;
  let records = [];
  for (var i in list) {
    if (!list[i].includes('player-price')) {
      records.push(await createRecord(list[i]));
    }
  }
  allRecords.records = records;
  allRecords.length = records.length;
  return allRecords;
}

async function showValue(key) {
  var value = await db.get(key);
  console.dir(value);
  return value;
}

async function showLiveMatchScores() {
  var list = await db.list('fix-');
  return await createResp(list);
}

async function storeBotAccess(user, command) {
  var lastUpdate = await db.get('bot-last-access');
  var time = new Date();
  await db.set('bot-access-' + ++lastUpdate, user + '::' + command + '::' + time);
  await db.set('bot-last-access', lastUpdate);
}

async function showBotAccess() {
  var list = await db.list('bot-access-');
  var botUsage = new Object();
  botUsage.length = list.length;
  let usageDetails = [];
  for (var i in list) {
    usageDetails.push(await createUsageDetail(list[i]));
  }
  botUsage.usageDetails = usageDetails;
  return botUsage;
}

async function showPrices() {
  const fpl = new fplService();
  await fpl.init(1000);
  var list = await db.list('player-price-');
  var prices = new Object();
  prices.length = list.length;
  let priceDetails = [];
  for (var i in list) {
    priceDetails.push(await createPriceDetail(fpl, list[i]));
  }
  prices.priceDetails = priceDetails;
  return prices;
}

async function showAlerts() {
  var dbAlerts = await db.get('alert-config');
  if (dbAlerts == null) {
    return [];
  }
  var allAlerts = new Object();
  let alerts = [];
  for (var i in dbAlerts) {
    alerts.push(await createAlert(dbAlerts[i]));
  }
  allAlerts.alerts = alerts;
  allAlerts.length = alerts.length;
  return allAlerts;
}

async function resetAlerts() {
  await db.set('alert-config', DefaultAlerts);
}

async function clearBotAccess() {
  var list = await db.list('bot-access-');
  for (var i in list) {
    console.log('Deleting bot access: ' + i);
    await db.delete(list[i]);
  }
  await db.set('bot-last-access', 0);
}

async function clearPrices() {
  var list = await db.list('player-price-');
  for (var i in list) {
    console.log('Deleting prices: ' + i);
    await db.delete(list[i]);
  }
}

async function createRecord(id) {
  var record = new Object();
  record.id = id;
  var val = await db.get(id);
  console.log(id + ' ' + val);
  record.value = val;
  return record;
}

async function createUsageDetail(id) {
  var usageDetail = new Object();
  usageDetail.id = id;
  var item = await db.get(id);
  var items = item.split('::');
  usageDetail.userId = items[0];
  usageDetail.command = items[1];
  var time = new Date(items[2]);
  usageDetail.time = dateUtils.getISTTimeSeconds(time.getTime());
  return usageDetail;
}

async function createPriceDetail(fpl, id) {
  var priceDetail = new Object();
  priceDetail.id = id;
  var items = id.split('-');
  priceDetail.name = fpl.getPlayerName(items[items.length - 1]);
  priceDetail.price = await db.get(id);
  return priceDetail;
}

async function createResp(list) {
  var resp = 'Number of records: ' + list.length;
  for (var i in list) {
    var item = await db.get(list[i]);
    resp += '\n' + list[i] + ' : ' + item;
  }
  return resp;
}

async function createAlert(dbAlert) {
  var alert = new Object();
  alert.command = dbAlert.command;
  alert.frequency = dbAlert.frequency;
  alert.diff = ((new Date()).getTime() - dbAlert['last-processed']) / 1000;
  alert['last-checked'] = dateUtils.getISTTimeSeconds(dbAlert['last-checked']);
  alert['last-processed'] = dateUtils.getISTTimeSeconds(dbAlert['last-processed']);
  alert['process-order'] = dbAlert['process-order'];
  alert['is-live'] = dbAlert['is-live'];
  return alert;
}

module.exports = { showRaw, showAll, showValue, showLiveMatchScores, storeBotAccess, showBotAccess, showPrices, showAlerts, resetAlerts, clearBotAccess, clearPrices }