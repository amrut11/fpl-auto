const players = require('./players');
const interfaces = require('../../interfaces');

const Barnsley = new interfaces.Team('Barnsley', players.BarnsleyPlayers);
const Birmingham = new interfaces.Team('Birmingham', players.BirminghamPlayers);
const Blackburn = new interfaces.Team('Blackburn', players.BlackburnPlayers);
const Blackpool = new interfaces.Team('Blackpool', players.BlackpoolPlayers);
const Bournemouth = new interfaces.Team('Bournemouth', players.BournemouthPlayers);
const Bristol = new interfaces.Team('Bristol', players.BristolPlayers);
const Cardiff = new interfaces.Team('Cardiff', players.CardiffPlayers);
const Derby = new interfaces.Team('Derby', players.DerbyPlayers);
const Fulham = new interfaces.Team('Fulham', players.FulhamPlayers);
const Hull = new interfaces.Team('Hull', players.HullPlayers);
const Luton = new interfaces.Team('Luton', players.LutonPlayers);
const Middlesbrough = new interfaces.Team('Middlesbrough', players.MiddlesbroughPlayers);
const Millwall = new interfaces.Team('Millwall', players.MillwallPlayers);
const Nottingham = new interfaces.Team('Nottingham', players.NottinghamPlayers);
const Qpr = new interfaces.Team('Qpr', players.QprPlayers);
const Reading = new interfaces.Team('Reading', players.ReadingPlayers);
const Sheffield = new interfaces.Team('Sheffield', players.SheffieldPlayers);
const Stoke = new interfaces.Team('Stoke', players.StokePlayers);
const Swansea = new interfaces.Team('Swansea', players.SwanseaPlayers);
const WestBrom = new interfaces.Team('WestBrom', players.WestBromPlayers);

module.exports = {
  BarnsleyTeam: Barnsley,
  BirminghamTeam: Birmingham,
  BlackburnTeam: Blackburn,
  BlackpoolTeam: Blackpool,
  BournemouthTeam: Bournemouth,
  BristolTeam: Bristol,
  CardiffTeam: Cardiff,
  DerbyTeam: Derby,
  FulhamTeam: Fulham,
  HullTeam: Hull,
  LutonTeam: Luton,
  MiddlesbroughTeam: Middlesbrough,
  MillwallTeam: Millwall,
  NottinghamTeam: Nottingham,
  QprTeam: Qpr,
  ReadingTeam: Reading,
  SheffieldTeam: Sheffield,
  StokeTeam: Stoke,
  SwanseaTeam: Swansea,
  WestBromTeam: WestBrom
}