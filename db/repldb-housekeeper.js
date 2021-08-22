var fplService = require('../processor/request/fpl-service');
const Database = require('@replit/database');

const MAX_BOT_USAGE = 10;

const db = new Database();
const fpl = new fplService();

async function cleanUp() {
  await cleanUpBotUsage();
  await cleanUpFixs();
  await cleanUpIpl();
}

async function cleanUpBotUsage() {
  var botUsages = await db.list('bot-access-');
  if (botUsages.length > MAX_BOT_USAGE) {
    var toDelete = botUsages.length - MAX_BOT_USAGE;
    for (var i = 0; toDelete > 0; i++) {
      if (botUsages.includes('bot-access-' + i)) {
        console.log('Deleting bot access bot-access- ' + i);
        await db.delete('bot-access-' + i);
        toDelete--;
      }
    }
  }
}

async function cleanUpFixs() {
  await fpl.init(1000);
  var fixs = fpl.getFixtures();
  var dbFixs = await db.list('fix-');
  for (var i in fixs) {
    var fix = fixs[i];
    if (fix.finished) {
      if (dbFixs.includes('fix-' + fix.id)) {
        console.log('Deleting fixture ' + fix.id);
        await db.delete('fix-' + fix.id);
        await db.delete('fix-suffix-' + fix.id);
        await db.delete('fix-suffix-update-' + fix.id);
      }
    }
  }
}

async function cleanUpIpl() {
  var iplData = await db.list('ipl-');
  for (var i in iplData) {
    var data = iplData[i];
    console.log('Deleting IPL ' + data);
    await db.delete(data);
  }
}

module.exports = { cleanUp }