const teams = require('./teams');

const teamMap = {
  'Barnsley': teams.barnsleyTeam,
  'Birmingham': teams.birminghamTeam,
  'Blackburn': teams.blackburnTeam,
  'Bournemouth': teams.bournemouthTeam,
  'Cardiff': teams.cardiffTeam,
  'Derby': teams.derbyTeam,
  'Fulham': teams.fulhamTeam,
  'Hull': teams.hullTeam,
  'Middlesbrough': teams.middlesbroughTeam,
  'Millwall': teams.millwallTeam,
  'Nottingham': teams.nottinghamTeam,
  'Preston': teams.prestonTeam,
  'Qpr': teams.qprTeam,
  'Reading': teams.readingTeam,
  'Stoke': teams.stokeTeam,
  'Swansea': teams.swanseaTeam
}

function getTeam(inputName) {
  return teamMap[inputName];
}

module.exports = {
  getTeam
}