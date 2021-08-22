const teams = require('./teams');

const teamMap = {
  'Atletico': teams.atleticoTeam,
  'Barca': teams.barcaTeam,
  'Betis': teams.betisTeam,
  'Bilbao': teams.bilbaoTeam,
  'Celta': teams.celtaTeam,
  'R Madrid': teams.rmadridTeam,
  'Sevilla': teams.sevillaTeam,
  'Sociedad': teams.sociedadTeam,
  'Valencia': teams.valenciaTeam,
  'Villarreal': teams.villarrealTeam,
  'Arsenal': teams.arsenalTeam,
  'Chelsea': teams.chelseaTeam,
  'Everton': teams.evertonTeam,
  'Leeds': teams.leedsTeam,
  'Leicester': teams.leicesterTeam,
  'Liverpool': teams.liverpoolTeam,
  'Man City': teams.mancityTeam,
  'Man Utd': teams.manunitedTeam,
  'Spurs': teams.tottenhamTeam,
  'Wolves': teams.wolvesTeam
}

function getTeam(inputName) {
  return teamMap[inputName];
}

module.exports = {
  getTeam
}