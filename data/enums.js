const MatchConfigs = require('./tournament/match-configs');
const Tournaments = require('./tournament/tournaments');

const BotCommands = Object.freeze({
  NEW_GW: {
    'command': 'new_gw'
  },
  UPDATE_LEAGUE: {
    'command': 'update_league'
  },
  UPDATE_GW: {
    'command': 'update_gw'
  },
  GET_INFO: {
    'command': 'get_info',
    'type': 'public'
  },
  UPDATE_DETAILS: {
    'command': 'update_details'
  },
  UPDATE_LIVE: {
    'command': 'update_live'
  },
  GET_LIVE_SCORE: {
    'command': 'get_live_score',
    'type': 'public'
  },
  UPDATE_DIFFS: {
    'command': 'update_diffs'
  },
  GET_DIFFS: {
    'command': 'get_diffs',
    'type': 'public'
  },
  UPDATE_TEAMS: {
    'command': 'update_teams'
  },
  THEIR_TEAMS: {
    'command': 'their_teams'
  },
  FINAL_SCORE: {
    'command': 'final_score'
  },
  GET_FINAL_SCORE: {
    'command': 'get_final_score',
    'type': 'public'
  },
  GET_BONUS: {
    'command': 'get_bonus',
    'type': 'public'
  },
  LEAGUE_H2H: {
    'command': 'league_h2h',
    'type': 'mod'
  },
  LEAGUE_INDIVIDUAL: {
    'command': 'league_individual',
  },
  LEAGUE_DIFFS: {
    'command': 'league_diffs',
    'type': 'mod'
  },
  LEAGUE_CHIPS: {
    'command': 'league_chips'
  },
  LEAGUE_STATS: {
    'command': 'league_stats'
  },
  LIVE_MATCHES: {
    'command': 'live_matches'
  },
  HAVEN_LEAGUE_PP: {
    'command': 'haven_league_pp',
    'type': 'mod'
  },
  HAVEN_CL_PP: {
    'command': 'haven_cl_pp',
    'type': 'mod'
  },
  HUSTLE_NOMINATION: {
    'command': 'hustle_nomination',
    'type': 'mod'
  },
  FFFL_NOMINATION: {
    'command': 'fffl_nomination',
    'type': 'mod'
  },
  NOMS: {
    'command': 'noms',
    'type': 'public'
  },
  PLAYER_SEARCH: {
    'command': 'player_search',
    'type': 'public'
  },
  TEAM_SCORE: {
    'command': 'team_score',
    'type': 'public'
  },
  IPL_LIVE: {
    'command': 'ipl_live'
  },
  IPL_SCORE: {
    'command': 'ipl_score'
  },
  MY_IPL_SCORE: {
    'command': 'my_ipl_score'
  },
  VACCINE_ALERT: {
    'command': 'vaccine_alert'
  }
});

const LEAGUES = Object.freeze({
  FFC: {
    'name': 'FFC',
    'sheet-id': process.env.FFC_PP_SHEET_ID,
    'fixture-count': 10,
    'chip-col-index': 2,
    'no-of-managers': 160
  },
  HUSTLE: {
    'name': 'Hustle',
    'sheet-id': process.env.HUSTLE_PP_SHEET_ID,
    'fixture-count': 12,
    'chip-col-index': 3,
    'no-of-managers': 192,
    'diff-teams': ['BOU', 'BLA']
  },
  HAVEN: {
    'name': 'Haven',
    'sheet-id': process.env.HAVEN_PP_SHEET_ID,
    'fixture-count': 10,
    'update-score-sheet': true,
    'free-agent-scores': false,
    'chip-col-index': 4,
    'no-of-managers': 200
  },
  HAVEN_CL: {
    'name': 'Haven CL',
    'sheet-id': process.env.HAVEN_CUP_SHEET_ID,
    'fixture-count': 6,
  },
  FFFL: {
    'name': 'FFFL',
    'sheet-id': process.env.FFFL_PP_SHEET_ID,
    'fixture-count': 8,
    'chip-col-index': 5,
    'no-of-managers': 128,
    'sub-multiplier': 0.5,
    'diff-teams': ['Cardiff', 'Millwall']
  },
});

const LEAGUE_CONFIGS = Object.freeze({
  FFC_H2H: {
    'league': LEAGUES.FFC,
    'score-type': 'H2H'
  },
  HUSTLE_H2H: {
    'league': LEAGUES.HUSTLE,
    'score-type': 'H2H'
  },
  HAVEN_H2H: {
    'league': LEAGUES.HAVEN,
    'score-type': 'H2H'
  },
  FFFL_H2H: {
    'league': LEAGUES.FFFL,
    'score-type': 'H2H'
  },
  FFC_INDIVIDUAL: {
    'league': LEAGUES.FFC,
    'score-type': 'Individual'
  },
  HUSTLE_INDIVIDUAL: {
    'league': LEAGUES.HUSTLE,
    'score-type': 'Individual'
  },
  HAVEN_INDIVIDUAL: {
    'league': LEAGUES.HAVEN,
    'score-type': 'Individual'
  },
  FFFL_INDIVIDUAL: {
    'league': LEAGUES.FFFL,
    'score-type': 'Individual'
  },
  HUSTLE_DIFFS: {
    'league': LEAGUES.HUSTLE,
    'score-type': 'Diffs'
  },
  HAVEN_DIFFS: {
    'league': LEAGUES.HAVEN,
    'score-type': 'Diffs'
  },
  HAVEN_CL_DIFFS: {
    'league': LEAGUES.HAVEN_CL,
    'score-type': 'Diffs'
  },
  FFFL_DIFFS: {
    'league': LEAGUES.FFFL,
    'score-type': 'Diffs'
  },
  FFC_OWNERSHIP: {
    'league': LEAGUES.FFC,
    'score-type': 'Ownership',
    'full-ownership': true
  },
  HUSTLE_OWNERSHIP: {
    'league': LEAGUES.HUSTLE,
    'score-type': 'Ownership',
    'full-ownership': true
  },
  HAVEN_OWNERSHIP: {
    'league': LEAGUES.HAVEN,
    'score-type': 'Ownership',
    'full-ownership': true
  },
  HAVEN_OWNERSHIP_TOP10: {
    'league': LEAGUES.HAVEN,
    'score-type': 'Ownership'
  },
  FFFL_OWNERSHIP: {
    'league': LEAGUES.FFFL,
    'score-type': 'Ownership',
    'full-ownership': true
  },
  HAVEN_CAPTAINS: {
    'league': LEAGUES.HAVEN,
    'score-type': 'Captains',
  },
  FFC_CHIPS: {
    'league': LEAGUES.FFC,
    'score-type': 'Chips'
  },
  HUSTLE_CHIPS: {
    'league': LEAGUES.HUSTLE,
    'score-type': 'Chips'
  },
  HAVEN_CHIPS: {
    'league': LEAGUES.HAVEN,
    'score-type': 'Chips'
  },
  FFFL_CHIPS: {
    'league': LEAGUES.FFFL,
    'score-type': 'Chips'
  },
});

const TOURN_MAP = {
  'FFC': Tournaments.ffcTournament,
  'FFC-UCL': Tournaments.ffcUclTournament,
  'Hustle': Tournaments.hustleTournament,
  'Haven': Tournaments.havenTournament,
  'FFFL': Tournaments.ffflTournament,
  'Opponent': Tournaments.opponent
}

const MATCH_CONFIG_MAP = {
  'FFC': MatchConfigs.ffcMatchConfig,
  'FFC-UCL': MatchConfigs.ffcUclMatchConfig,
  'Hustle': MatchConfigs.hustleMatchConfig,
  'Haven': MatchConfigs.havenMatchConfig,
  'FFFL': MatchConfigs.ffflMatchConfig,
  'Opponent': MatchConfigs.ffcMatchConfig
}

module.exports = { BotCommands, LEAGUE_CONFIGS, TOURN_MAP, MATCH_CONFIG_MAP }

// update_details - Update details
// update_live - Update LIVE scores
// get_live_score - Display LIVE scores
// update_diffs - Update diffs
// get_diffs - Display diffs
// our_teams - Update our teams
// their_teams - Update their teams
// final_score - Update FINAL scores
// get_final_score - Display FINAL scores
// get_bonus - Get LIVE bonus for ongoing GW
// league_h2h - Get H2H scores for all leagues
// league_individual - Get Individual scores for all leagues
// league_diffs - Get diffs for all leagues
// league_chips - Update chips for all leagues
// league_stats - Update ownership and cap for leagues
// live_matches - Get live matches data
// my_team - Get live score of your FPL team
// haven_league_pp - Update league PP nominations
// haven_cl_pp - Update CL PP nominations