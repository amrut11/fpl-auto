const scorecalculator = require('../../../processor/scoring/tourn-team-score-calculator');

const homeMultiplier = 0.25;

class ffccalculator extends scorecalculator {

  async calculate(fpl, gw, gwTeam, callback) {
    let scores = [];
    var output = "";
    var players = gwTeam.team.players;
    var playerNames = Object.keys(players);
    for (var i = 0; i < playerNames.length; i++) {
      var playerName = playerNames[i];
      var playerId = players[playerName];
      var url = 'https://fantasy.premierleague.com/api/entry/' + playerId + '/event/' + gw + '/picks/';
      var picks = await fpl.downloadPage(url);
      var history = picks.entry_history;
      var playerScore = history.points - history.event_transfers_cost;
      var pName = playerName;
      if (playerName == gwTeam.bench) {
        pName += ' (B)';
      } else if (playerName == gwTeam.cap) {
        pName += ' (C)';
        scores.push(playerScore);
        scores.push(playerScore);
      } else {
        scores.push(playerScore);
      }
      output += pName + ': ' + playerScore + ' ';
    }
    if (gwTeam.isHomeTeam) {
      let maxScore = Math.max.apply(null, scores);
      scores.push(Math.ceil(maxScore * this.getHomeMultiplier()));
    }
    callback(scores.reduce((a, b) => a + b), output);
  }

  getHomeMultiplier() {
    return homeMultiplier;
  }

}

module.exports = ffccalculator;