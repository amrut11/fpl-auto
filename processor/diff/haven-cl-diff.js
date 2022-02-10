const ssService = require('../../spreadsheet/spreadsheet-service');
const fplTeam = require('../request/fpl-team');
const diffFinder = require('../diff/diff-finder');
const sorter = require('../../utils/sorter');

const LEAGUE_MAP = {
  'Atletico': 'B', 'Barca': 'B', 'Betis': 'A', 'Bilbao': 'D', 'Celta': 'B', 'R Madrid': 'C', 'Sevilla': 'A', 'Sociedad': 'D', 'Valencia': 'C', 'Villarreal': 'D', 'Arsenal': 'A', 'Chelsea': 'C', 'Everton': 'D', 'Leeds': 'A', 'Leicester': 'C', 'Liverpool': 'B', 'Man City': 'A', 'Man Utd': 'B', 'Spurs': 'C', 'Wolves': 'D'
}

async function getDiffs(fpl, updateConfig, leagueConfig) {
  var gw = await fpl.init(1000);
  var teams = updateConfig.matchConfig.teams;
  var fixtures = await createFixtures(teams, gw, leagueConfig);
  var avg = new Object();
  var teamPlayersMap = new Object();
  var diffs = '';
  for (var i in fixtures) {
    var fixture = fixtures[i];
    teamPlayersMap[fixture.home.team.teamName] = await getTeamPlayers(fpl, fixture.home, gw, avg);
    teamPlayersMap[fixture.away.team.teamName] = await getTeamPlayers(fpl, fixture.away, gw, avg);
  }
  teamPlayersMap['Avg A'] = avg['avgA'];
  teamPlayersMap['Avg B'] = avg['avgB'];
  teamPlayersMap['Avg C'] = avg['avgC'];
  teamPlayersMap['Avg D'] = avg['avgD'];
  diffs += addDiffs(fpl, fixtures, teamPlayersMap);
  return diffs;
}

async function createFixtures(teams, gw, leagueConfig) {
  var sheet = await ssService.getSheet(leagueConfig.league['sheet-id'], 'CL-R' + (gw - 20), 75, 24);
  var teamDetails = createTeamDetails(sheet);
  var fixtureCount = leagueConfig.league['fixture-count'];
  let fixtures = [];
  for (var i = 0; i < fixtureCount; i++) {
    var fixture = new Object();

    homeTeamName = ssService.getValue(sheet, i + 61, 7);
    if (homeTeamName == '') {
      continue;
    }
    fixture.home = new Object();
    fixture.home.team = getTeam(teams, homeTeamName);
    if (homeTeamName.includes('Avg')) {
      fixture.home.team.teamName = homeTeamName;
    } else {
      fixture.home.sp = teamDetails[homeTeamName].sp;
      fixture.home.bench = teamDetails[homeTeamName].bench;
    }

    awayTeamName = ssService.getValue(sheet, i + 61, 11);
    fixture.away = new Object();
    fixture.away.team = getTeam(teams, awayTeamName);
    if (awayTeamName.includes('Avg')) {
      fixture.away.team.teamName = awayTeamName;
    } else {
      fixture.away.bench = teamDetails[awayTeamName].bench;
    }

    fixtures.push(fixture);
  }
  return fixtures;
}

function createTeamDetails(sheet) {
  var teamDetails = new Object();
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 5; j++) {
      var teamDetail = new Object();
      var bench = '', chip = penalty = false, scores = new Object();
      var row = 4 + i * 13;
      var teamName = ssService.getValue(sheet, row, 1 + j * 5);
      for (var k = row; k < row + 10; k++) {
        var pName = ssService.getValue(sheet, k, 2 + j * 5);
        var nomination = ssService.getValue(sheet, k, 3 + j * 5);
        scores[pName] = ssService.getValue(sheet, k, 4 + j * 5);
        if (nomination == 'B') {
          bench += pName + ',';
        } else if (nomination == 'SP') {
          teamDetail.sp = pName;
        } else if (nomination == 'Chip') {
          chip = true;
        } else if (nomination == 'Pen') {
          penalty = true;
        }
      }
      if (chip) {
        scores = sorter.sort(scores);
        bench = scores[9][0] + ',' + scores[8][0] + ',' + scores[7][0];
      } else if (penalty) {
        scores = sorter.sort(scores);
        bench = scores[0][0] + ',' + scores[1][0] + ',' + scores[2][0];
      }
      teamDetail.bench = bench;
      teamDetails[teamName] = teamDetail;
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
    diffs += ':::*CL: ' + fixture.home.team.teamName + ' vs. ' + fixture.away.team.teamName + '*';
    diffs += '\n' + diffFinder.findDiffs(fpl, homePlayers, awayPlayers);
  }
  return diffs;
}

async function getTeamPlayers(fpl, h2hTeam, gw, avg) {
  var team = h2hTeam.team;
  if (team.teamName.includes('Avg')) {
    return;
  }
  var playerMap = new Object();
  var players = team.players;
  var playerNames = Object.keys(players);
  for (var i = 0; i < playerNames.length; i++) {
    var playerName = playerNames[i];
    var pTeam = await fplTeam.getTeam(fpl, players[playerName], gw);
    var multiplier = 1;
    if (playerName == h2hTeam.sp) {
      multiplier = 1.1;
    } else if (h2hTeam.bench.includes(playerName)) {
      multiplier = 0;
    }
    diffFinder.populatePlayers(playerMap, pTeam.picks, multiplier, fpl.getPlayerFixtures(), !fpl.isGwOngoing());
  }
  var avgGroup = 'avg' + LEAGUE_MAP[team.teamName];
  if (!avg[avgGroup]) {
    avg[avgGroup] = new Object();
  }
  addAverage(avg[avgGroup], playerMap);
  return playerMap;
}

function addAverage(avg, players) {
  for (var i in players) {
    if (avg[i]) {
      avg[i] += players[i] / 5;
    } else {
      avg[i] = players[i] / 5;
    }
  }
}

module.exports = { getDiffs }