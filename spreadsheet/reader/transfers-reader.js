const Database = require('@replit/database');
const bot = require('../../bot/bot-service');
const ssService = require('../spreadsheet-service')

const NOMS_GROUP_ID = process.env.nomGroupId;
const HUSTLE_TRACKER_SHEET_ID = process.env.HUSTLE_TRACKER_SHEET_ID;
const FFFL_TRACKER_SHEET_ID = process.env.FFFL_TRACKER_SHEET_ID;

const db = new Database();

const TRANSFER_PREFIX = 'transfer-';

async function checkTransfers() {
  try {
    console.log('Checking for transfers');
    await processTransfers();
    console.log('Transfer check complete');
  } catch (err) {
    console.error(err);
    bot.sendMessage(process.env.author, 'On ' + new Date() + ' execution of transfer reader failed with error ' + err);
  }
}

async function processTransfers() {
  let tournTransfers = [];
  var hustleTfs = await getTfs(HUSTLE_TRACKER_SHEET_ID, 1, true);
  await getNewTfs('Hustle', hustleTfs, tournTransfers);
  var ffflTfs = await getTfs(FFFL_TRACKER_SHEET_ID, 0, false);
  await getNewTfs('FFFL', ffflTfs, tournTransfers);
  sendAlerts(tournTransfers);
}

async function getTfs(sheetId, colOffset, split) {
  let tfs = [];
  var sheet = await ssService.getSheet(sheetId, 'Transfers', 30, 8);
  for (var i = 3; i <= 10; i++) {
    var team = ssService.getValue(sheet, i, 2 + colOffset);
    if (team == '') {
      break;
    }
    var outName = ssService.getValue(sheet, i, 3 + colOffset);
    var outId = ssService.getValue(sheet, i, 6 + colOffset);
    outId = split ? outId.split('/')[4] : outId;
    var inName = ssService.getValue(sheet, i + 10, 3 + colOffset);
    var inId = ssService.getValue(sheet, i + 10, 6 + colOffset);
    inId = split ? inId.split('/')[4] : inId;
    tfs.push({ team: team, outName: outName, outId: outId, inName: inName, inId: inId });
  }
  return tfs;
}

async function getNewTfs(tournName, allTfs, tournTransfers) {
  var lastTfs = await db.get(TRANSFER_PREFIX + tournName);
  if (!lastTfs) {
    lastTfs = 0;
  }
  if (lastTfs != allTfs.length) {
    let finalTfs = [];
    for (var i = lastTfs; i < allTfs.length; i++) {
      finalTfs.push(allTfs[i]);
    }
    tournTransfers.push({ tournName: tournName, transfers: finalTfs });
    await db.set(TRANSFER_PREFIX + tournName, allTfs.length);
  }
}

function sendAlerts(tournTransfers) {
  for (var i in tournTransfers) {
    var message = '*' + tournTransfers[i].tournName + ' Transfers*\n-------------------------';
    var tfs = tournTransfers[i].transfers;
    for (var j in tfs) {
      message += '\n' + tfs[j].team + ' ' + tfs[j].inName + ' (' + tfs[j].inId + ') for ' + tfs[j].outName + ' (' + tfs[j].outId + ')';
    }
    bot.sendMessage(NOMS_GROUP_ID, message);
  }
}

module.exports = { checkTransfers }