const bot = require('./bot/bot-service');
const cronjobs = require('./jobs/cronjobs');

const sheetConfigCreator = require('./processor/sheet/sheet-config-creator');

const start = require('./processor/start');
const alertService = require('./alerts/alert-service');
const duplicates = require('./processor/request/duplicate-names');
const db = require('./db/repldb-service');

const hmtRanks = require('./processor/request/hmt-ranks');
const fplDataWriter = require('./spreadsheet/writer/fpl-data-writer');
const plannerTeamsWriter = require('./spreadsheet/writer/planner-teams-writer');
const euroDataWriter = require('./spreadsheet/writer/euro-data-writer');

const ipl = require('./alerts/ipl-alert-service');
const vaccine = require('./alerts/vaccine-alert-service');
const priceChange = require('./alerts/price-change-service');

const havenHistory = require('./processor/history/haven-history');

const express = require('express');
const ejs = require('ejs');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

var init = false;

app.get('/haven-history', async function(req, res) {
  var response = await havenHistory.getHistory();
  res.render('index', { message: response });
});

app.get('/', async function(req, res) {
  res.render('index');
});

app.get('/update', async function(req, res) {
  var updateConfigs = await sheetConfigCreator.createConfigs();
  await start.start(null, null, updateConfigs);
  res.render('index');
});

app.get('/alert', async function(req, res) {
  await alertService.alert();
  res.render('index');
});

app.get('/duplicates', async function(req, res) {
  var dups = await duplicates.findDuplicates();
  res.render('index', { message: dups });
});

app.get('/allRecords', async function(req, res) {
  var response = await db.showAll();
  res.render('index', { allRecords: response });
});

app.get('/bot-usage', async function(req, res) {
  var response = await db.showBotAccess();
  res.render('index', { botUsage: response });
});

app.get('/prices', async function(req, res) {
  var response = await db.showPrices();
  res.render('index', { prices: response });
});

app.get('/ranks', async function(req, res) {
  var response = await hmtRanks.getRanks();
  res.render('index', { ranks: response });
});

app.get('/showAlerts', async function(req, res) {
  var alerts = await db.showAlerts();
  res.render('index', { allAlerts: alerts });
});

app.get('/resetAlerts', async function(req, res) {
  await db.resetAlerts();
  res.render('index');
});

app.get('/ipl', async function(req, res) {
  await ipl.alert();
  res.render('index');
});

app.get('/vaccine', async function(req, res) {
  await vaccine.alert();
  res.render('index');
});

app.get('/raw', async function(req, res) {
  await db.showRaw();
  res.render('index');
});

app.get('/fdr', async function(req, res) {
  await fplDataWriter.updatePlayers();
  // await plannerTeamsWriter.updateTeams();
  res.render('index');
});

app.get('/euro', async function(req, res) {
  await euroDataWriter.updatePlayerData();
  res.render('index');
});

app.get('/price-change', async function(req, res) {
  await priceChange.checkChanges();
  res.render('index');
});

app.listen(PORT, function() {
  if (!init) {
    bot.startBot();
    cronjobs.startJobs();
    init = true;
  }
  console.log('Example app listening on port ' + PORT + '!');
});