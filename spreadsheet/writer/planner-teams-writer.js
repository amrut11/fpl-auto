const fplService = require('../../processor/request/fpl-service');
const ssService = require('../spreadsheet-service');
const fplTeam = require('../../processor/request/fpl-team');

const PLANNER_SHEET_ID = process.env.PLANNER_SHEET_ID;

const TAB = 'Teams';

const TEAMS = [{ name: 'Amrut', id: 4807 }, { name: 'Tanveer', id: 1518 }, { name: 'Sahil', id: 3380 }, { name: 'Gaurang', id: 67150 }, { name: 'Shashank', id: 878138 }, { name: 'Srijan', id: 928594 }, { name: 'Brynal', id: 5221 }, { name: 'Saleem', id: 590444 }, { name: 'Sushant', id: 4748 }, { name: 'Shek', id: 8705 }, { name: 'Hitesh', id: 3306805 }, { name: 'Damodar', id: 1485012 }, { name: 'Anurag', id: 2606 }];

async function updateTeams() {
  console.log('Updating Planner with latest teams');
  var msg = '';
  for (var i in TEAMS) {
    var team = TEAMS[i];
    var players = await getPlayers(team.id);
    msg += team.name + ':' + players + '^' + team.name + '^';
  }
  await ssService.updateValue(PLANNER_SHEET_ID, TAB, 1, 1, msg);
}

async function getPlayers(teamId) {
  var fpl = new fplService();
  await fpl.init(1000);
  var elements = fpl.getElements();
  var team = await fplTeam.getTeam(fpl, teamId, fpl.getCurrentEvent());
  var picks = team.picks;
  var msg = '';
  let players = [];
  for (var i in picks) {
    var player = new Object();
    player.name = fpl.getPlayerName(picks[i].element);
    player.pos = getPosition(elements, picks[i].element);
    players.push(player);
  }
  players = sortPlayers(players);
  for (var i in players) {
    msg += players[i][0] + ',';
  }
  msg += team.entry_history.bank / 10 + ',';
  return msg;
}

function getPosition(elements, id) {
  for (var i in elements) {
    if (elements[i].id == id) {
      return elements[i].element_type;
    }
  }
}

function sortPlayers(players) {
  var sortable = [];
  for (var i in players) {
    var player = players[i];
    sortable.push([player.name, player.pos]);
  }
  sortable.sort(function(a, b) {
    return a[1] - b[1];
  });
  return sortable;
}

module.exports = { updateTeams }