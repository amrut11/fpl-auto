const differential = require('../../../processor/diff/differential');

class ffcucldifferential extends differential {

  getMultiplier(team, playerName) {
    if (team.bench.includes(playerName)) {
      return 0;
    } else {
      return 1;
    }
  }

}

module.exports = ffcucldifferential;