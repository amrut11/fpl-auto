const fplAlertsPromotion = require('./promotion-jobs').fplAlertsPromotion;
const alertServiceJob = require('./alert-jobs').alertServiceJob;
const priceChangeJob = require('./alert-jobs').priceChangeJob;
const dailyGamesJob = require('./alert-jobs').dailyGamesJob;
const updateJob = require('./update-jobs').updateJob;
const dbHkJob = require('./housekeeping-jobs').dbHkJob;

function startJobs() {
  fplAlertsPromotion.start();
  alertServiceJob.start();
  priceChangeJob.start();
  dailyGamesJob.start();
  updateJob.start();
  dbHkJob.start();
}

module.exports = { startJobs }