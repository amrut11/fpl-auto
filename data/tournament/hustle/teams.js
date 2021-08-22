const players = require('./players');
const interfaces = require('../../interfaces');

const ARS = new interfaces.Team('ARS', players.arsPlayers);
const AVL = new interfaces.Team('AVL', players.avlPlayers);
const BIR = new interfaces.Team('BIR', players.birPlayers);
const BLA = new interfaces.Team('BLA', players.blaPlayers);
const BOU = new interfaces.Team('BOU', players.bouPlayers);
const BRE = new interfaces.Team('BRE', players.brePlayers);
const BHA = new interfaces.Team('BHA', players.bhaPlayers);
const BUR = new interfaces.Team('BUR', players.burPlayers);
const CHE = new interfaces.Team('CHE', players.chePlayers);
const CRY = new interfaces.Team('CRY', players.cryPlayers);
const EVE = new interfaces.Team('EVE', players.evePlayers);
const LEE = new interfaces.Team('LEE', players.leePlayers);
const LEI = new interfaces.Team('LEI', players.leiPlayers);
const LIV = new interfaces.Team('LIV', players.livPlayers);
const MCI = new interfaces.Team('MCI', players.mciPlayers);
const MUN = new interfaces.Team('MUN', players.munPlayers);
const NEW = new interfaces.Team('NEW', players.newPlayers);
const NOT = new interfaces.Team('NOT', players.notPlayers);
const SOU = new interfaces.Team('SOU', players.souPlayers);
const TOT = new interfaces.Team('TOT', players.totPlayers);
const WAT = new interfaces.Team('WAT', players.watPlayers);
const WBA = new interfaces.Team('WBA', players.wbaPlayers);
const WHU = new interfaces.Team('WHU', players.whuPlayers);
const WOL = new interfaces.Team('WOL', players.wolPlayers);

module.exports = {
  arsTeam: ARS,
  avlTeam: AVL,
  birTeam: BIR,
  blaTeam: BLA,
  bouTeam: BOU,
  breTeam: BRE,
  bhaTeam: BHA,
  burTeam: BUR,
  cheTeam: CHE,
  cryTeam: CRY,
  eveTeam: EVE,
  leeTeam: LEE,
  leiTeam: LEI,
  livTeam: LIV,
  mciTeam: MCI,
  munTeam: MUN,
  newTeam: NEW,
  notTeam: NOT,
  souTeam: SOU,
  totTeam: TOT,
  watTeam: WAT,
  wbaTeam: WBA,
  whuTeam: WHU,
  wolTeam: WOL
}