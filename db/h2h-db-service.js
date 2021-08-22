const runSql = require('./db-service').runSql;

async function getAllConfig() {
  return await runSql('select * from alert_config order by process_order');
}

async function updateConfigChecked(process_order) {
  var sql = `update alert_config set last_checked = current_timestamp where process_order = '${process_order}'`;
  await runSql(sql);
}

async function updateConfigProcessed(process_order) {
  var sql = `update alert_config set last_processed = current_timestamp where process_order = '${process_order}'`;
  await runSql(sql);
}

async function getLastResponse(tournament, diffs, scores) {
  var sql = `select result from results where tournament = '${tournament}' and diffs = '${diffs}' and scores = '${scores}'`;
  var result = await runSql(sql);
  if (result && result.length > 0) {
    return result[0].result;
  }
  return null;
}

async function updateProcessTime(tournament, diffs, scores, response) {
  var sql = `update results set result = '${response}', process_time = current_timestamp where tournament = '${tournament}' and diffs = '${diffs}' and scores = '${scores}'`;
  var result = await runSql(sql);
  if (result === 0) {
    sql = `insert into results values ('${tournament}', '${diffs}', '${scores}', '${response}', current_timestamp)`;
    await runSql(sql);
  }
}

module.exports = { getAllConfig, updateConfigChecked, updateConfigProcessed, getLastResponse, updateProcessTime }