const ssService = require('../spreadsheet/spreadsheet-service');
const scoreService = require('./scoring/live-gw-score-service');
const fplTeam = require('./request/fpl-team');
const diffFinder = require('./diff/diff-finder');
const ownershipProcessor = require('./sheet/ownership-processor');

const freeAgents = require('../data/tournament/haven/players').freeAgents;

const SCORE_SHEET_ID = process.env.HAVEN_SCORE_SHEET_ID;
const CAP_SHEET_ID = process.env.H2H_FIXTURE_SHEET_ID;
const CUP_SHEET_ID = process.env.HAVEN_CUP_SHEET_ID;

const SCORE_TAB_INDEX = 21;
const CAP_TAB_INDEX = 14;
const FA_TAB_INDEX = 4;

const ROW_NUM = 1;

async function calculateLeague(fpl, updateConfig, leagueConfig) {
  var gw = await fpl.init(1000);
  var teams = updateConfig.matchConfig.teams;
  var fixtures = await createFixtures(teams, gw, leagueConfig);
  var liveScores = fpl.isGwOngoing() ? scoreService.getLivePoints(fpl, gw) : null;
  let pScores = [];
  let pCaps = [];
  var h2hScores = '*LIVE H2H SCORES FOR GW ' + gw + '*\n---------------------';
  var individualScores = '*LIVE FPL SCORES FOR GW ' + gw + '*';
  var diffs = '';
  var diffTeams = leagueConfig.league['diff-teams'];
  var ownership = new Object();
  for (var i in fixtures) {
    var fixture = fixtures[i];
    var homeScores = await updateTeamScores(fpl, liveScores, fixture.home, gw, leagueConfig.league['sub-multiplier']);
    pScores = pScores.concat(homeScores.pScores);
    pCaps = pCaps.concat(homeScores.pCaps);
    individualScores += '\n---------------------\n';
    individualScores += homeScores.message;
    individualScores += '\n---------------------\n';
    ownershipProcessor.processTeamOwnership(ownership, homeScores.ownership);
    var awayScores = await updateTeamScores(fpl, liveScores, fixture.away, gw, leagueConfig.league['sub-multiplier']);
    pScores = pScores.concat(awayScores.pScores);
    pCaps = pCaps.concat(awayScores.pCaps);
    individualScores += awayScores.message;
    ownershipProcessor.processTeamOwnership(ownership, awayScores.ownership);
    var homeScore = getHomeScore(homeScores, leagueConfig.league.name);
    var awayScore = Math.round(awayScores.h2hScore);
    var diff = Math.abs(homeScore - awayScore);
    var homeTeam = fixture.home.team.teamName;
    var awayTeam = fixture.away.team.teamName;
    if (homeScore > awayScore) {
      h2hScores += '\n*' + homeTeam + ' - ' + homeScore + '* (' + diff + ') ' + awayScore + ' - ' + awayTeam;
    } else {
      h2hScores += '\n' + homeTeam + ' - ' + homeScore + ' (' + diff + ') *' + awayScore + ' - ' + awayTeam + '*';
    }
    var sendDiffs = diffTeams ? (diffTeams.includes(homeTeam) || diffTeams.includes(awayTeam)) : true;
    if (sendDiffs) {
      diffs += ':::*' + homeTeam + ' vs. ' + awayTeam + '*';
      diffs += '\n' + diffFinder.findDiffs(fpl, homeScores.players, awayScores.players);
    }
  }
  if (leagueConfig.league['update-score-sheet']) {
    console.log('Updating league scores');
    await updateSheet(gw, SCORE_SHEET_ID, SCORE_TAB_INDEX, pScores);
  }
  if (leagueConfig.league['free-agent-scores']) {
    console.log('Updating free agent scores');
    var faScores = await getFaScores(fpl, gw, liveScores);
    await ssService.updateValue(CUP_SHEET_ID, FA_TAB_INDEX, 2, gw - 23, faScores);
  }
  switch (leagueConfig['score-type']) {
    case 'H2H':
      return h2hScores;
    case 'Individual':
      return individualScores;
    case 'Diffs':
      return diffs;
    case 'Ownership':
      return await ownershipProcessor.findFinalOwnership(leagueConfig.league, ownership, liveScores, fpl, gw, leagueConfig['full-ownership']);
    case 'Captains':
      await updateSheet(gw, CAP_SHEET_ID, CAP_TAB_INDEX, pCaps);
      return 'Captains updated';
  }
}

async function getFaScores(fpl, gw, liveScores) {
  var scores = '';
  for (var i in freeAgents) {
    var playerData = await getPlayerData(fpl, freeAgents[i], gw, liveScores);
    scores += playerData.score + ',';
  }
  return scores;
}

async function createFixtures(teams, gw, leagueConfig) {
  var sheetId = leagueConfig.league['sheet-id'];
  var sheet = await ssService.getSheet(sheetId, gw - 1);
  var fixtureCount = leagueConfig.league['fixture-count'];
  let fixtures = [];
  for (var i = 0; i < fixtureCount; i++) {
    var fixture = new Object();
    fixture.home = new Object();
    fixture.away = new Object();
    var homeTeamName = ssService.getValue(sheet, i + 2, 1);
    fixture.home.team = getTeam(teams, homeTeamName);
    awayTeamName = ssService.getValue(sheet, i + 2, 2);
    fixture.away.team = getTeam(teams, awayTeamName);
    fixture.home.cap = ssService.getValue(sheet, i + 2, 3);
    fixture.home.vice = ssService.getValue(sheet, i + 2, 4);
    fixture.home.sub = ssService.getValue(sheet, i + 2, 5);
    fixture.home.chip = ssService.getValue(sheet, i + 2, 6);
    fixture.away.cap = ssService.getValue(sheet, i + 2, 7);
    fixture.away.vice = ssService.getValue(sheet, i + 2, 8);
    fixture.away.sub = ssService.getValue(sheet, i + 2, 9);
    fixture.away.chip = ssService.getValue(sheet, i + 2, 10);
    fixtures.push(fixture);
  }
  return fixtures;
}

function getTeam(teams, nameToFind) {
  for (var teamName in teams) {
    var team = teams[teamName];
    if (team.teamName == nameToFind) {
      return team;
    }
  }
}

async function updateTeamScores(fpl, liveScores, h2hTeam, gw, subMultiplier) {
  var team = h2hTeam.team;
  var chip = h2hTeam.chip;
  var players = team.players;
  var playerNames = Object.keys(players);
  let scores = [];
  let h2hScores = [];
  let pScores = [];
  let pCaps = [];
  var message = '*' + team.teamName + '*\n';
  var playerMap = new Object();
  var ownershipMap = new Object();
  var topScore = -100;
  for (var i = 0; i < playerNames.length; i++) {
    var playerName = playerNames[i];
    var pCap = new Object();
    pCap.name = playerName;
    var playerId = players[playerName];
    var playerData = await getPlayerData(fpl, playerId, gw, liveScores);
    var playerScore = playerData.score;
    var pScore = new Object();
    pScore.name = playerName;
    pScore.score = playerScore;
    pScores.push(pScore);
    scores.push(playerScore);
    h2hScores.push(playerScore);
    var multiplier = 1;
    if (playerName == h2hTeam.cap) {
      h2hScores.push(playerScore);
      if (chip == 'TC') {
        playerName += ' (TC)';
        h2hScores.push(playerScore);
        multiplier = 3;
      } else {
        playerName += ' (C)';
        multiplier = 2;
      }
    } else if (playerName == h2hTeam.vice) {
      if (chip == 'DVC') {
        playerName += ' (DVC)';
        h2hScores.push(playerScore);
        multiplier = 2;
      } else {
        playerName += ' (VC)';
        h2hScores.push(playerScore / 2);
        multiplier = 1.5;
      }
    } else if (playerName == h2hTeam.sub) {
      if (chip == 'SS') {
        playerName += ' (SS)';
        multiplier = 1;
      } else {
        playerName += ' (S)';
        h2hScores.pop(playerScore);
        if (subMultiplier) {
          h2hScores.push(playerScore * subMultiplier);
          multiplier = subMultiplier;
        } else {
          multiplier = 0;
        }
      }
    }
    if (playerScore > topScore && playerName != h2hTeam.sub) {
      topScore = playerScore;
    }
    var cap = ownershipProcessor.processPlayerOwnership(ownershipMap, playerData.picks, multiplier);
    pCap.score = fpl.getPlayerName(cap);
    pCaps.push(pCap);
    diffFinder.populatePlayers(playerMap, playerData.picks, multiplier, fpl.getPlayerFixtures(), !fpl.isGwOngoing());
    message += '*' + playerName + '*: ' + playerScore + '\t';
  }
  var teamScore = scores.reduce((a, b) => a + b);
  var h2hTeamScore = h2hScores.reduce((a, b) => a + b);
  message += '*\nH2H (Raw) scores: ' + h2hTeamScore + ' (' + teamScore + ')*';
  var teamScores = new Object();
  teamScores.message = message;
  teamScores.pScores = pScores;
  teamScores.pCaps = pCaps;
  teamScores.h2hScore = h2hTeamScore;
  teamScores.players = playerMap;
  teamScores.topScore = topScore;
  teamScores.ownership = ownershipMap;
  return teamScores;
}

async function getPlayerData(fpl, playerId, gw, liveScores) {
  var playerScore = 0;
  var playerData = new Object();
  var team = await fplTeam.getTeam(fpl, playerId, gw);
  var history = team.entry_history;
  var picks = team.picks;
  if (liveScores) {
    for (var i = 0; i < picks.length; i++) {
      var pick = picks[i];
      playerScore += liveScores[pick.element] * pick.multiplier;
    }
  } else {
    playerScore = history.points;
  }
  playerData.picks = picks;
  playerData.score = (playerScore - history.event_transfers_cost);
  return playerData;
}

function getHomeScore(homeScores, tournName) {
  var score = homeScores.h2hScore;
  if (tournName == 'FFC') {
    score = score + Math.round(homeScores.topScore * 0.25);
  } else if (tournName == 'Haven') {
    score = Math.round(score * 1.01);
  } else {
    score = Math.round(score);
  }
  return score;
}

async function updateSheet(gw, sheetId, tabIndex, details) {
  var formattedDetails = formatDetails(details);
  await ssService.updateValue(sheetId, tabIndex, ROW_NUM, gw + 1, formattedDetails);
}

function formatDetails(pDetails) {
  var formattedDetails = '';
  pDetails.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
  for (var i in pDetails) {
    var pDetail = pDetails[i];
    formattedDetails += pDetail.name + ':' + pDetail.score + ',';
  }
  return formattedDetails;
}

module.exports = { calculateLeague }