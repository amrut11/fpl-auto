const Database = require('@replit/database');
const dateUtils = require('../../utils/date-utils');

// Send suffix alerts after KO time + SUFFIX_START
const SUFFIX_START = 90 * 60 * 1000;
// Frequency at which suffix changes alerts to be sent
const SUFFIX_FREQUENCY = 15 * 60 * 1000;

const db = new Database();

async function getLiveMatches(fpl) {
  await fpl.init(1000);
  var fixs = fpl.getFixtures();
  var msg = ':::';
  for (var i in fixs) {
    var fix = fixs[i];
    if (fix.started && !fix.finished) {
      var fixDetails = createFixDetails(fix, fpl);
      var fixMsg = createMessage(fixDetails);
      var suffixMsg = createSuffix(fixDetails);
      var now = new Date().getTime();
      var oldMsg = await db.get('fix-' + fix.id);
      if (fixMsg != oldMsg) {
        await db.set('fix-' + fix.id, fixMsg);
        await updateDb(fix.id, suffixMsg, now);
        msg += fixMsg + suffixMsg + ':::';
      } else if (now - fixDetails.koTime > SUFFIX_START) {
        var oldSuffix = await db.get('fix-suffix-' + fix.id);
        if (suffixMsg != oldSuffix) {
          var oldUpdate = await db.get('fix-suffix-update-' + fix.id);
          if (!oldUpdate || now - oldUpdate > SUFFIX_FREQUENCY) {
            await updateDb(fix.id, suffixMsg, now);
            msg += fixMsg + suffixMsg + ':::';
          }
        }
      }
    }
  }
  return msg;
}

function createFixDetails(fix, fpl) {
  var details = new Object();
  details.homeTeam = fpl.getTeamName(fix.team_h);
  details.awayTeam = fpl.getTeamName(fix.team_a);
  details.homeGoals = fix.team_h_score ? fix.team_h_score : 0;
  details.awayGoals = fix.team_a_score ? fix.team_a_score : 0;
  details.minutes = fix.minutes;
  if (fix.kickoff_time) {
    var koTime = new Date(fix.kickoff_time).getTime();
    details.koTime = koTime;
    details.startTime = dateUtils.getISTTime(koTime) + ' (IST)';
  }
  var stats = fix.stats;
  for (var i in stats) {
    var stat = stats[i];
    var statDetails = getStatDetails(stat, fpl);
    if (statDetails) {
      if (stat.identifier == 'goals_scored') {
        details.goals = statDetails;
      } else if (stat.identifier == 'assists') {
        details.assists = statDetails;
      } else if (stat.identifier == 'own_goals') {
        details.own_goals = statDetails;
      } else if (stat.identifier == 'penalties_saved') {
        details.penalties_saved = statDetails;
      } else if (stat.identifier == 'penalties_missed') {
        details.penalties_missed = statDetails;
      } else if (stat.identifier == 'yellow_cards') {
        details.yellow_cards = statDetails;
      } else if (stat.identifier == 'red_cards') {
        details.red_cards = statDetails;
      } else if (stat.identifier == 'saves') {
        details.saves = statDetails;
      } else if (stat.identifier == 'bps') {
        details.bonus = getBonus(stat, fpl);
      }
    }
  }
  return details;
}

function getStatDetails(stat, fpl) {
  var fullStats = stat.a.concat(stat.h);
  var statMsg = '';
  for (var i in fullStats) {
    var fullStat = fullStats[i];
    var playerName = fpl.getPlayerName(fullStat.element);
    var val = fullStat.value;
    statMsg += playerName
    if (val > 1) {
      statMsg += ' (' + val + ')';
    }
    if (i < fullStats.length - 1) {
      statMsg += ', ';
    }
  }
  return statMsg;
}

function getBonus(stat, fpl) {
  var bps = stat.a.concat(stat.h);
  bps.sort(function(a, b) {
    return b.value - a.value;
  });
  var bpsMsg = '';
  var currBps = 1000;
  var bonus = 3;
  var bonusCount = 0;
  for (var i in bps) {
    var bp = bps[i];
    var playerName = fpl.getPlayerName(bp.element);
    if (bp.value < currBps) {
      if (bonusCount >= 3) {
        break;
      }
      bonus = Math.max(bonus - bonusCount, 1); // hack
      currBps = bp.value;
    }
    bonusCount++;
    bpsMsg += playerName + ' (' + bonus + '), ';
  }
  return bpsMsg.length == 0 ? null : bpsMsg.substr(0, bpsMsg.length - 2);
}

function createMessage(fix) {
  var msg = '*🏁 ' + fix.homeTeam + ' vs. ' + fix.awayTeam + '*';
  msg += '\n*🕛 Start: *' + fix.startTime;
  msg += '\n*⚽ Score: *' + fix.homeGoals + ' - ' + fix.awayGoals;
  if (fix.goals) {
    msg += '\n*👟 Goals: *' + fix.goals;
  }
  if (fix.assists) {
    msg += '\n*👊 Assists: *' + fix.assists;
  }
  if (fix.own_goals) {
    msg += '\n*🥅 Own Goals: *' + fix.own_goals;
  }
  if (fix.yellow_cards) {
    msg += '\n*🟨 YC: *' + fix.yellow_cards;
  }
  if (fix.red_cards) {
    msg += '\n*🟥 RC: *' + fix.red_cards;
  }
  if (fix.penalties_saved) {
    msg += '\n*🎯 Pen Saved: *' + fix.penalties_saved;
  }
  if (fix.penalties_missed) {
    msg += '\n*🎯 Pen Miss: *' + fix.penalties_missed;
  }
  return msg;
}

function createSuffix(fix) {
  var msg = '';
  if (fix.bonus) {
    msg += '\n*🍭 Bonus: *' + fix.bonus;
  }
  if (fix.saves) {
    msg += '\n*🧤 Saves: *' + fix.saves;
  }
  return msg;
}

async function updateDb(fixId, suffixMsg, now) {
  await db.set('fix-suffix-' + fixId, suffixMsg);
  await db.set('fix-suffix-update-' + fixId, now);
  await db.set('live-update', now);
}

module.exports = { getLiveMatches }