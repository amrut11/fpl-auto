const request = require('request');

const NAME_MAP = { 'KL Rahul': 'Lokesh Rahul', 'Shahbaz Ahmed': 'Shahbaz Ahamad', 'Dan Christian' : 'Daniel Christian', 'Mohammad Shami' : 'Mohammed Shami', 'Steve Smith': 'Steven Smith' };

const FIRST_PAGE_OFFSET = 23469;

class IplService {

  async init(matchNo) {
    var pageId = FIRST_PAGE_OFFSET + matchNo;
    this.iplPage = await this.downloadPage('https://cricketapi.platform.iplt20.com//fixtures/' + pageId + '/scoring');
    this.matchInfo = this.iplPage.matchInfo;
    this.prepareIdNameMap();
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

  prepareIdNameMap() {
    var teams = this.matchInfo.teams;
    this.playerIdMap = [];
    this.shortNameMap = [];
    for (var i in teams) {
      this.addPlayers(teams[i]);
    }
  }

  addPlayers(team) {
    var players = team.players;
    for (var i in players) {
      var fullName = players[i].fullName;
      var pName = NAME_MAP[fullName] ? NAME_MAP[fullName] : fullName;
      this.playerIdMap[players[i].id] = pName;
      this.shortNameMap[players[i].id] = players[i].shortName;
    }
  }

  getPlayerName(id) {
    return this.playerIdMap[id];
  }

  getPlayerShortName(id) {
    return this.shortNameMap[id];
  }

  getMatchInfo() {
    return this.matchInfo;
  }

  getCurrentState() {
    return this.iplPage.currentState;
  }

  getInnings() {
    return this.iplPage.innings;
  }

}

module.exports = IplService;