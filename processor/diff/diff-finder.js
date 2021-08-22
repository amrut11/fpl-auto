const sorter = require('../../utils/sorter');

function populatePlayers(playersMap, picks, multiplier, playerFixtures, futureGame) {
  for (var i = 0; i < picks.length; i++) {
    var pick = picks[i];
    var finalMultiplier = multiplier;
    if (!futureGame) {
      finalMultiplier *= pick.multiplier * playerFixtures[pick.element];
    }
    if (playersMap[pick.element]) {
      playersMap[pick.element] += finalMultiplier;
    } else {
      playersMap[pick.element] = finalMultiplier;
    }
  }
}

function findDiffs(fpl, ourPlayers, theirPlayers) {
  var diffs = getSortedDiffs(fpl, ourPlayers, theirPlayers);
  var output = '';
  var values = Object.values(diffs);
  var sum = 0;
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    output += value[0] + ' ' + getRoundedNumber(value[1]) + '\r\n';
    sum += value[1];
  }
  return 'Count difference: ' + getRoundedNumber(sum) + '\n' + output;
}

function getSortedDiffs(fpl, ourPlayers, theirPlayers) {
  var rawDiffs = getRawDiffs(ourPlayers, theirPlayers);
  var diffs = new Object();
  Object.keys(rawDiffs).forEach((playerId, index) => {
    if (rawDiffs[playerId] != 0) {
      var playerName = fpl.getPlayerName(playerId);
      playerName += ' ('+ fpl.getPlayerPendingFixs(playerId) + ')';
      diffs[playerName] = rawDiffs[playerId];
    }
  });
  return sorter.sort(diffs);
}

function getRawDiffs(ourPlayers, theirPlayers) {
  var result = new Object();
  Object.keys(ourPlayers).forEach((playerId) => {
    var theirCount = theirPlayers[playerId] ? theirPlayers[playerId] : 0;
    result[playerId] = ourPlayers[playerId] - theirCount;
  });
  Object.keys(theirPlayers).forEach((playerId) => {
    if (typeof result[playerId] == 'undefined') {
      result[playerId] = -theirPlayers[playerId];
    }
  });
  return result;
}

function getRoundedNumber(number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

module.exports = { populatePlayers, findDiffs }