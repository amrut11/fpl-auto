const differential = require('../../../processor/diff/differential');

class fffldifferential extends differential {

  getMultiplier(team, playerName) {
    if (playerName == team.cap) {
      return 2;
    } else if (playerName == team.vc) {
      return 1.5;
    } else if (playerName == team.bench) {
      return 0.5;
    } else {
      return 1;
    }
  }

}

module.exports = fffldifferential;