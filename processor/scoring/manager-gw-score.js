const scoreService = require('./live-gw-score-service');
const fplTeam = require('../request/fpl-team');

async function getTeamScore(fpl, input) {
  var gw = await fpl.init(1000);
  var split = input.split(',');
  var playerId = split[0];
  if (split.length > 1) {
    gw = split[1];
    await fpl.init(gw);
  }
  var msg = '*LIVE SCORES FOR GW ' + gw + '*\n';
  msg += await getPlayerName(fpl, playerId);
  msg += '\n---------------------\n';
  msg += await getScore(fpl, playerId, gw);
  return msg;
}

async function getPlayerName(fpl, playerId) {
  var url = 'https://fantasy.premierleague.com/api/entry/' + playerId + '/';
  var details = await fpl.downloadPage(url);
  var playerName = details.player_first_name + ' ' + details.player_last_name;
  return '*Player Name: ' + playerName + '*';
}

async function getScore(fpl, playerId, gw) {
  var msg = '';
  var team = await fplTeam.getTeam(fpl, playerId, gw);
  if (team.active_chip) {
    msg += '*Chip used: *' + team.active_chip;
    msg += '\n---------------------\n';
  }
  var liveScores = scoreService.getLivePoints(fpl, gw);
  msg += getPlayersScore(fpl, team, liveScores);
  return msg;
}

function getPlayersScore(fpl, team, liveScores) {
  var msg = '';
  var totalScore = 0;
  var history = team.entry_history;
  var picks = team.picks;
  for (var i = 0; i < picks.length; i++) {
    var pick = picks[i];
    var pName = fpl.getPlayerName(pick.element);
    var pScore = liveScores[pick.element];

    var dispScore = pick.multiplier == 0 ? pScore : pScore * pick.multiplier;
    pScore = pScore * pick.multiplier;
    totalScore += pScore;

    if (i == 11) {
      msg += '---------------------\n';
    }
    msg += '*' + pName;
    if (pick.is_captain) {
      msg += ' (C)';
    } else if (pick.is_vice_captain) {
      msg += ' (VC)';
    }
    msg += ':* ' + dispScore + '\n';
  }
  msg += '---------------------\n';
  if (history.event_transfers_cost > 0) {
    msg += '*Hits: *-' + history.event_transfers_cost;
    msg += '\n---------------------\n';
  }
  msg += '*Total score: *' + (totalScore - history.event_transfers_cost);
  return msg;
}

module.exports = { getTeamScore }