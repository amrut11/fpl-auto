const fplService = require('../../processor/request/fpl-service');
const sorter = require('../../utils/sorter');

const fpl = new fplService();

async function getResults() {
  console.log('Updating GW results for all teams');
  await fpl.init(1000);
  var fixs = fpl.getFixtures();
  var teamFixs = createFixs(fixs);
  teamFixs = sorter.sortObject(teamFixs);
  return createMessage(teamFixs);
}

function createFixs(fixs) {
  var teamFixs = new Object();
  fixs.forEach(function(fix) {
    if (fix.event == null) {
      return;
    }
    var homeTeam = fpl.getTeamName(fix.team_h);
    var awayTeam = fpl.getTeamName(fix.team_a);
    var homeGoals = fix.team_h_score ? fix.team_h_score : 0;
    var awayGoals = fix.team_a_score ? fix.team_a_score : 0;

    var homeFix = new Object();
    homeFix.gw = fix.event;
    homeFix.opponent = awayTeam;
    homeFix.venue = 'H';
    homeFix.finished = fix.finished;
    homeFix.score = homeGoals + ' - ' + awayGoals;
    homeFix.gf = homeGoals;
    homeFix.ga = awayGoals;
    if (!teamFixs[homeTeam]) {
      let newFix = [];
      teamFixs[homeTeam] = newFix;
    }
    teamFixs[homeTeam].push(homeFix);

    var awayFix = new Object();
    awayFix.gw = fix.event;
    awayFix.opponent = homeTeam;
    awayFix.venue = 'A';
    awayFix.finished = fix.finished;
    awayFix.score = homeGoals + ' - ' + awayGoals;
    awayFix.gf = awayGoals;
    awayFix.ga = homeGoals;
    if (!teamFixs[awayTeam]) {
      let newFix = [];
      teamFixs[awayTeam] = newFix;
    }
    teamFixs[awayTeam].push(awayFix);
  });
  return teamFixs;
}

function createMessage(teamFixs) {
  var msg = '';
  for (var i in teamFixs) {
    var fixs = teamFixs[i];
    msg += i + '^';
    for (var j in fixs) {
      var fix = fixs[j];
      msg += fix.gw + ':' + fix.opponent + ':' + fix.venue + ':' + fix.finished + ':' + fix.score + ':' + fix.gf + ':' + fix.ga + '%';
    }
    msg += '$' + i + '$' + i + '$' + i + '$' + i + '$' + i + '$' + i + '$' + i + '$';
  }
  return msg;
}

module.exports = { getResults }