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
  console.log('Found ' + fixs.length + ' games today');
  if (fixs.length > 0) {
    for (var i in fixs) {
      var fix = fixs[i];
      message += '\n*' + fix.homeTeam + '* vs. *' + fix.awayTeam + '* (' + fix.startTime + ')';
    }
    message += SIGNATURE;
    bot.sendMessage(FPL_CHANNEL_ID, message);
  }
}

async function getTodayGames(fpl) {
  let fixs = [];
  var fplFixs = fpl.getFixtures();
  for (var i in fplFixs) {
    var fplFix = fplFixs[i];
    if (fplFix.kickoff_time) {
      var koTime = new Date(fplFix.kickoff_time).getTime();
      if (dateUtils.isToday(koTime)) {
        var fix = new Object();
        fix.homeTeam = fpl.getTeamName(fplFix.team_h);
        fix.awayTeam = fpl.getTeamName(fplFix.team_a);
        fix.startTime = dateUtils.getISTTime(koTime);
        fixs.push(fix);
      }
    }
  }
  return fixs;
}

module.exports = { sendAlert }