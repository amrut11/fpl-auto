const Database = require('@replit/database');
const ssService = require('../spreadsheet-service');

const SHEET_ID = process.env.IPL_SHEET_ID;
const MY_SHEET_ID = process.env.MY_IPL_SHEET_ID;

const TAB_INDEX = 0;
const MATCH_NO = Math.round((parseInt(process.env.IPL_GAME_NO) + 1) / 4, 0);

const MARGIN_DIFF = 25;

const db = new Database();

async function readScores() {
  var msg = '*LIVE IPL SCORES FOR MATCH ' + MATCH_NO + '*';
  msg += '\n---------------------';
  var info = await ssService.getInfo(SHEET_ID);
  var sheet = info.worksheets[TAB_INDEX];
  var cells = await ssService.getCellsLimited(sheet, 92, 6);
  var startRow = (MATCH_NO - 1) * 7 + 2;
  for (var rowNum = startRow; rowNum < startRow + 7; rowNum++) {
    var homeTeam = ssService.getCell(cells, rowNum, 2, 6).value;
    homeTeam = homeTeam.split(' ')[0];
    var homeScore = Math.round(ssService.getCell(cells, rowNum, 3, 6).value);
    var awayTeam = ssService.getCell(cells, rowNum, 6, 6).value;
    awayTeam = awayTeam.split(' ')[0];
    var awayScore = Math.round(ssService.getCell(cells, rowNum, 5, 6).value);
    var margin = Math.abs(homeScore - awayScore);
    if (homeScore > awayScore) {
      msg += '\n*' + homeTeam + ' - ' + homeScore + '* (' + margin + ') ' + awayScore + ' - ' + awayTeam;
    } else {
      msg += '\n' + homeTeam + ' - ' + homeScore + ' (' + margin + ') *' + awayScore + ' - ' + awayTeam + '*';
    }
  }
  return msg;
}

async function readMyScores() {
  var msg = '';
  var info = await ssService.getInfo(MY_SHEET_ID);
  var sheet = info.worksheets[1];
  var cells = await ssService.getCellsLimited(sheet, 25, 27);
  var ourScore = Math.round(ssService.getCell(cells, 25, 24, 27).value);
  var theirScore = Math.round(ssService.getCell(cells, 25, 25, 27).value);
  var overall = Math.round(ssService.getCell(cells, 25, 26, 27).value);
  var margin = Math.abs(ourScore - theirScore);
  if (ourScore > theirScore) {
    msg += '*' + 'Us' + ' - ' + ourScore + '* (' + margin + ') ' + theirScore + ' - ' + 'Them';
  } else {
    msg += 'Us' + ' - ' + ourScore + ' (' + margin + ') *' + theirScore + ' - ' + 'Them' + '*';
  }
  msg += '\n' + '*Overall: *' + overall;
  var prevMsg = await db.get('my-ipl');
  if (prevMsg != msg) {
    await db.set('my-ipl', msg);
    return msg;
  }
  return ':::';
}

async function readSubs() {
  var msg = '*Subs Count*';
  msg += '\n---------------------';
  var info = await ssService.getInfo(MY_SHEET_ID);
  var sheet = info.worksheets[2];
  var cells = await ssService.getCellsLimited(sheet, 15, 19);
  var newSubs = new Object();
  for (var i = 2; i <= 15; i++) {
    var team = ssService.getCell(cells, i, 18, 19).value;
    var subs = parseInt(ssService.getCell(cells, i, 19, 19).value);
    newSubs[team] = subs;
  }
  var oldSubs = await db.get('my-ipl-subs');
  var subsChanged = false;
  if (oldSubs == null) {
    oldSubs = new Object();
    subsChanged = true;
  }
  for (var i in newSubs) {
    var oldSub = parseInt(oldSubs[i]);
    var newSub = parseInt(newSubs[i]);
    msg += '\n*' + i + '*: ' + newSub;
    if (oldSub && oldSub != newSub) {
      msg += ' (' + (oldSub - newSub) + ')';
      subsChanged = true;
    }
  }
  if (subsChanged) {
    await db.set('my-ipl-subs', newSubs);
    return msg;
  }
  return ':::';
}

module.exports = { readScores, readMyScores, readSubs }