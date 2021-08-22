const ssService = require('../spreadsheet-service');

const US_ROW = 5;
const THEM_ROW = 19;
const NO_OF_COLS = 12;

async function update(fpl, gw, detailsSheet, detailsCells, ourTeam, theirTeam) {
  console.log('Updating details');
  await populateIds(fpl, gw, detailsCells, US_ROW, ourTeam);
  await populateIds(fpl, gw, detailsCells, THEM_ROW, theirTeam);

  await detailsSheet.bulkUpdateCells(detailsCells);
}

async function populateIds(fpl, gw, cells, row, team) {
  var players = team.players;
  var playerNames = Object.keys(players);
  for (var i = 0; i < playerNames.length; i++) {
    var playerName = playerNames[i];
    var playerId = players[playerName];
    var colCount = 2 + i;

    ssService.getCell(cells, row, colCount, NO_OF_COLS).setValue(playerName); // name
    ssService.getCell(cells, row + 1, colCount, NO_OF_COLS).setValue(playerId); // id

    await updateEntryDetails(fpl, gw, playerId, cells, row, colCount);
  }

  async function updateEntryDetails(fpl, gw, playerId, cells, row, colCount) {
    var url = 'https://fantasy.premierleague.com/api/entry/' + playerId + '/';
    var historyUrl = url + 'history/';
    var entry = await fpl.downloadPage(url);
    var history = await fpl.downloadPage(historyUrl);

    ssService.getCell(cells, row + 2, colCount, NO_OF_COLS).setValue(entry.summary_overall_points);
    ssService.getCell(cells, row + 3, colCount, NO_OF_COLS).setValue(entry.last_deadline_total_transfers);
    ssService.getCell(cells, row + 4, colCount, NO_OF_COLS).setValue(entry.summary_overall_rank);
    var itb = entry.last_deadline_bank / 10;
    ssService.getCell(cells, row + 5, colCount, NO_OF_COLS).setValue(entry.last_deadline_value / 10 - itb);
    ssService.getCell(cells, row + 6, colCount, NO_OF_COLS).setValue(itb);

    // var totalTf = entry.extra_free_transfers + 1;
    // var tfMade = entry.event_transfers;
    // ssService.getCell(cells, row + 7, colCount, 10).setValue(totalTf);
    // ssService.getCell(cells, row + 8, colCount, 10).setValue(tfMade);
    var tfMade = '', totalTf = '', tfCost = 0;
    if (history.current[gw - 1]) {
      tfMade = history.current[gw - 1].event_transfers;
      tfCost = history.current[gw - 1].event_transfers_cost;
    // } else if (tfMade > totalTf) {
      // tfCost = (tfMade - totalTf) * 4;
    }
    if (history.current[gw - 2]) {
      var totalTf = history.current[gw - 2].event_transfers == 0 ? 2 : 1;
    }
    ssService.getCell(cells, row + 7, colCount, NO_OF_COLS).setValue(totalTf);
    ssService.getCell(cells, row + 8, colCount, NO_OF_COLS).setValue(tfMade);
    ssService.getCell(cells, row + 9, colCount, NO_OF_COLS).setValue(tfCost);

    updateChipDetails(history, cells, row, colCount);
  }

  function updateChipDetails(history, cells, row, colCount) {
    var chips = history.chips;
    ssService.getCell(cells, row + 10, colCount, NO_OF_COLS).setValue(findChip(chips, 'wildcard') + ':' +  findChip(chips, 'freehit'));
    ssService.getCell(cells, row + 11, colCount, NO_OF_COLS).setValue(findChip(chips, 'bboost'));
    ssService.getCell(cells, row + 12, colCount, NO_OF_COLS).setValue(findChip(chips, '3xc'));
  }

  function findChip(chips, chip) {
    var chipUsage = '';
    for (var j in chips) {
      if (chips[j].name === chip) {
        chipUsage += chips[j].event + ',';
      }
    }
    if (chipUsage === '') {
      chipUsage = '0';
    }
    return chipUsage;
  }
}

module.exports = { update }