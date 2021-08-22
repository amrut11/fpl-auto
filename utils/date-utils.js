var dateFormat = require('dateformat');

const DATE_FORMAT = 'd mmm HH:MM';
const DATE_FORMAT_SECONDS = 'd mmm HH:MM:ss';
const DATE_FORMAT_MILIS = 'd mmm HH:MM:ss.sss';
const VACCINE_FORMAT = 'dd-mm-yyyy';
const IST_OFFSET = 5.5 * 3600 * 1000;

function getISTTime(inputTime) {
  return getISTFormattedTime(inputTime, DATE_FORMAT);
}

function getISTTimeSeconds(inputTime) {
  return getISTFormattedTime(inputTime, DATE_FORMAT_SECONDS);
}

function getISTTimeMilis(inputTime) {
  return getISTFormattedTime(inputTime, DATE_FORMAT_MILIS);
}

function getISTFormattedTime(inputTime, format) {
  var time = inputTime ? inputTime : new Date().getTime();
  var istTime = new Date(time + IST_OFFSET);
  return dateFormat(istTime, format);
}

function isToday(inputTime) {
  const today = new Date();
  var inputDate = new Date(inputTime);
  return inputDate.getDate() == today.getDate() &&
    inputDate.getMonth() == today.getMonth() &&
    inputDate.getFullYear() == today.getFullYear();
}

function getVaccineFormat(inputTime) {
  return getISTFormattedTime(inputTime, VACCINE_FORMAT);
}

module.exports = { getISTTime, getISTTimeSeconds, getISTTimeMilis, isToday, getVaccineFormat }