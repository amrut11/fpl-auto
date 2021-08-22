const runSql = require('./db-service').runSql;

async function getAllPlayers() {
  return await runSql('select * from player_prices order by player_id');
}

async function updateNewPrice(playerId, playerPrice) {
  var sql = `update player_prices set player_price = '${playerPrice}', last_change = current_timestamp where player_id = '${playerId}'`;
  await runSql(sql);
}

async function addNewPlayer(playerId, playerName, playerPrice) {
  var sql = `insert into player_prices values ('${playerId}', '${playerName}', '${playerPrice}', current_timestamp)`;
  await runSql(sql);
}

module.exports = { getAllPlayers, updateNewPrice, addNewPlayer }