const request = require('request');

class VaccineService {

  async init(district, date) {
    // var url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=' + district + '&date=' + date;
    var url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=' + district + '&date=' + date;
    this.vaccinePage = await this.downloadPage(url);
    this.prepareCentres();
  }

  downloadPage(url) {
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (error) {
          reject(error);
        }
        try {
          if (response.statusCode != 200) {
            reject('Invalid status code <' + response.statusCode + '>' + '\turl: ' + url);
            return;
          }
          resolve(JSON.parse(body));
        } catch (err) {
          console.error(err);
          console.dir(err.stack);
          reject('Something went wrong. Response: ' + response + ' while accessing: ' + url);
        }
      });
    });
  }

  prepareCentres() {
    this.centres = [];
    var allCentres = this.vaccinePage.centers;
    for( var i in allCentres) {
      var centre = allCentres[i];
      var validSessions = this.getValidSessions(centre.sessions);
      if (validSessions.length > 0) {
        var validCentre = { name: centre.name, pincode: centre.pincode, fee: centre.fee_type, sessions: validSessions };
        this.centres.push(validCentre);
      }
    }
  }

  getValidSessions(sessions) {
    var validSessions = [];
    sessions.forEach(function (session) {
      if (session.min_age_limit == 18 && session.available_capacity > 0) {
        var validSession = { date: session.date, vaccine: session.vaccine == '' ? 'NA' : session.vaccine, capacity: session.available_capacity };
        validSessions.push(validSession);
      }
    });
    return validSessions;
  }

  getCentres() {
    return this.centres;
  }

}

module.exports = VaccineService;