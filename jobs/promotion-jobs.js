const CronJob = require('cron').CronJob;
const bot = require('../bot/bot-service');

const fplAlertsMsg = '➡️ Enjoying the FPL Alerts service? Why not share this channel with all your FPL mates!\n\n🔗 This is a private channel and they can follow below link to join: https://t.me/fplalerts\n\n💬 Contact me at @Amrut116 if you need any help or you wish to share feedback or suggestions.';

const PROMOTION_CRON = process.env.PROMOTION_CRON;

var fplAlertsPromotion = new CronJob(PROMOTION_CRON, function() {
  console.log('Sending out FPL Alerts promotion');
  bot.sendMessage(process.env.fplChannelId, fplAlertsMsg);
}, null, false, 'Asia/Kolkata');

module.exports = { fplAlertsPromotion }