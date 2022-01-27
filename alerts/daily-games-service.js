const bot = require('../bot/bot-service');
const fplService = require('../processor/request/fpl-service');

const dateUtils = require('../utils/date-utils');

const FPL_CHANNEL_ID = process.env.fplChannelId;

const fpl = new fplService();

const SIGNATURE = '\n\nFollow *FPL Alerts* for more updates: https://t.me/fplalerts';

async function sendAlert() {
  try {
    console.log('Checking for daily games');
    await checkGames();
  } catch (err) {
    console.error(err);
    bot.sendMessage(process.env.author, 'On ' + new Date() + ' execution of daily games service failed with error ' + err);
  }
}

async function checkGames() {
  await fpl.init(1000);
  var message = '*Today\'s FPL games (time in IST)\n*';
  var fixs = await getTodayGames(fpl);
  if (fixs.length > 0) {
    message += fix + SIGNATURE;
    bot.sendMessage(FPL_CHANNEL_ID, message);
  }
}

async function getTodayGames(fpl) {
  var fixs = '';
  var fplFixs = fpl.getFixtures();
  for (var i in fplFixs) {
    var fplFix = fplFixs[i];
    if (fplFix.kickoff_time) {
      var koTime = new Date(fplFix.kickoff_time).getTime();
      if (dateUtils.isToday(koTime)) {
        fixs += '\n*' + fpl.getTeamName(fplFix.team_h) + '* vs. *' + fpl.getTeamName(fplFix.team_a) + '* (' + dateUtils.getISTTime(koTime) + ')';
      }
    }
  }
  return fixs;
}

module.exports = { sendAlert }