const differential = require('../../../processor/diff/differential');

class havendifferential extends differential {

  getMultiplier(team, playerName) {
    if (playerName == team.cap) {
      return team.chip == 'TC' ? 3 : 2;
    } else if (playerName == team.vice) {
      return team.chip == 'DVC' ? 2 : 1.5;
    } else if (playerName == team.bench) {
      return team.chip == 'SS' ? 1 : 0;
    } else {
      return 1;
    }
  }

}

module.exports = havendifferential;