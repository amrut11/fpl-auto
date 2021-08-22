const scorecalculator = require('../../../processor/scoring/tourn-team-score-calculator');

const TC_MULTI = 3;
const CAP_MULTI = 2;
const DVC_MULTI = 2;
const VC_MULTI = 1.5;
const SS_MULTI = 1;
const SUB_MULTI = 0;

const HOME_ADV = 1.01;

class havencalculator extends scorecalculator {

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
      if (playerName == gwTeam.cap) {
        if (gwTeam.chip == 'TC') {
          pName += ' (TC)';
          scores.push(playerScore * TC_MULTI);
        } else {
          pName += ' (C)';
          scores.push(playerScore * CAP_MULTI);
        }
      } else if (playerName == gwTeam.vice) {
        if (gwTeam.chip == 'DVC') {
          pName += ' (DVC)';
          scores.push(playerScore * DVC_MULTI);
        } else {
          pName += ' (V)';
          scores.push(playerScore * VC_MULTI);
        }
      } else if (playerName == gwTeam.bench) {
        if (gwTeam.chip == 'SS') {
          pName += ' (SS)';
          scores.push(playerScore * SS_MULTI);
        } else {
          pName += ' (S)';
          scores.push(playerScore * SUB_MULTI);
        }
      } else {
        scores.push(playerScore);
      }
      output += pName + ': ' + playerScore + ' ';
    }
    var finalScore = scores.reduce((a, b) => a + b) * (gwTeam.isHomeTeam ? HOME_ADV : 1);
    callback(finalScore, output);
  }

}

module.exports = havencalculator;