const request = require('request');

const sameLastName = ['Baptiste', 'Barnes', 'Bernardo', 'Chalobah', 'Cresswell', 'Davies', 'Diallo', 'Ferguson', 'Fernández', 'Gordon', 'Gray', 'Greenwood', 'Hayden', 'Henderson', 'Hernández', 'James', 'Jones', 'Lewis', 'Long', 'Mendy', 'Nelson', 'Pereira', 'Phillips', 'Ramsey', 'Roberts', 'Rodrigo', 'Sarr', 'Stephens', 'Sánchez', 'Sørensen', 'Thomas', 'Traoré', 'Ward', 'White'];

const simpleNameMap = {
  'Fernandes': 'Bruno',
  'Alexander-Arnold': 'Taa',
  'Calvert-Lewin': 'Dcl',
  'Walker-Peters': 'Kwp',
  'R Barbosa Pereira': 'Barbosa',
  'De Bruyne': 'Kdb',
  'B Veiga de Carvalho e Silva': 'Bilva',
  'Saint-Maximin': 'Asm'
};

const sameName = {
  248: 'Davies LIV',
  364: 'Davies TOT'
}

class FplService {

  async init(matchGw) {
    this.bootstrap = await this.downloadPage('https://fantasy.premierleague.com/api/bootstrap-static/');
    var currEvent = this.getCurrentEvent();
    var gw = matchGw > currEvent ? currEvent : matchGw;
    this.liveInfo = await this.downloadPage('https://fantasy.premierleague.com/api/event/' + gw + '/live/');
    this.liveInfo.fixtures = await this.downloadPage('https://fantasy.premierleague.com/api/fixtures/');
    this.prepareIdNameMap();
    this.prepareTeamNames();
    this.prepareTeamFixs();
    this.preparePositions();
    this.preparePlayerTypes();
    return currEvent;
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

  getCurrentEvent() {
    var data = this.bootstrap.events;
    for (var i = 0; i < data.length; i++) {
      var event = data[i];
      if (event.is_current == true) {
        return event.id;
      }
    }
    return 1;
  }

  prepareIdNameMap() {
    var elements = this.getElements();
    this.playerIdNameMap = [];
    for (var i in elements) {
      var element = elements[i];
      var webName = element.web_name;
      var pName = sameLastName.includes(webName) ? element.first_name.charAt(0) + ' ' + element.second_name : webName;
      if (simpleNameMap[pName]) {
        pName = simpleNameMap[pName];
      }
      if (sameName[element.id]) {
        pName = sameName[element.id];
      }
      pName = pName.replace(/'/g, '');
      this.playerIdNameMap[element.id] = pName;
    }
  }

  prepareTeamNames() {
    this.teamNames = new Object();
    var teams = this.bootstrap.teams;
    for (var i in teams) {
      this.teamNames[teams[i].id] = teams[i].short_name;
    }
  }

  prepareTeamFixs() {
    var finishedFixs = this.getFinishedFixs();
    var gw = this.getCurrentEvent();
    if (!this.isGwOngoing()) {
      gw++;
    }
    this.teamFixs = new Object();
    var fixtures = this.liveInfo.fixtures;
    for (var i in fixtures) {
      var fixture = fixtures[i];
      if (fixture.event === gw && !finishedFixs[fixture.id]) {
        var homeTeam = this.getTeamName(fixture.team_h);
        var awayTeam = this.getTeamName(fixture.team_a);
        if (this.teamFixs[homeTeam]) {
          this.teamFixs[homeTeam] += ', ' + awayTeam.toUpperCase();
        } else {
          this.teamFixs[homeTeam] = awayTeam.toUpperCase();
        }
        if (this.teamFixs[awayTeam]) {
          this.teamFixs[awayTeam] += ', ' + homeTeam.toLowerCase();
        } else {
          this.teamFixs[awayTeam] = homeTeam.toLowerCase();
        }
      }
    }
  }

  preparePositions() {
    this.positions = new Object();
    var elementTypes = this.bootstrap.element_types;
    for (var i in elementTypes) {
      this.positions[elementTypes[i].id] = elementTypes[i].singular_name_short;
    }
  }

  preparePlayerTypes() {
    this.playerTypes = new Object();
    var elements = this.bootstrap.elements;
    for (var i in elements) {
      this.playerTypes[elements[i].id] = elements[i].element_type;
    }
  }

  isAnyLiveMatch() {
    var fixtures = this.liveInfo.fixtures;
    for (var i in fixtures) {
      var fixture = fixtures[i];
      if (fixture.event == this.getCurrentEvent()) {
        if (fixture.started && !fixture.finished) {
          return true;
        }
      }
    }
    return false;
  }

  isGwOngoing() {
    var fixtures = this.liveInfo.fixtures;
    for (var i in fixtures) {
      var fixture = fixtures[i];
      if (fixture.event == this.getCurrentEvent()) {
        if (!fixture.finished) {
          return true;
        }
      }
    }
    return false;
  }

  getLatestCompletedMatchTime() {
    var fixtures = this.liveInfo.fixtures;
    var latestMatchTime = new Date();
    var length = fixtures.length;
    for (var i = length - 1; i > 0; i--) {
      var fixture = fixtures[i];
      if (fixture.finished) {
        latestMatchTime = fixture.kickoff_time;
        break;
      }
    }
    return new Date(Date.parse(latestMatchTime));
  }

  getNextMatchTime() {
    var fixtures = this.liveInfo.fixtures;
    var firstMatchTime = new Date();
    for (var i = 0; i < fixtures.length; i++) {
      var fixture = fixtures[i];
      if (!fixture.finished && fixture.kickoff_time != null) {
        firstMatchTime = fixture.kickoff_time;
        break;
      }
    }
    return new Date(Date.parse(firstMatchTime));
  }

  getPlayerPoints(elementId) {
    var elements = this.liveInfo.elements;
    for (var i in elements) {
      if (elements[i].id == elementId) {
        return elements[i].stats.total_points;
      }
    }
    return 0;
  }

  getRemainingFixsCount(gw) {
    var count = 0;
    var fixtures = this.liveInfo.fixtures;
    for (var i in fixtures) {
      var fixture = fixtures[i];
      if (fixture.event == gw && !fixture.finished) {
        count++
      }
    }
    return count;
  }

  getCurrentGw() {
    return this.currEvent;
  }

  getElements() {
    return this.bootstrap.elements;
  }

  getTeamName(teamId) {
    return this.teamNames[teamId];
  }

  getPlayerName(playerId) {
    return this.playerIdNameMap[playerId];
  }

  getPlayerPosition(positionId) {
    return this.positions[positionId];
  }

  getPlayerType(playerId) {
    return this.playerTypes[playerId];
  }

  getFixtures() {
    return this.liveInfo.fixtures;
  }

  getSameLastName() {
    return sameLastName;
  }

  getPlayerFixtures() {
    var map = new Object();
    var finished = this.getFinishedFixs();
    var elements = this.liveInfo.elements;
    for (var i in elements) {
      var element = elements[i];
      if (element) {
        var explain = element['explain'];
        map[element.id] = 0; // assume bgw
        var firstFixture = explain[0];
        var secondFixture = explain[1];
        var thirdFixture = explain[2];
        map[element.id] += firstFixture && !finished[firstFixture.fixture] ? 1 : 0;
        map[element.id] += secondFixture && !finished[secondFixture.fixture] ? 1 : 0; // dgw
        map[element.id] += thirdFixture && !finished[thirdFixture.fixture] ? 1 : 0; // tgwtf
        if (!this.getPlayerAvailability(element.id)) {
          map[element.id] = 0;
        }
      }
    }
    return map;
  }

  getPlayerAvailability(id) {
    var elements = this.getElements();
    for (var i in elements) {
      if (elements[i].id == id) {
        return this.isGwOngoing() ? elements[i].chance_of_playing_this_round != 0 : elements[i].chance_of_playing_next_round != 0;
      }
    }
  }

  getFinishedFixs() {
    var fixtures = this.liveInfo.fixtures;
    var map = new Object();
    for (var i in fixtures) {
      var fixture = fixtures[i];
      map[fixture.id] = fixture.finished_provisional;
    }
    return map;
  }

  getPlayerPendingFixs(playerId) {
    var elements = this.bootstrap.elements;
    for (var i in elements) {
      var element = elements[i];
      if (element.id == playerId) {
        var teamName = this.getTeamName(element.team);
        return this.teamFixs[teamName] ? this.teamFixs[teamName] : 'NA';
      }
    }
  }

}

module.exports = FplService;