function Tournament(name, sheetId, differential, calculator) {
  this.name = name;
  this.sheetId = sheetId;
  this.differential = differential;
  this.calculator = calculator;
}

function SheetConfig(info, updateDetails, updateTeams, findDiffs, calculateScores) {
  this.info = info;
  this.updateDetails = updateDetails;
  this.updateTeams = updateTeams;
  this.findDiffs = findDiffs;
  this.calculateScores = calculateScores;
}

function MatchConfig(ourTeam, players, teams, teammap) {
  this.ourTeam = ourTeam;
  this.players = players;
  this.teams = teams;
  this.teammap = teammap;
}

function UpdateConfig(tournament, sheetConfig, matchConfig) {
  this.tournament = tournament;
  this.sheetConfig = sheetConfig;
  this.matchConfig = matchConfig;
}

function Team(teamName, players) {
  this.teamName = teamName;
  this.players = players;
}

function GameweekTeam(team, cap, vice, bench, chip, isHomeTeam) {
  this.team = team;
  this.cap = cap;
  this.vice = vice;
  this.bench = bench;
  this.chip = chip;
  this.isHomeTeam = isHomeTeam;
}

function Match(gw, homeTeam, awayTeam, areWeHome) {
  this.gw = gw;
  this.homeTeam = homeTeam;
  this.awayTeam = awayTeam;
  this.areWeHome = areWeHome;
}

module.exports = {
  Tournament,
  SheetConfig, MatchConfig, UpdateConfig,
  Team, GameweekTeam, Match
}