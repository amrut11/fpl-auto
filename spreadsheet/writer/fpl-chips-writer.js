const ssService = require('../spreadsheet-service');

const FIXTURE_SHEET_ID = process.env.H2H_FIXTURE_SHEET_ID;

const TAB_INDEX = 13;
const ROW_NUM = 2;

async function updateChips(fpl, updateConfig, leagueConfig) {
  await fpl.init(1000);
  var teams = updateConfig.matchConfig.teams;
  var chips = await findChips(fpl, teams);
  var formattedChips = sortChipsByName(chips);
  await ssService.updateValue(FIXTURE_SHEET_ID, TAB_INDEX, ROW_NUM, leagueConfig.league['chip-col-index'], formattedChips);
  return formattedChips;
}

async function findChips(fpl, teams) {
  let chips = [];
  for (var teamName in teams) {
    var team = teams[teamName];
    var teamChips = await findTeamChips(fpl, team);
    chips = chips.concat(teamChips);
  }
  return chips;
}

async function findTeamChips(fpl, team) {
  let pChips = [];
  var players = team.players;
  var playerNames = Object.keys(players);
  for (var i = 0; i < playerNames.length; i++) {
    var playerName = playerNames[i];
    var playerId = players[playerName];
    var url = 'https://fantasy.premierleague.com/api/entry/' + playerId + '/history/';
    var playerData = await fpl.downloadPage(url);
    var playerChip = getPlayerChip(playerData);
    var pChip = new Object();
    pChip.name = playerName;
    pChip.chip = playerChip;
    pChips.push(pChip);
  }
  return pChips;
}

function getPlayerChip(playerData) {
  var chips = playerData.chips;
  var pChip = findChip(chips, 'wildcard', 1);
  pChip += ':' + findChip(chips, 'wildcard', 2);
  pChip += ':' + findChip(chips, 'freehit', 1);
  pChip += ':' + findChip(chips, 'freehit', 2);
  pChip += ':' + findChip(chips, '3xc', 1);
  pChip += ':' + findChip(chips, 'bboost', 1);
  return pChip;
}

function findChip(chips, chip, instance) {
  var chipUsage = '';
  var count = 1;
  for (var j in chips) {
    if (chips[j].name === chip && count++ == instance) {
      chipUsage = chips[j].event;
      break;
    }
  }
  return chipUsage === '' ? '0' : chipUsage;
}

function sortChipsByName(pChips) {
  var formattedChips = '';
  pChips.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
  for (var i in pChips) {
    var pChip = pChips[i];
    formattedChips += pChip.name + ':' + pChip.chip + ',';
  }
  return formattedChips;
}

module.exports = { updateChips }