const differential = require('../../../processor/diff/differential');

class hustledifferential extends differential {

  getMultiplier(team, playerName) {
    if (playerName == team.cap) {
      return 2;
    } else if (playerName == team.vice) {
      return 1.5;
    } else {
      return 1;
    }
  }

}

module.exports = hustledifferential;