const CronJob = require('cron').CronJob;
const alertService = require('../alerts/alert-service');
const priceChangeService = require('../alerts/price-change-service');
const dailyGamesService = require('../alerts/daily-games-service');
const transfersReader = require('../spreadsheet/reader/transfers-reader');

const ALERT_SERVICE_CRON = process.env.ALERT_SERVICE_CRON;
// const PRICE_CHANGE_CRON = process.env.PRICE_CHANGE_CRON;
const PRICE_CHANGE_CRON = process.env.PRICE_CHANGE_PRESEASON;
const DAILY_GAMES_CRON = process.env.DAILY_GAMES_CRON;

var alertServiceJob = new CronJob(ALERT_SERVICE_CRON, async function() {
  await alertService.alert();
}, null, false, 'Asia/Kolkata');

var priceChangeJob = new CronJob(PRICE_CHANGE_CRON, async function() {
  await priceChangeService.checkChanges();
}, null, false, 'Asia/Kolkata');

var dailyGamesJob = new CronJob(DAILY_GAMES_CRON, async function() {
  await dailyGamesService.sendAlert();
  await transfersReader.checkTransfers();
}, null, false, 'Asia/Kolkata');

module.exports = { alertServiceJob, priceChangeJob, dailyGamesJob }