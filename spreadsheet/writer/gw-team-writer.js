const ssService = require('../spreadsheet-service');
const fplTeam = require('../../processor/request/fpl-team');

const TEAMS_TAB_INDEX = 9;

class GwTeamUpdater {

  async updateTeams(fpl, updateConfig, match, currEvent, futureGame) {
    var gw = futureGame ? currEvent : match.gw;
    var sheetConfig = updateConfig.sheetConfig;
    var info = sheetConfig.info;
    var updateTeams = sheetConfig.updateTeams;
    if (updateTeams === 'Yes') {
      console.log('Updating teams');
      await this.updateSheet(fpl, gw, info, 1, match.areWeHome ? match.homeTeam : match.awayTeam);
      await this.updateSheet(fpl, gw, info, 2, match.areWeHome ? match.awayTeam : match.homeTeam);
    } else {
      console.log('Team updates not required');
    }
  }

  async updateSheet(fpl, gw, info, col, team) {
    var players = team.team.players;
    var playerNames = Object.keys(players);
    var msg = '';
    for (var i = 0; i < playerNames.length; i++) {
      var playerId = players[playerNames[i]];
      var resp = await fplTeam.getTeam(fpl, playerId, gw);
      msg += this.getPlayerTeam(fpl, resp.picks) + ', ,';
    }
    await ssService.updateValue(info, TEAMS_TAB_INDEX, 2, col, msg);
  }

  getPlayerTeam(fpl, picks) {
    var msg = '';
    for (var j = 0; j < picks.length; j++) {
      var pick = picks[j];
      var playerName = fpl.getPlayerName(pick.element);
      if (pick.is_captain === true) {
        playerName = playerName.toUpperCase();
      } else if (pick.is_vice_captain === true) {
        playerName = playerName.toLowerCase();
      }
      msg += playerName + ':';
    }
    return msg;
  }

}

module.exports = GwTeamUpdater;