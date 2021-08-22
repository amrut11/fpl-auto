const ssService = require('../../spreadsheet/spreadsheet-service');

const FIXTURE_SHEET_ID = process.env.H2H_FIXTURE_SHEET_ID;

const TAB_INDEX = 13;
const ROW_NUM = 3;

function processPlayerOwnership(ownershipMap, picks, multiplier) {
  var cap = 0;
  for (var i in picks) {
    var pick = picks[i];
    if (cap == 0) {
      if (pick.is_captain) {
        cap = pick.element;
      }
    }
    if (pick.multiplier > 1) {
      cap = pick.element;
    }
    var currOwnership = ownershipMap[pick.element];
    if (currOwnership) {
      currOwnership.tsb += 1;
      currOwnership.fplEo += pick.multiplier;
      currOwnership.h2hEo += pick.multiplier * multiplier;
    } else {
      ownership = new Object();
      ownership.tsb = 1;
      ownership.fplEo = pick.multiplier;
      ownership.h2hEo = pick.multiplier * multiplier;
      ownershipMap[pick.element] = ownership;
    }
  }
  return cap;
}

function processTeamOwnership(ownership, teamOwnership) {
  for (var i in teamOwnership) {
    var tOwnership = teamOwnership[i];
    var currOwnership = ownership[i];
    if (currOwnership) {
      currOwnership.tsb += tOwnership.tsb;
      currOwnership.fplEo += tOwnership.fplEo;
      currOwnership.h2hEo += tOwnership.h2hEo;
    } else {
      newOwnership = new Object();
      newOwnership.tsb = tOwnership.tsb;
      newOwnership.fplEo = tOwnership.fplEo;
      newOwnership.h2hEo = tOwnership.h2hEo;
      ownership[i] = newOwnership;
    }
  }
}

async function findFinalOwnership(tournament, ownership, liveScores, fpl, gw, isFull) {
  var type = isFull ? 'LIVE' : 'TOP10';
  var msg = '*' + type + ' OWNERSHIP FOR GW ' + gw + '*\n---------------------';
  msg += '\n*Player (Pts):  TSB - FPL EO - H2H EO*';
  var raw = '';
  var sortedOwnership = sortOwnership(ownership);
  var playerFixtures = fpl.getPlayerFixtures();
  var count = 0;
  for (var i in sortedOwnership) {
    var pId = sortedOwnership[i][0];
    var pName = fpl.getPlayerName(pId);
    var pPoints = liveScores == null ? fpl.getPlayerPoints(pId) : liveScores[pId];
    var ownershipDetails = sortedOwnership[i][1];
    var noOfManagers = tournament['no-of-managers'];
    var tsb = Math.round(ownershipDetails.tsb / noOfManagers * 100, 2);
    var fplEo = Math.round(ownershipDetails.fplEo / noOfManagers * 100, 2);
    var h2hEo = Math.round(ownershipDetails.h2hEo / noOfManagers * 100, 2);
    var addPlayer = true;
    if (!isFull) {
      if (count < 10 && playerFixtures[pId] > 0) {
        count++;
      } else {
        addPlayer = false;
      }
    }
    if (addPlayer) {
      msg += '\n*' + pName + ' (' + pPoints + '):*  ' + tsb + ' - ' + fplEo + ' - ' + h2hEo;
    }
    raw += pName + ':' + pPoints + ':' + tsb + ':' + fplEo + ':' + h2hEo + '$';
  }
  await ssService.updateValue(FIXTURE_SHEET_ID, TAB_INDEX, ROW_NUM, tournament['chip-col-index'], raw);
  return msg;
}

function sortOwnership(ownership) {
  var sortable = [];
  for (var i in ownership) {
    sortable.push([i, ownership[i]]);
  }
  sortable.sort(function(a, b) {
    return b[1].h2hEo - a[1].h2hEo || b[1].fplEo - a[1].fplEo || b[1].tsb - a[1].tsb;
  });
  return sortable;
}

module.exports = { processPlayerOwnership, processTeamOwnership, findFinalOwnership }