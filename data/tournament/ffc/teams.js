const players = require('./players');
const interfaces = require('../../interfaces');

const Arsenal = new interfaces.Team('Arsenal', players.arsenalPlayers);
const Villa = new interfaces.Team('Villa', players.villaPlayers);
const Brentford = new interfaces.Team('Brentford', players.brentfordPlayers);
const Brighton = new interfaces.Team('Brighton', players.brightonPlayers);
const Burnley = new interfaces.Team('Burnley', players.burnleyPlayers);
const Chelsea = new interfaces.Team('Chelsea', players.chelseaPlayers);
const Palace = new interfaces.Team('Palace', players.palacePlayers);
const Everton = new interfaces.Team('Everton', players.evertonPlayers);
const Leeds = new interfaces.Team('Leeds', players.leedsPlayers);
const Leicester = new interfaces.Team('Leicester', players.leicesterPlayers);
const Liverpool = new interfaces.Team('Liverpool', players.liverpoolPlayers);
const ManCity = new interfaces.Team('ManCity', players.mancityPlayers);
const ManUtd = new interfaces.Team('ManUtd', players.manutdPlayers);
const Newcastle = new interfaces.Team('Newcastle', players.newcastlePlayers);
const Norwich = new interfaces.Team('Norwich', players.norwichPlayers);
const Southampton = new interfaces.Team('Southampton', players.southamptonPlayers);
const Spurs = new interfaces.Team('Spurs', players.spursPlayers);
const Watford = new interfaces.Team('Watford', players.watfordPlayers);
const WestHam = new interfaces.Team('WestHam', players.westhamPlayers);
const Wolves = new interfaces.Team('Wolves', players.wolvesPlayers);

module.exports = {
  arsenalTeam: Arsenal,
  villaTeam: Villa,
  brentfordTeam: Brentford,
  brightonTeam: Brighton,
  burnleyTeam: Burnley,
  chelseaTeam: Chelsea,
  palaceTeam: Palace,
  evertonTeam: Everton,
  leedsTeam: Leeds,
  leicesterTeam: Leicester,
  liverpoolTeam: Liverpool,
  mancityTeam: ManCity,
  manutdTeam: ManUtd,
  newcastleTeam: Newcastle,
  norwichTeam: Norwich,
  southamptonTeam: Southampton,
  spursTeam: Spurs,
  watfordTeam: Watford,
  westhamTeam: WestHam,
  wolvesTeam: Wolves
}