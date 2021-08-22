const interfaces = require('../interfaces');

const ffcPlayers = require('./ffc/players');
const ffcTeams = require('./ffc/teams');
const ffcTeammap = require('./ffc/teammap');

const ffcUclPlayers = require('./ffc-ucl/players');
const ffcUclTeams = require('./ffc-ucl/teams');
const ffcUclTeammap = require('./ffc-ucl/teammap');

const hustlePlayers = require('./hustle/players');
const hustleTeams = require('./hustle/teams');
const hustleTeammap = require('./hustle/teammap');

const havenPlayers = require('./haven/players');
const havenTeams = require('./haven/teams');
const havenTeammap = require('./haven/teammap');

const ffflPlayers = require('./fffl/players');
const ffflTeams = require('./fffl/teams');
const ffflTeammap = require('./fffl/teammap');

const ffcMatchConfig = new interfaces.MatchConfig('Everton', ffcPlayers, ffcTeams, ffcTeammap);

const ffcUclMatchConfig = new interfaces.MatchConfig('Everton', ffcUclPlayers, ffcUclTeams, ffcUclTeammap);

const hustleMatchConfig = new interfaces.MatchConfig('BLA', hustlePlayers, hustleTeams, hustleTeammap);

const havenMatchConfig = new interfaces.MatchConfig('Man City', havenPlayers, havenTeams, havenTeammap);

const ffflMatchConfig = new interfaces.MatchConfig('Millwall', ffflPlayers, ffflTeams, ffflTeammap);

module.exports = {
  ffcMatchConfig, ffcUclMatchConfig, hustleMatchConfig, havenMatchConfig, ffflMatchConfig
}