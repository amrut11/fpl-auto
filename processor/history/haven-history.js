const fplService = require('../request/fpl-service');
const players = require('../../data/tournament/haven/players').allPlayers;

const ssService = require('../../spreadsheet/spreadsheet-service')

const fpl = new fplService();

async function getHistory() {
  await fpl.init(1000);
  var msg = '';
  for (var i in players) {
    var playerId = players[i];
    console.dir(i + ': ' + playerId);
    var url = 'https://fantasy.premierleague.com/api/entry/' + playerId + '/history/';
    var history = await fpl.downloadPage(url);
    var past = history.past;
    msg += i + ':';
    for (var j = past.length - 1; j >= 0; j--) {
      msg += past[j].rank+'%';
    }
    msg += '$';
  }
  console.dir(msg);
  return msg;
}

module.exports = { getHistory }