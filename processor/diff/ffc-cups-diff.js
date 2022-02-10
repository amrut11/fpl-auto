const ssService = require('../../spreadsheet/spreadsheet-service');
const fplTeam = require('../request/fpl-team');
const diffFinder = require('../diff/diff-finder');
const sorter = require('../../utils/sorter');

const FAC_MAP = {
  24: 'FAC-QF', 25: 'FAC-SF', 26: 'FAC-Final', 27: 'CL-Qual'
}

async function getDiffs(fpl, updateConfig, leagueConfig) {
  var gw = await fpl.init(1000);
  var teams = updateConfig.matchConfig.teams;
  var fixtures = await createFixtures(teams, gw, leagueConfig);
  var teamPlayersMap = new Object();
  var diffs = '';
  for (var i in fixtures) {
    var fixture = fixtures[i];
    teamPlayersMap[fixture.home.team.teamName] = await getTeamPlayers(fpl, fixture.home, gw);
    teamPlayersMap[fixture.away.team.teamName] = await getTeamPlayers(fpl, fixture.away, gw);
  }
  diffs += addDiffs(fpl, fixtures, teamPlayersMap);
  return diffs;
}

async function createFixtures(teams, gw, leagueConfig) {
  var sheetName = gw <= 27 ? FAC_MAP[gw] : 'CL-R' + (gw - 27);
  var sheet = await ssService.getSheet(leagueConfig.league['sheet-id'], sheetName, 116, 24);
  var teamDetails = createTeamDetails(sheet, gw);
  var fixtureCount = leagueConfig.league['fixture-count'];
  let fixtures = [];
  for (var i = 0; i < fixtureCount + 3; i++) {
    homeTeamName = ssService.getValue(sheet, i + 97, 7);
    if (homeTeamName == '') {
      continue;
    }

    var fixture = new Object();
    fixture.home = { team: getTeam(teams, homeTeamName), bench: teamDetails[homeTeamName] };
    awayTeamName = ssService.getValue(sheet, i + 97, 11);
    fixture.away = { team: getTeam(teams, awayTeamName), bench: teamDetails[awayTeamName] };

    fixtures.push(fixture);
  }
  return fixtures;
}

function createTeamDetails(sheet, gw) {
  var teamDetails = new Object();
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 5; j++) {
      var bench = '', penalty = false, scores = new Object();
      var row = 4 + i * 11;
      var teamName = ssService.getValue(sheet, row, 1 + j * 5);
      for (var k = row; k < row + 10; k++) {
        var pName = ssService.getValue(sheet, k, 2 + j * 5);
        var nomination = ssService.getValue(sheet, k, 3 + j * 5);
        scores[pName] = ssService.getValue(sheet, k, 4 + j * 5);
        if (nomination == 'Pen') {
          penalty = true;
        } else if (nomination == 'B') {
          bench += pName + ',';
        }
      }
      if (penalty) {
        scores = sorter.sort(scores);
        bench = scores[0][0] + ',' + scores[1][0] + ',' + scores[2][0];
      }
      teamDetails[teamName] = bench;
    }
  }
  return teamDetails;
}

function getTeam(teams, nameToFind) {
  for (var teamName in teams) {
    var team = teams[teamName];
    if (team.teamName == nameToFind) {
      return team;
    }
  }
  return new Object();
}

function addDiffs(fpl, fixtures, teamPlayersMap) {
  var diffs = '';
  for (var i in fixtures) {
    var fixture = fixtures[i];
    var homePlayers = teamPlayersMap[fixture.home.team.teamName];
    var awayPlayers = teamPlayersMap[fixture.away.team.teamName];
    diffs += ':::*' + fixture.home.team.teamName + ' vs. ' + fixture.away.team.teamName + '*';
    diffs += '\n' + diffFinder.findDiffs(fpl, homePlayers, awayPlayers);
  }
  return diffs;
}

async function getTeamPlayers(fpl, h2hTeam, gw) {
  var team = h2hTeam.team;
  var playerMap = new Object();
  var players = team.players;
  var playerNames = Object.keys(players);
  for (var i = 0; i < playerNames.length; i++) {
    var playerName = playerNames[i];
    var pTeam = await fplTeam.getTeam(fpl, players[playerName], gw);
    var multiplier = h2hTeam.bench.includes(playerName) ? 0 : 1;
    diffFinder.populatePlayers(playerMap, pTeam.picks, multiplier, fpl.getPlayerFixtures(), !fpl.isGwOngoing());
  }
  return playerMap;
}

module.exports = { getDiffs }