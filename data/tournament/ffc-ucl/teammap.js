const teams = require('./teams');

const teamMap = {
  'Burnley': teams.burnleyTeam,
  'Chelsea': teams.chelseaTeam,
  'Man City': teams.mancityTeam,
  'Blackburn': teams.blackburnTeam,
  'Man United': teams.manunitedTeam,
  'Southampton': teams.southamptonTeam,
  'WestHam': teams.westHamTeam,
  'Wolves': teams.wolvesTeam
}

function getTeam(inputName) {
  return teamMap[inputName];
}

module.exports = { getTeam }