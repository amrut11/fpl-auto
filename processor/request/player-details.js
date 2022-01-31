// const FuzzySearch = require('fuzzy-search');
const removeAccents = require('remove-accents');

async function getPlayerDetails(fpl, playerName) {
  await fpl.init(1000);
  var players = getPlayers(fpl, playerName.toLowerCase());
  return prepareMessage(fpl, players);
}

function getPlayers(fpl, playerName) {
  var elements = fpl.getElements();
  let players = [];
  for (var i in elements) {
    var element = elements[i];
    var webName = removeAccents.remove(element.web_name).toLowerCase();
    var firstName = removeAccents.remove(element.first_name).toLowerCase();
    var secondName = removeAccents.remove(element.second_name).toLowerCase();
    if (webName.includes(playerName) || firstName.includes(playerName) || secondName.includes(playerName)) {
      players.push(element);
    }
  }
  return players;
}

function prepareMessage(fpl, players) {
  var msg = '*Found ' + players.length + ' player(s) matching your search*';
  if (players.length > 20) {
    msg += '\n\n*Please refine your search to get player details.*';
    return msg;
  }
  if (players.length > 10) {
    for (var i in players) {
      var player = players[i];
      msg += '\n\n*Name: *' + player.web_name + ' (' + player.first_name + ' ' + player.second_name + ')';
    }
    msg += '\n\n*Please refine your search to get player details.*';
    return msg;
  }
  for (var i in players) {
    var player = players[i];
    msg += '\n\n*Name: *' + player.web_name + ' (' + player.first_name + ' ' + player.second_name + ')';
    msg += '\n*Position / Team: *' + (fpl.getPlayerPosition(player.element_type) + ' / ' + (fpl.getTeamName(player.team)));
    msg += '\n*Price: *' + (player.now_cost / 10) + 'M';
    msg += '\n*Ownership: *' + player.selected_by_percent + '%';
    msg += '\n*Recent / Total Points: *' + player.event_points + ' / ' + player.total_points;
    msg += '\n*Bonus: *' + player.bonus;
    msg += '\n*Minutes Played: *' + player.minutes;
    if (player.element_type == 1) {
      msg += '\n*Saves / Pen Saves: *' + player.saves + ' / ' + player.penalties_saved;
    } else {
      msg += '\n*Goals / Assists: *' + player.goals_scored + ' / ' + player.assists;
    }
    msg += '\n*Yellows / Reds: *' + player.yellow_cards + ' / ' + player.red_cards;
    var available = player.chance_of_playing_next_round;
    msg += '\n*Availability: *' + (available == null || available == 100 ? '💪' : available + ' (' + player.news + ')');
    var special = getSpecial(player);
    if (special != '') {
      msg += '\n*Special: *' + special;
    }
    var fixtures = getFixtures(fpl, player.team);
    msg += '\n*Fixtures: *' + fixtures;
  }
  return msg;
}

function getSpecial(player) {
  var special = '';
  if (player.penalties_order == 1) {
    special += 'On Penalties';
  }
  if (player.direct_freekicks_order == 1) {
    special += '\tOn Direct FKs';
  }
  if (player.corners_and_indirect_freekicks_order == 1) {
    special += '\tOn Indirect FKs';
  }
  return special;
}

function getFixtures(fpl, team) {
  var fixtures = fpl.getFixtures();
  var gw = fpl.getCurrentEvent();
  var output = '';
  var fixtureCount = 0;
  for (var i in fixtures) {
    var fixture = fixtures[i];
    if (fixture.event == gw + (gw == 1 ? 0 : 1) + fixtureCount) {
      if (fixture.team_a == team) {
        output += fpl.getTeamName(fixture.team_h) + '(A), ';
        fixtureCount++;
      } else if (fixture.team_h == team) {
        output += fpl.getTeamName(fixture.team_a) + '(H), ';
        fixtureCount++;
      }
    }
    if (fixtureCount == 5) {
      break;
    }
  }
  return output;
}

module.exports = { getPlayerDetails }