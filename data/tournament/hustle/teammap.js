const teams = require('./teams');

const teamMap = {
  'ARS': teams.arsTeam,
  'AVL': teams.avlTeam,
  'BIR': teams.birTeam,
  'BLA': teams.blaTeam,
  'BOU': teams.bouTeam,
  'BRE': teams.breTeam,
  'BHA': teams.bhaTeam,
  'BUR': teams.burTeam,
  'CHE': teams.cheTeam,
  'CRY': teams.cryTeam,
  'EVE': teams.eveTeam,
  'LEE': teams.leeTeam,
  'LEI': teams.leiTeam,
  'LIV': teams.livTeam,
  'MCI': teams.mciTeam,
  'MUN': teams.munTeam,
  'NEW': teams.newTeam,
  'NOT': teams.notTeam,
  'SOU': teams.souTeam,
  'TOT': teams.totTeam,
  'WAT': teams.watTeam,
  'WBA': teams.wbaTeam,
  'WHU': teams.whuTeam,
  'WOL': teams.wolTeam
}

function getTeam(inputName) {
  return teamMap[inputName];
}

module.exports = {
  getTeam
}