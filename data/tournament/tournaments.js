const interfaces = require('../interfaces');

const ffcSheetId = process.env.FFC_SHEET_ID;
const ffcDifferential = require('./ffc/ffcdifferential');
const ffcCalculator = require('./ffc/ffccalculator');

const ffcUclSheetId = process.env.FFC_UCL_SHEET_ID;
const ffcCupsDifferential = require('./ffc-cups/ffcCupsDifferential');
const ffcCupsCalculator = require('./ffc-cups/ffcCupsCalculator');

const hustleSheetId = process.env.HUSTLE_SHEET_ID;
const hustleDifferential = require('./hustle/hustledifferential');
const hustleCalculator = require('./hustle/hustlecalculator');

const havenSheetId = process.env.HAVEN_SHEET_ID;
const havenDifferential = require('./haven/havendifferential');
const havenCalculator = require('./haven/havencalculator');

const ffflSheetId = process.env.FFFL_SHEET_ID;
const ffflDifferential = require('./fffl/fffldifferential');
const ffflCalculator = require('./fffl/ffflcalculator');

const opponentSheetId = '1TKrYugIgPQViKZV10Gu25yWHdoBfgGv7bSU9qGLFRTM';

const ffcTournament = new interfaces.Tournament('FFC', ffcSheetId, ffcDifferential, ffcCalculator);
const ffc2Tournament = new interfaces.Tournament('FFC2', ffcSheetId, ffcDifferential, ffcCalculator);
const ffcCupsTournament = new interfaces.Tournament('FFC-Cups', ffcUclSheetId, ffcCupsDifferential, ffcCupsCalculator);
const hustleTournament = new interfaces.Tournament('Hustle', hustleSheetId, hustleDifferential, hustleCalculator);
const havenTournament = new interfaces.Tournament('Haven', havenSheetId, havenDifferential, havenCalculator);
const ffflTournament = new interfaces.Tournament('FFFL', ffflSheetId, ffflDifferential, ffflCalculator);
const opponent = new interfaces.Tournament('Opponent', opponentSheetId, null, null);

module.exports = {
  ffcTournament, ffc2Tournament, ffcCupsTournament, hustleTournament, havenTournament, ffflTournament, opponent
}