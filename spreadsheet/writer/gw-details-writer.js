const ssService = require('../spreadsheet-service');

const US_ROW = 4;
const THEM_ROW = 18;

async function update(fpl, gw, sheet, ourTeam, theirTeam) {
  console.log('Updating details');
  await populateIds(fpl, gw, sheet, US_ROW, ourTeam);
  await populateIds(fpl, gw, sheet, THEM_ROW, theirTeam);
  await sheet.saveUpdatedCells();
}

async function populateIds(fpl, gw, sheet, row, team) {
  var players = team.players;
  var playerNames = Object.keys(players);
  for (var i = 0; i < playerNames.length; i++) {
    var playerName = playerNames[i];
    var playerId = players[playerName];
    var colCount = 1 + i;

    sheet.getCell(row, colCount).value = playerName;
    sheet.getCell(row + 1, colCount).value = playerId;

    await updateEntryDetails(fpl, gw, playerId, sheet, row, colCount);
  }

  async function updateEntryDetails(fpl, gw, playerId, sheet, row, colCount) {
    var url = 'https://fantasy.premierleague.com/api/entry/' + playerId + '/';
    var historyUrl = url + 'history/';
    var entry = await fpl.downloadPage(url);
    var history = await fpl.downloadPage(historyUrl);

    sheet.getCell(row + 2, colCount).value = entry.summary_overall_points;
    sheet.getCell(row + 3, colCount).value = entry.last_deadline_total_transfers;
    sheet.getCell(row + 4, colCount).value = entry.summary_overall_rank;

    var itb = entry.last_deadline_bank / 10;
    sheet.getCell(row + 5, colCount).value = (entry.last_deadline_value / 10 - itb);
    sheet.getCell(row + 6, colCount).value = itb;

    // var totalTf = entry.extra_free_transfers + 1;
    // var tfMade = entry.event_transfers;
    // ssService.getCell(cells, row + 7, colCount, 10).setValue(totalTf);
    // ssService.getCell(cells, row + 8, colCount, 10).setValue(tfMade);
    var tfMade = '',
      totalTf = '',
      tfCost = 0;
    if (history.current[gw - 1]) {
      tfMade = history.current[gw - 1].event_transfers;
      tfCost = history.current[gw - 1].event_transfers_cost;
      // } else if (tfMade > totalTf) {
      // tfCost = (tfMade - totalTf) * 4;
    }
    if (history.current[gw - 2]) {
      var totalTf = history.current[gw - 2].event_transfers == 0 ? 2 : 1;
    }
    sheet.getCell(row + 7, colCount).value = totalTf;
    sheet.getCell(row + 8, colCount).value = tfMade;
    sheet.getCell(row + 9, colCount).value = tfCost;

    updateChipDetails(history, sheet, row, colCount);
  }

  function updateChipDetails(history, sheet, row, colCount) {
    var chips = history.chips;
    sheet.getCell(row + 10, colCount).value = findChip(chips, 'wildcard') + ':' + findChip(chips, 'freehit');
    sheet.getCell(row + 11, colCount).value = findChip(chips, 'bboost');
    sheet.getCell(row + 12, colCount).value = findChip(chips, '3xc');
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

module.exports = {
  update
}