const teamCache = new Object();

const ANY = 0;
const GKP = 1;
const DEF = 2;
const MID = 3;
const FWD = 4;

async function getPlayerData(fpl, playerId, gw, liveScores) {
  var playerScore = 0;
  var team = await getTeam(fpl, playerId, gw);
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
  return { picks: picks, score: (playerScore - history.event_transfers_cost) };
}

async function getTeam(fpl, playerId, gw) {
  var key = playerId + '-' + fpl.isGwOngoing() + '-' + fpl.getRemainingFixsCount(gw);
  if (key in teamCache) {
    return teamCache[key];
  }
  var url = 'https://fantasy.premierleague.com/api/entry/' + playerId + '/event/' + gw + '/picks/';
  var data = await fpl.downloadPage(url);
  // if (data.active_chip === 'freehit' && !fpl.isGwOngoing()) {
  //   url = 'https://fantasy.premierleague.com/api/entry/' + playerId + '/event/' + (gw - 1) + '/picks/';
  //   data = await fpl.downloadPage(url);
  // }
  var playerFixtures = fpl.getPlayerFixtures();
  var liveElements = fpl.liveInfo.elements;
  var details = getDetails(data, playerFixtures, liveElements, fpl);
  var picks = data.picks;
  for (var i = 0; i < picks.length; i++) {
    var pick = picks[i];
    var played = hasPlayerPlayed(liveElements, pick.element);
    if (pick.multiplier > 0 && playerFixtures[pick.element] == 0 && !played) {
      var isCap = pick.is_captain;
      if (isCap) {
        replaceCap(fpl, liveElements, picks, pick);
      }
      var replacementIndex = getReplacementIndex(details, pick, fpl);
      if (replacementIndex) {
        var replacement = picks[replacementIndex];
        var currPos = pick.position;
        var currMultiplier = pick.multiplier;

        // Shift pick to bench
        pick.position = replacement.position;
        pick.multiplier = 0;
        pick.is_vice_captain = false;
        picks[replacementIndex] = pick;

        // Shift replacement to starting xi
        replacement.position = currPos;
        replacement.multiplier = isCap ? 1 : currMultiplier;
        picks[i] = replacement;

        // console.log('Replaced ' + fpl.getPlayerName(pick.element) + ' with ' + fpl.getPlayerName(replacement.element));
      } else {
        // console.log('No replacement found for ' + fpl.getPlayerName(pick.element));
      }
    }
  }
  teamCache[key] = data;
  return data;
}

function getDetails(data, playerFixtures, liveElements, fpl) {
  var details = new Object();
  var startingTypes = new Object();
  var bench = new Object();
  var picks = data.picks;
  for (var i = 0, benchCount = 0; i < picks.length; i++) {
    var pick = picks[i];
    var type = fpl.getPlayerType(pick.element);
    if (pick.multiplier === 0) {
      bench[benchCount] = new Object();
      bench[benchCount].id = pick.element;
      bench[benchCount].type = type;
      bench[benchCount].index = i;
      bench[benchCount++].available = playerFixtures[pick.element] > 0 || hasPlayerPlayed(liveElements, pick.element);
    } else {
      if (startingTypes[type]) {
        startingTypes[type]++;
      } else {
        startingTypes[type] = 1;
      }
    }
    if (pick.is_vice_captain) {
      details.vice_captain = pick.element;
    }
  }
  details.bench = bench;
  details.startingTypes = startingTypes;
  return details;
}

function hasPlayerPlayed(elements, elementId) {
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (element.id === elementId) {
      return element.stats.minutes > 0 || element.stats.total_points != 0;
    }
  }
}

function getReplacementIndex(details, pick, fpl) {
  var bench = details.bench;
  var startingTypes = details.startingTypes;
  var type = fpl.getPlayerType(pick.element);
  var candidate;
  if (type == GKP) {
    candidate = findCandidate(bench, GKP);
  } else if (type == DEF) {
    if (startingTypes[DEF] <= 3) {
      candidate = findCandidate(bench, DEF);
    } else {
      candidate = findCandidate(bench, ANY);
    }
  } else if (type == FWD) {
    if (startingTypes[FWD] <= 1) {
      candidate = findCandidate(bench, FWD);
    } else {
      candidate = findCandidate(bench, ANY);
    }
  } else {
    candidate = findCandidate(bench, ANY);
  }
  if (candidate) {
    startingTypes[type]--;
    startingTypes[candidate.type]++;
    return candidate.index;
  }
}

function replaceCap(fpl, liveElements, picks, capPick) {
  var viceIndex = getViceCapIndex(picks);
  var vicePick = picks[viceIndex];
  var vicePlayed = vicePick && hasPlayerPlayed(liveElements, vicePick.element);
  if (vicePlayed) {
    // Change vice to cap
    vicePick.is_captain = true;
    vicePick.is_vice_captain = false;
    // Max is needed in case vice cap is already made cap post GW
    vicePick.multiplier = Math.max(vicePick.multiplier, capPick.multiplier);
    capPick.is_captain = false;
    capPick.is_vice_captain = true;
    // console.log('Replaced cap ' + fpl.getPlayerName(capPick.element) + ' with ' + fpl.getPlayerName(vicePick.element));
  }
}

function findCandidate(bench, type) {
  for (var i in bench) {
    var candidate = bench[i];
    if (candidate.available) {
      if ((type == ANY && candidate.type != GKP) || candidate.type == type) {
        candidate.available = false;
        return candidate;
      }
    }
  }
}

function getViceCapIndex(picks) {
  for (var i in picks) {
    if (picks[i].is_vice_captain) {
      return i;
    }
  }
}

module.exports = { getPlayerData, getTeam }