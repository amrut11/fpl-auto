const players = require('./players');
const interfaces = require('../../interfaces');

const blackburn = new interfaces.Team('Blackburn', players.blackburnPlayers);
const manunited = new interfaces.Team('Man United', players.manunitedPlayers);
const southampton = new interfaces.Team('Southampton', players.southamptonPlayers);
const wolves = new interfaces.Team('Wolves', players.wolvesPlayers);
const burnley = new interfaces.Team('Burnley', players.burnleyPlayers);
const chelsea = new interfaces.Team('Chelsea', players.chelseaPlayers);
const mancity = new interfaces.Team('Man City', players.mancityPlayers);

module.exports = {
  blackburnTeam: blackburn,
  manunitedTeam: manunited,
  southamptonTeam: southampton,
  wolvesTeam: wolves,
  burnleyTeam: burnley,
  chelseaTeam: chelsea,
  mancityTeam: mancity
}