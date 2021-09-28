const CronJob = require('cron').CronJob;
const fplDataWriter = require('../spreadsheet/writer/fpl-data-writer');
const plannerTeamsWriter = require('../spreadsheet/writer/planner-teams-writer');

const UPDATE_FDR_CRON = process.env.UPDATE_FDR_CRON;

var updateJob = new CronJob(UPDATE_FDR_CRON, async function() {
  await fplDataWriter.updateFixtures();
  await fplDataWriter.updatePlayers();
  await fplDataWriter.updateResults();
  await fplDataWriter.updatePlayerData();
  await plannerTeamsWriter.updateTeams();
}, null, false, 'Asia/Kolkata');

module.exports = { updateJob }