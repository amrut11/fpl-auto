const ssService = require('../../spreadsheet/spreadsheet-service');
const fplTeam = require('../request/fpl-team');
const diff = require('./diff-finder')

class differential {

  async calculateDiffs(fpl, updateConfig, match, currEvent, futureGame) {
    var sheetConfig = updateConfig.sheetConfig;
    var findDiffs = sheetConfig.findDiffs;
    if (findDiffs != 'Update') {
      console.log('Diffs not required');
      return;
    }
    var gw;
    if (futureGame) {
      console.log('Fetching diffs without FPL bench and captain');
      gw = currEvent;
    } else {
      console.log('Fetching diffs with FPL bench and captain');
      gw = match.gw;
    }

    var ourPlayers = await this.getPicks(fpl, gw, match.areWeHome ? match.homeTeam : match.awayTeam, futureGame);
    var theirPlayers = await this.getPicks(fpl, gw, match.areWeHome ? match.awayTeam : match.homeTeam, futureGame);

    var info = updateConfig.sheetConfig.info;
    var diffs = diff.findDiffs(fpl, ourPlayers, theirPlayers);
    await ssService.updateValue(info, 3, 2, 1, diffs);
  }

  async getPicks(fpl, gw, team, futureGame) {
    var players = team.team.players;
    var playerNames = Object.keys(players);
    var playersMap = new Object();
    for (var i = 0; i < playerNames.length; i++) {
      var playerName = playerNames[i];
      var playerId = players[playerName];
      var multiplier = this.getMultiplier(team, playerName);
      var resp = await fplTeam.getTeam(fpl, playerId, gw);
      diff.populatePlayers(playersMap, resp.picks, multiplier, fpl.getPlayerFixtures(), futureGame);
    }
    return playersMap;
  }

  getMultiplier(team, playerName) {
    return 1;
  }

}

module.exports = differential;