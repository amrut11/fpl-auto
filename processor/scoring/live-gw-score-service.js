function getLivePoints(fpl, gw) {
  return getLiveScores(fpl, gw).totalPoints;
}

function getLiveScores(fpl, gw) {
  var liveScores = new Object();
  var totalPoints = new Object();
  liveScores.basePoints = getBasePoints(fpl, totalPoints);
  liveScores.bonusPoints = getBonusPoints(fpl, gw, totalPoints);
  liveScores.totalPoints = totalPoints;
  return liveScores;
}

function getBasePoints(fpl, totalPoints) {
  var basePoints = new Object();
  var elements = fpl.liveInfo.elements;
  var playerFixtures = fpl.getPlayerFixtures();
  for (var i in elements) {
    var points = elements[i].stats.total_points - elements[i].stats.bonus;
    totalPoints[elements[i].id] = points;
    if (elements[i].stats.minutes == 0) {
      if (playerFixtures[elements[i].id] == 0) {
        points = 'Y';
      } else {
        points = 'N';
      }
    }
    basePoints[elements[i].id] = points;
  }
  return basePoints;
}

function getBonusPoints(fpl, gw, totalPoints) {
  let bonusPoints = [];
  var fixtures = fpl.getFixtures();
  for (var i in fixtures) {
    var fixture = fixtures[i];
    if (fixture.event == gw) {
      var bonusPoint = new Object();
      bonusPoint['fix-header'] = getFixHeader(fpl, fixture);
      bonusPoint['fix-bonus'] = getFixtureBonus(fixture, totalPoints);
      bonusPoints.push(bonusPoint);
    }
  }
  return bonusPoints;
}

function getFixHeader(fpl, fixture) {
  var homeTeam = fpl.getTeamName(fixture.team_h);
  var awayTeam = fpl.getTeamName(fixture.team_a);
  var fplFixture = homeTeam + ' vs. ' + awayTeam + (fixture.finished ? ' (FINAL)' : (fixture.finished_provisional ? ' (PROV)' : ' (LIVE)'));
  return fplFixture;
}

function getFixtureBonus(fixture, totalPoints) {
  if (fixture.finished) {
    var fplBonus = fixture.stats[8];
    var bonus = fplBonus.h.concat(fplBonus.a);
    bonus.sort(function(a, b) {
      return b.value - a.value;
    });
    var fixBonus = new Object();
    for (var i in bonus) {
      fixBonus[bonus[i].element] = bonus[i].value;
      totalPoints[bonus[i].element] += bonus[i].value;
    }
    return fixBonus;
  } else {
    return getLiveBonus(fixture, totalPoints);
  }
}

function getLiveBonus(fixture, totalPoints) {
  if (!fixture.stats[9]) {
    return;
  }
  var bps = fixture.stats[9].a.concat(fixture.stats[9].h);
  bps.sort(function(a, b) {
    return b.value - a.value;
  });
  var bonuses = new Object();
  var bonusCount = 0;
  var bonusValue = 3;
  var currBp = 1000;
  for (var i in bps) {
    var bp = bps[i];
    if (bp.value < currBp) {
      if (bonusCount >= 3) {
        break;
      }
      bonusValue = Math.max(bonusValue - bonusCount, 1); // hack
      currBp = bp.value;
    }
    bonuses[bp.element] = bonusValue;
    totalPoints[bp.element] += bonusValue;
    bonusCount++;
  }
  return bonuses;
}

module.exports = { getLivePoints, getLiveScores }