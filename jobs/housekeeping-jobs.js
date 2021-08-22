const CronJob = require('cron').CronJob;
const dbHousekeeper = require('../db/repldb-housekeeper');

const DB_HK_CRON = process.env.DB_HK_CRON;

var dbHkJob = new CronJob(DB_HK_CRON, function() {
  console.log('Running housekeeping on DB');
  dbHousekeeper.cleanUp();
}, null, false, 'Asia/Kolkata');

module.exports = { dbHkJob }