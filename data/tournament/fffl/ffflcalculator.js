const scorecalculator = require('../../../processor/scoring/tourn-team-score-calculator');

const capMultiplier = 2;
const vcMultiplier = 1.5;
const benchMultiplier = 0.5;

class ffflcalculator extends scorecalculator {

  async calculate(fpl, gw, gwTeam, callback) {
    let scores = [];
    var output = "";
    var players = gwTeam.team.players;
    var playerNames = Object.keys(players);
    for (var i = 0 ; i < playerNames.length; i++) {
      var playerName = playerNames[i];
      var playerId = players[playerName];
      var url = 'https://fantasy.premierleague.com/api/entry/' + playerId + '/event/' + gw + '/picks/';
      var picks = await fpl.downloadPage(url);
      var history = picks.entry_history;
      var playerScore = history.points - history.event_transfers_cost;
      var pName = playerName;
      if (playerName == gwTeam.cap) {
        pName += ' (C)';
        scores.push(playerScore * capMultiplier);
      } else if (playerName == gwTeam.vice) {
        pName += ' (V)';
        scores.push(playerScore * vcMultiplier);
      } else if (playerName == gwTeam.bench) {
        pName += ' (B)';
        scores.push(playerScore * benchMultiplier);
        }else {
        scores.push(playerScore);
      }
      output += pName + ': ' + playerScore + ' ';
    }
    callback(scores.reduce((a, b) => a + b), output);
  }

}

module.exports = ffflcalculator;