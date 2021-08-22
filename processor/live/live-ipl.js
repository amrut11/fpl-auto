const Database = require('@replit/database');
const iplService = require('../request/ipl-service');

const db = new Database();
const ipl = new iplService();

const GAME_NUMBER = parseInt(process.env.IPL_GAME_NO);

const OVERS_FREQUENCY = 5;

async function getScores() {
  await ipl.init(GAME_NUMBER);
  var msg = ':::';
  if (!await isAlertRequired()) {
    return msg;
  }
  var matchDetails = await createDetails();
  var innings = ipl.getInnings();
    msg += '*' + matchDetails.batFirst + ' vs. ' + matchDetails.bowlFirst + '* (' + matchDetails.venue + ')';
    if (matchDetails.lineUp) {
      msg += '\n*Line-up:*\n' + matchDetails.lineUp;
    }
  if (innings.length > 0) {
    if (innings.length > 1) {
      msg += '\n' + createInningsSummary(matchDetails, innings, 0);
      msg += '\n' + createInningsDetails(matchDetails, innings, 1);
    } else {
      msg += '\n' + createInningsDetails(matchDetails, innings, 0);
    }
  }
  msg = msg.replace(/\&/g, 'n');
  return msg;
}

async function isAlertRequired() {
  var key = 'ipl-' + GAME_NUMBER;
  var oldAlert = await db.get(key);
  if (oldAlert == null) {
    await db.set(key, new Object());
    return true;
  }
  var alertRequired = false;
  var currState = ipl.getCurrentState();
  var currInnings = currState.currentInningsIndex;
  if (oldAlert.inProgress != currState.inProgress) {
    oldAlert.inProgress = currState.inProgress;
    alertRequired = true;
  }
  if (oldAlert.innings != currInnings) {
    oldAlert.innings = currInnings;
    alertRequired = true;
  }
  var lineUp = getLineUp(ipl.getMatchInfo());
  if (oldAlert.lineUp != lineUp) {
    oldAlert.lineUp = lineUp;
    alertRequired = true;
  }
  var inning = ipl.getInnings()[currInnings];
  if (inning) {
    var currOvers = Math.floor(inning.overProgress);
    var oldOvers = oldAlert['overs-' + currInnings];
    if (oldOvers == null || currOvers >= (oldOvers + OVERS_FREQUENCY)) {
      oldAlert['overs-' + currInnings] = currOvers;
      alertRequired = true;
    }
    var oldWickets = oldAlert['wickets-' + currInnings];
    if (oldWickets == null || oldWickets != inning.scorecard.wkts) {
      oldAlert['wickets-' + currInnings] = inning.scorecard.wkts;
      alertRequired = true;
    }
  }
  if (alertRequired) {
    await db.set(key, oldAlert);
  }
  return alertRequired;
}

async function createDetails() {
  var matchInfo = ipl.getMatchInfo();
  var lineUp = getLineUp(matchInfo);
  var oldLineup = await db.get('ipl-lineup-' + GAME_NUMBER);
  if (oldLineup == lineUp) {
    lineUp = null;
  } else {
    await db.set('ipl-lineup-' + GAME_NUMBER, lineUp);
  }
  var batFirst = 0, bowlFirst = 1;
  if (matchInfo.battingOrder) {
    batFirst = matchInfo.battingOrder[0];
    bowlFirst = matchInfo.battingOrder[1];
  }
  return { batFirst: matchInfo.teams[batFirst].team.abbreviation, bowlFirst: matchInfo.teams[bowlFirst].team.abbreviation, venue: matchInfo.venue.city, lineUp: lineUp };
}

function getLineUp(matchInfo) {
  var homePlayers = matchInfo.teams[0].players;
  var awayPlayers = matchInfo.teams[1].players;
  if (homePlayers && awayPlayers) {
    var msg = '';
    for (var i in homePlayers) {
      msg += homePlayers[i].shortName + '   ';
    }
    msg += '\n\n';
    for (var i in awayPlayers) {
      msg += awayPlayers[i].shortName + '   ';
    }
    return msg;
  }
  return null;
}

function createInningsSummary(matchDetails, innings, inningsIndex) {
  var inning = innings[inningsIndex];
  var team = inningsIndex == 0 ? matchDetails.batFirst : matchDetails.bowlFirst;
  return '*' + team + ':* ' + inning.scorecard.runs + '/' + inning.scorecard.wkts + ' (' + inning.overProgress + ')';
}

function createInningsDetails(matchDetails, innings, inningsIndex) {
  var summary = createInningsSummary(matchDetails, innings, inningsIndex);
  var msg = summary + '\n';
  var batStats = innings[inningsIndex].scorecard.battingStats;
  msg += '\n' + createBatMsg(batStats);
  var bowlStats = innings[inningsIndex].scorecard.bowlingStats;
  var currBowler = ipl.getCurrentState().currentBowler;
  msg += '\n' + createBowlMsg(bowlStats, currBowler);
  return msg;
}

function createBatMsg(stats) {
  var msg = '*Batsman MOD R (B) 4s 6s*\n';
  for (var i in stats) {
    var stat = stats[i];
    var pName = ipl.getPlayerShortName(stat.playerId);
    if (stat.mod) {
      msg += pName + ' ' + stat.mod.text;
    } else {
      msg += '*' + pName + '^*';
    }
    msg += ' ' + stat.r + ' (' + stat.b + ') ' + stat['4s'] + ' ' + stat['6s'] + '\n';
  }
  return msg;
}

function createBowlMsg(stats, currBowler) {
  var msg = '*Bowler O M R W D*\n';
  for (var i in stats) {
    var stat = stats[i];
    var pName = ipl.getPlayerShortName(stat.playerId);
    if (stat.playerId == currBowler) {
      msg += '*' + pName + '^*';
    } else {
      msg += pName;
    }
    msg += ' ' + stat.ov + '-' + stat.maid + '-' + stat.r + '-' + stat.w + ' ' + stat.d + '\n';
  }
  return msg;
}


module.exports = { getScores }