const teams = require('./teams');

const teamMap = {
  'Arsenal': teams.arsenalTeam,
  'Villa': teams.villaTeam,
  'Brentford': teams.brentfordTeam,
  'Brighton': teams.brightonTeam,
  'Burnley': teams.burnleyTeam,
  'Chelsea': teams.chelseaTeam,
  'Palace': teams.palaceTeam,
  'Everton': teams.evertonTeam,
  'Leeds': teams.leedsTeam,
  'Leicester': teams.leicesterTeam,
  'Liverpool': teams.liverpoolTeam,
  'ManCity': teams.mancityTeam,
  'ManUtd': teams.manutdTeam,
  'Newcastle': teams.newcastleTeam,
  'Norwich': teams.norwichTeam,
  'Southampton': teams.southamptonTeam,
  'Spurs': teams.spursTeam,
  'Watford': teams.watfordTeam,
  'WestHam': teams.westhamTeam,
  'Wolves': teams.wolvesTeam,
}

function getTeam(inputName) {
  return teamMap[inputName];
}

module.exports = { getTeam }