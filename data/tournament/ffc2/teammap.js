const teams = require('./teams');

const teamMap = {
  'Barnsley': teams.BarnsleyTeam,
  'Birmingham': teams.BirminghamTeam,
  'Blackburn': teams.BlackburnTeam,
  'Blackpool': teams.BlackpoolTeam,
  'Bournemouth': teams.BournemouthTeam,
  'Bristol': teams.BristolTeam,
  'Cardiff': teams.CardiffTeam,
  'Derby': teams.DerbyTeam,
  'Fulham': teams.FulhamTeam,
  'Hull': teams.HullTeam,
  'Luton': teams.LutonTeam,
  'Middlesbrough': teams.MiddlesbroughTeam,
  'Millwall': teams.MillwallTeam,
  'Nottingham': teams.NottinghamTeam,
  'Qpr': teams.QprTeam,
  'Reading': teams.ReadingTeam,
  'Sheffield': teams.SheffieldTeam,
  'Stoke': teams.StokeTeam,
  'Swansea': teams.SwanseaTeam,
  'WestBrom': teams.WestBromTeam,
}

function getTeam(inputName) {
  return teamMap[inputName];
}

module.exports = { getTeam }