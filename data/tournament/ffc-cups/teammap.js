const ffcTeams = require('../ffc/teams');
const ffc2Teams = require('../ffc2/teams');

const teamMap = {
  'Arsenal': ffcTeams.arsenalTeam,
  'Villa': ffcTeams.villaTeam,
  'Brentford': ffcTeams.brentfordTeam,
  'Brighton': ffcTeams.brightonTeam,
  'Burnley': ffcTeams.burnleyTeam,
  'Chelsea': ffcTeams.chelseaTeam,
  'Palace': ffcTeams.palaceTeam,
  'Everton': ffcTeams.evertonTeam,
  'Leeds': ffcTeams.leedsTeam,
  'Leicester': ffcTeams.leicesterTeam,
  'Liverpool': ffcTeams.liverpoolTeam,
  'ManCity': ffcTeams.mancityTeam,
  'ManUtd': ffcTeams.manutdTeam,
  'Newcastle': ffcTeams.newcastleTeam,
  'Norwich': ffcTeams.norwichTeam,
  'Southampton': ffcTeams.southamptonTeam,
  'Spurs': ffcTeams.spursTeam,
  'Watford': ffcTeams.watfordTeam,
  'WestHam': ffcTeams.westhamTeam,
  'Wolves': ffcTeams.wolvesTeam,
  'Barnsley': ffc2Teams.BarnsleyTeam,
  'Birmingham': ffc2Teams.BirminghamTeam,
  'Blackburn': ffc2Teams.BlackburnTeam,
  'Blackpool': ffc2Teams.BlackpoolTeam,
  'Bournemouth': ffc2Teams.BournemouthTeam,
  'Bristol': ffc2Teams.BristolTeam,
  'Cardiff': ffc2Teams.CardiffTeam,
  'Derby': ffc2Teams.DerbyTeam,
  'Fulham': ffc2Teams.FulhamTeam,
  'Hull': ffc2Teams.HullTeam,
  'Luton': ffc2Teams.LutonTeam,
  'Middlesbrough': ffc2Teams.MiddlesbroughTeam,
  'Millwall': ffc2Teams.MillwallTeam,
  'Nottingham': ffc2Teams.NottinghamTeam,
  'Qpr': ffc2Teams.QprTeam,
  'Reading': ffc2Teams.ReadingTeam,
  'Sheffield': ffc2Teams.SheffieldTeam,
  'Stoke': ffc2Teams.StokeTeam,
  'Swansea': ffc2Teams.SwanseaTeam,
  'WestBrom': ffc2Teams.WestBromTeam,
}

function getTeam(inputName) {
  return teamMap[inputName];
}

module.exports = { getTeam }