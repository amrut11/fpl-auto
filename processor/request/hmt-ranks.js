var fplService = require('./fpl-service');
var havenPlayers = require('../../data/tournament/haven/players').allPlayers;
var freeAgents = require('../../data/tournament/haven/players').freeAgents;

const ALL_MANAGERS = Object.assign({}, havenPlayers, freeAgents);

var fpl = new fplService();

async function getRanks() {
  await fpl.init(1000);
  let rankDetails = [];
  for (var i in ALL_MANAGERS) {
    var pId = ALL_MANAGERS[i];
    var url = 'https://fantasy.premierleague.com/api/entry/' + pId + '/';
    var entry = await fpl.downloadPage(url);
    console.dir(i + '\t' + entry.summary_overall_rank);
    rankDetails.push(createRankDetails(pId, i, entry.summary_overall_rank));
  }
  var ranks = new Object();
  ranks.rankDetails = rankDetails;
  ranks.length = rankDetails.length;
  return ranks;
}

function createRankDetails(pId, pName, rank) {
  var rankDetails = new Object();
  rankDetails.id = pId;
  rankDetails.name = pName;
  rankDetails.rank = rank;
  return rankDetails;
}

module.exports = { getRanks }