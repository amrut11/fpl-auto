const players = require('./players');
const interfaces = require('../../interfaces');

const Barnsley = new interfaces.Team('Barnsley', players.barnsleyPlayers);
const Birmingham = new interfaces.Team('Birmingham', players.birminghamPlayers);
const Blackburn = new interfaces.Team('Blackburn', players.blackburnPlayers);
const Bournemouth = new interfaces.Team('Bournemouth', players.bournemouthPlayers);
const Cardiff = new interfaces.Team('Cardiff', players.cardiffPlayers);
const Derby = new interfaces.Team('Derby', players.derbyPlayers);
const Fulham = new interfaces.Team('Fulham', players.fulhamPlayers);
const Hull = new interfaces.Team('Hull', players.hullPlayers);
const Middlesbrough = new interfaces.Team('Middlesbrough', players.middlesbroughPlayers);
const Millwall = new interfaces.Team('Millwall', players.millwallPlayers);
const Nottingham = new interfaces.Team('Nottingham', players.nottinghamPlayers);
const Preston = new interfaces.Team('Preston', players.prestonPlayers);
const Qpr = new interfaces.Team('Qpr', players.qprPlayers);
const Reading = new interfaces.Team('Reading', players.readingPlayers);
const Stoke = new interfaces.Team('Stoke', players.stokePlayers);
const Swansea = new interfaces.Team('Swansea', players.swanseaPlayers);

module.exports = {
  barnsleyTeam: Barnsley,
  birminghamTeam: Birmingham,
  blackburnTeam: Blackburn,
  bournemouthTeam: Bournemouth,
  cardiffTeam: Cardiff,
  derbyTeam: Derby,
  fulhamTeam: Fulham,
  hullTeam: Hull,
  middlesbroughTeam: Middlesbrough,
  millwallTeam: Millwall,
  nottinghamTeam: Nottingham,
  prestonTeam: Preston,
  qprTeam: Qpr,
  readingTeam: Reading,
  stokeTeam: Stoke,
  swanseaTeam: Swansea
}