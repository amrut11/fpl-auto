const players = require('./players');
const interfaces = require('../../interfaces');

const atletico = new interfaces.Team('Atletico', players.atleticoPlayers);
const barca = new interfaces.Team('Barca', players.barcaPlayers);
const betis = new interfaces.Team('Betis', players.betisPlayers);
const bilbao = new interfaces.Team('Bilbao', players.bilbaoPlayers);
const celta = new interfaces.Team('Celta', players.celtaPlayers);
const rmadrid = new interfaces.Team('R Madrid', players.rmadridPlayers);
const sevilla = new interfaces.Team('Sevilla', players.sevillaPlayers);
const sociedad = new interfaces.Team('Sociedad', players.sociedadPlayers);
const valencia = new interfaces.Team('Valencia', players.valenciaPlayers);
const villarreal = new interfaces.Team('Villarreal', players.villarrealPlayers);
const arsenal = new interfaces.Team('Arsenal', players.arsenalPlayers);
const chelsea = new interfaces.Team('Chelsea', players.chelseaPlayers);
const everton = new interfaces.Team('Everton', players.evertonPlayers);
const leeds = new interfaces.Team('Leeds', players.leedsPlayers);
const leicester = new interfaces.Team('Leicester', players.leicesterPlayers);
const liverpool = new interfaces.Team('Liverpool', players.liverpoolPlayers);
const mancity = new interfaces.Team('Man City', players.mancityPlayers);
const manunited = new interfaces.Team('Man Utd', players.manutdPlayers);
const tottenham = new interfaces.Team('Spurs', players.spursPlayers);
const wolves = new interfaces.Team('Wolves', players.wolvesPlayers);

module.exports = {
  atleticoTeam: atletico,
  barcaTeam: barca,
  betisTeam: betis,
  bilbaoTeam: bilbao,
  celtaTeam: celta,
  rmadridTeam: rmadrid,
  sevillaTeam: sevilla,
  sociedadTeam: sociedad,
  valenciaTeam: valencia,
  villarrealTeam: villarreal,
  arsenalTeam: arsenal,
  chelseaTeam: chelsea,
  evertonTeam: everton,
  leedsTeam: leeds,
  leicesterTeam: leicester,
  liverpoolTeam: liverpool,
  mancityTeam: mancity,
  manunitedTeam: manunited,
  tottenhamTeam: tottenham,
  wolvesTeam: wolves
}