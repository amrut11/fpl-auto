const fplService = require('../../processor/request/fpl-service');
const ssService = require('../spreadsheet-service');
const sorter = require('../../utils/sorter');

const resultsWriter = require('./fpl-results-writer');

const FDR_SHEET_ID = process.env.FDR_SHEET_ID;

const FIXTURE_COLUMN = 1;
const PLAYERS_COLUMN = 2;
const GWFIXS_COLUMN = 3;

const TAB_INDEX = 7;

async function updateResults() {
  var results = await resultsWriter.getResults();
  await updateSheet(results, GWFIXS_COLUMN);
}

async function updatePlayers() {
  console.log('Updating FDR with latest players');
  var fpl = new fplService();
  await fpl.init(1000);
  var elements = fpl.getElements();
  var msg = '';
  for (var i in elements) {
    var element = elements[i];
    msg += fpl.getPlayerName(element.id);
    msg += ':' + fpl.getTeamName(element.team);
    msg += ':' + element.now_cost / 10;
    msg += '^';
  }
  await updateSheet(msg, PLAYERS_COLUMN);
}

async function updateFixtures() {
  console.log('Updating FDR with latest fixtures');
  var fpl = new fplService();
  await fpl.init(1000);
  var fixtures = fpl.getFixtures();
  var teams = new Object();
  for (var i in fixtures) {
    var fixture = fixtures[i];
    var homeTeam = fpl.getTeamName(fixture.team_h);
    var awayTeam = fpl.getTeamName(fixture.team_a);
    if (teams[homeTeam]) {
      let fixs = [];
      fixs.push(awayTeam.toUpperCase());
      if (teams[homeTeam][fixture.event]) {
        if (teams[homeTeam][fixture.event * 10]) {
          teams[homeTeam][fixture.event * 10 + 1] = fixs;
        } else {
          teams[homeTeam][fixture.event * 10] = fixs;
        }
      } else {
        teams[homeTeam][fixture.event] = fixs;
      }
    } else {
      var homeFixs = new Object();
      let fixs = [];
      fixs.push(awayTeam.toUpperCase());
      homeFixs[fixture.event] = fixs;
      teams[homeTeam] = homeFixs;
    }
    if (teams[awayTeam]) {
      let fixs = [];
      fixs.push(homeTeam.toLowerCase());
      if (teams[awayTeam][fixture.event]) {
        if(teams[awayTeam][fixture.event * 10]) {
          teams[away][fixture.event * 10 + 1] = fixs;
        } else {
          teams[awayTeam][fixture.event * 10] = fixs;
        }
      } else {
        teams[awayTeam][fixture.event] = fixs;
      }
    } else {
      var awayFixs = new Object();
      let fixs = [];
      fixs.push(homeTeam.toLowerCase());
      awayFixs[fixture.event] = fixs;
      teams[awayTeam] = awayFixs;
    }
  }
  await updateSheet(createFixMsg(teams), FIXTURE_COLUMN);
}

function createFixMsg(teams) {
  var sortedTeams = sorter.sortObject(teams);
  var msg = '';
  for (var i in sortedTeams) {
    msg += i + ':';
    var teamFixs = sortedTeams[i];
    for (var j in teamFixs) {
      for (var k in teamFixs[j]) {
        msg += j + '%' + teamFixs[j][k] + '^';
      }
    }
    msg += '$' + i + '$' + i + '$';
  }
  return msg;
}

async function updatePlayerData() {
  console.log('Updating Fixtures with latest players and positions');
  await fpl.init(1000);
  var elements = fpl.getElements();
  var msg = '';
  for (var i in elements) {
    var name = fpl.getPlayerName(elements[i].id);
    var type = fpl.getPlayerPosition(elements[i].element_type);
    msg += name + '%' + type + '$';
  }
  ssService.updateValue(process.env.H2H_FIXTURE_SHEET_ID, 'PlayerData', 1, 8, msg);
}

async function updateSheet(value, column) {
  await ssService.updateValue(FDR_SHEET_ID, TAB_INDEX, 2, column, value);
}

module.exports = { updateResults, updatePlayers, updateFixtures, updatePlayerData }