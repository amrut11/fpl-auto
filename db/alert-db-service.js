const Database = require('@replit/database');
const dateUtils = require('../utils/date-utils');

const db = new Database();

async function getAlerts() {
  var alerts = await db.get('alert-config');
  return alerts == null ? [] : alerts;
}

async function updateAlert(processOrder, field) {
  var alerts = await getAlerts();
  for (var i in alerts) {
    var alert = alerts[i];
    if (alert['process-order'] == processOrder) {
      alert[field] = (new Date().getTime());
      break;
    }
  }
  await db.set('alert-config', alerts);
}

async function getAlertResponse(tournament, diffType, scoreType) {
  var results = await db.get('alert-results');
  for (var i in results) {
    var result = results[i];
    if (result['tournament'] == tournament && result['diff-type'] == diffType && result['score-type'] == scoreType) {
      return result.response;
    }
  }
}

async function updateAlertResponse(tournament, diffType, scoreType, response) {
  var results = await db.get('alert-results');
  if (results == null) {
    results = [];
  }
  var currTimestamp = (new Date()).getTime();
  var found = false;
  for (var i in results) {
    var result = results[i];
    if (result['tournament'] == tournament && result['diff-type'] == diffType && result['score-type'] == scoreType) {
      result.response = response;
      result['process-time'] = currTimestamp;
      found = true;
      break;
    }
  }
  if (!found) {
    var result = { tournament: tournament, 'diff-type': diffType, 'score-type': scoreType, 'response': response, 'process-time': currTimestamp };
    results.push(result);
  }
  await db.set('alert-results', results);
}

async function addAlert(command, frequency, processOrder, isLive) {
  var alerts = await getAlerts();
  var alert = { command: command, frequency: frequency, 'last-checked': null, 'last-processed': null, 'process-order': processOrder, 'is-live': isLive };
  alerts.push(alert);
  await db.set('alert-config', alerts);
}

module.exports = { getAlerts, updateAlert, getAlertResponse, updateAlertResponse, addAlert }