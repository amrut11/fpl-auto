const ssService = require('../../spreadsheet/spreadsheet-service');
const fplTeam = require('../request/fpl-team');
const diffFinder = require('../diff/diff-finder');
const sorter = require('../../utils/sorter');

const LEAGUE_A = ['ARSENAL', 'CHELSEA', 'EVERTON', 'LEEDS', 'LEICESTER'];
const LEAGUE_B = ['LIVERPOOL', 'MAN CITY', 'MAN UTD', 'SPURS', 'WOLVES'];

async function getDiffs(fpl, updateConfig, leagueConfig) {
  var gw = await fpl.init(1000);
  var teams = updateConfig.matchConfig.teams;
  var fixtures = await createFixtures(teams, gw, leagueConfig);
  var avgA = new Object(), avgB = new Object();
  var teamPlayersMap = new Object();
  var diffs = '';
  for (var i in fixtures) {
    var fixture = fixtures[i];
    teamPlayersMap[fixture.home.team.teamName] = await getTeamPlayers(fpl, fixture.home, gw, avgA, avgB);
    teamPlayersMap[fixture.away.team.teamName] = await getTeamPlayers(fpl, fixture.away, gw, avgA, avgB);
  }
  teamPlayersMap['Avg A'] = avgA;
  teamPlayersMap['Avg B'] = avgB;
  diffs += addDiffs(fpl, fixtures, teamPlayersMap);
  return diffs;
}

async function createFixtures(teams, gw, leagueConfig) {
  var sheetInfo = await ssService.getInfo(leagueConfig.league['sheet-id']);
  var cells = await ssService.getCells(sheetInfo.worksheets[gw - 14]);
  var teamDetails = createTeamDetails(cells);
  var fixtureCount = leagueConfig.league['fixture-count'];
  let fixtures = [];
  for (var i = 0; i < fixtureCount + 1; i++) {
    var fixture = new Object();

    homeTeamName = ssService.getCell(cells, i + 35, 7, 25).value;
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

    awayTeamName = ssService.getCell(cells, i + 35, 11, 25).value;
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

function createTeamDetails(cells) {
  var teamDetails = new Object();
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 5; j++) {
      var teamDetail = new Object();
      var bench = '', chip = penalty = false, scores = new Object();
      var row = 4 + i * 13;
      var teamName = ssService.getCell(cells, row, 1 + j * 5, 25).value;
      for (var k = row; k < row + 10; k++) {
        var pName = ssService.getCell(cells, k, 2 + j * 5, 25).value;
        var nomination = ssService.getCell(cells, k, 3 + j * 5, 25).value;
        scores[pName] = ssService.getCell(cells, k, 4 + j * 5, 25).value;
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
    if (team.teamName == nameToFind.toUpperCase()) {
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

async function getTeamPlayers(fpl, h2hTeam, gw, avgA, avgB) {
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
    if (LEAGUE_A.includes(team.teamName)) {
      addAverage(avgA, playerMap);
    } else {
      addAverage(avgB, playerMap);
    }
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