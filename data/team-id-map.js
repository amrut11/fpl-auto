const ffcPlayers = require('./tournament/ffc/players').allPlayers;
const ffc2Players = require('./tournament/ffc2/players').allPlayers;
const havenPlayers = require('./tournament/haven/players').allPlayers;
const hustlePlayers = require('./tournament/hustle/players').allPlayers;
const ffflPlayers = require('./tournament/fffl/players').allPlayers;

const teamIdMap = {};
teamIdMap[618364163] = 4807; // Amrut
teamIdMap[1307886326] = 1518; // Tanveer

const tgMap = {};
tgMap[618364163] = 'Amrut';
tgMap[708190309] = 'James';
tgMap[841943912] = 'Malay';
tgMap[1190192624] = 'Piyush';
tgMap[1188026664] = 'Lovesh';
tgMap[1307886326] = 'Tanveer';
tgMap[1096370881] = 'Rishabh';
tgMap[676680881] = 'Tasu';
tgMap[1385709957] = 'Vineet';
tgMap[1733016171] = 'Brynal'
tgMap[-413814520] = 'TG OC';
tgMap[-456947877] = 'Noms Group';

const misc = { 'gcl': 15550, 'cup': 7641957, 'hmt': 976543 };

const allPlayers = Object.assign({}, havenPlayers, hustlePlayers, ffcPlayers, ffc2Players, ffflPlayers, misc);

function getTeamId(chatId) {
  return teamIdMap[chatId] ? teamIdMap[chatId] : 333;
}

function getTgUser(id) {
  return tgMap[id] ? tgMap[id] : id;
}

function getTeamIdByName(name) {
  for (var i in allPlayers) {
    if (i.toUpperCase() === name.toUpperCase()) {
      return allPlayers[i];
    }
  }
  return name;
}

function findDups() {
  var ids = new Object();
  var dups = new Object();
  for (var i in ffcPlayers) {
    if (ids[i] && ids[i] != ffcPlayers[i]) {
      if (dups[i]) {
        dups[i] += '(F),' + ffcPlayers[i];
      } else {
        dups[i] = ids[i] + '(F),' + ffcPlayers[i];
      }
    } else {
      ids[i] = ffcPlayers[i];
    }
  }
  for (var i in havenPlayers) {
    if (ids[i] && ids[i] != havenPlayers[i]) {
      if (dups[i]) {
        dups[i] += '(H),' + havenPlayers[i];
      } else {
        dups[i] = ids[i] + '(H),' + havenPlayers[i];
      }
    } else {
      ids[i] = havenPlayers[i];
    }
  }
  for (var i in hustlePlayers) {
    if (ids[i] && ids[i] != hustlePlayers[i]) {
      if (dups[i]) {
        dups[i] += '(U),' + hustlePlayers[i];
      } else {
        dups[i] = ids[i] + '(U),' + hustlePlayers[i];
      }
    } else {
      ids[i] = hustlePlayers[i];
    }
  }
  for (var i in dups) {
    console.log(i + ' ' + dups[i] + ' ' + allPlayers[i]);
  }
}

module.exports = { getTeamId, getTgUser, getTeamIdByName, findDups }