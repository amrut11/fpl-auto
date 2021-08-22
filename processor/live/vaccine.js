const Database = require('@replit/database');
const vaccineService = require('../request/vaccine-service');

const dateUtils = require('../../utils/date-utils');

const db = new Database();
const vaccine = new vaccineService();

const DISTRICTS = [294, 265];

async function check() {
  var msg = ':::';
  var today = dateUtils.getVaccineFormat();
  for (var i in DISTRICTS) {
    msg += await processDistrict(DISTRICTS[i], today);
    msg += ':::';
  }
  return msg;
}

async function processDistrict(district, date) {
  await vaccine.init(district, date);
  var centres = vaccine.getCentres();
  var msg = '';
  for (var i in centres) {
    msg += createCentreMsg(centres[i]);
    msg += '\n---------------------';
    if (i == 15) {
      break;
    }
  }
  return msg;
}

function createCentreMsg(centre) {
  var msg = '';
  msg += '\n' + '*Centre:* ' + centre.name;
  msg += '\n' + '*Pincode:* ' + centre.pincode;
  msg += '\n' + '*Fee:* ' + centre.fee;
  msg += '\n' + '*Slot Vaccine Capacity:*';
  for (var i in centre.sessions) {
    var session = centre.sessions[i];
    msg += '\n' + session.date + '\t' + session.vaccine + '\t' + session.capacity;
  }
  return msg;
}

module.exports = { check }