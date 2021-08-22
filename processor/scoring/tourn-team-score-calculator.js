const ssService = require('../../spreadsheet/spreadsheet-service');

const NEWLINE = "\r\n-------------------------\r\n";

class scorecalculator {

  calculateHome(fpl, sheetConfig, match) {
    var self = this;
    var finalOutput = "Scores for gameweek " + match.gw + NEWLINE;
    this.calculate(fpl, match.gw, match.homeTeam, async function (score, output) {
      finalOutput += output + NEWLINE + match.homeTeam.team.teamName + " score: " + score + NEWLINE;
      await self.calculateAway(fpl, sheetConfig, match, finalOutput);
    });
  }

  calculateAway(fpl, sheetConfig, match, finalOutput) {
    var self = this;
    this.calculate(fpl, match.gw, match.awayTeam, async function (score, output) {
      finalOutput += output + NEWLINE + match.awayTeam.team.teamName + " score: " + score + NEWLINE;
      await ssService.updateValue(sheetConfig.info, 3, 2, 2, finalOutput);
      console.log('Sheet updated with team scores');
    });
  }

}

module.exports = scorecalculator;