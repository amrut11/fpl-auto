const differential = require('../../../processor/diff/differential');

class ffcCupsDifferential extends differential {

  getMultiplier(team, playerName) {
    if (team.bench.includes(playerName)) {
      return 0;
    } else {
      return 1;
    }
  }

}

module.exports = ffcCupsDifferential;