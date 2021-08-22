const differential = require('../../../processor/diff/differential');

class ffcdifferential extends differential {

  getMultiplier(team, playerName) {
    if (playerName == team.cap) {
      return 2;
    } else if (playerName == team.bench) {
      return 0;
    } else {
      return 1;
    }
  }

}

module.exports = ffcdifferential;