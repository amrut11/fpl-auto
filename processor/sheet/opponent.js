const ssService = require('../../spreadsheet/spreadsheet-service');
const detailsWriter = require('../../spreadsheet/writer/gw-details-writer');

const ourTeams = ['Brighton & Hove Albion', 'Southampton', 'Tottenham Hotspur', 'Bournemouth', 'Wolverhampton Wanderers', 'Newcastle United', 'Arsenal', 'Manchester City'];
const theirTeams = ['Wolverhampton Wanderers', 'Burnley', 'Manchester United', 'Southampton', 'Brighton & Hove Albion', 'Watford', 'Fulham', 'Liverpool'];

async function handle(req, gw, config) {
  for (var i = 0; i <= 7; i++) {
    if (i == 0 || (gw - 31) <= i) {
      console.dir('Updating sheet for gw ' + (31 + i));
      var matchConfig = config.matchConfig;
      var detailsSheet = config.sheetConfig.info.worksheets[i];
      var detailsCells = await ssService.getCells(detailsSheet);
      var ourTeam = matchConfig.teammap.getTeam(ourTeams[i]);
      var theirTeam = matchConfig.teammap.getTeam(theirTeams[i]);

      await detailsWriter.update(req, gw, detailsSheet, detailsCells, ourTeam, theirTeam);
    }
  }
}

module.exports = { handle }