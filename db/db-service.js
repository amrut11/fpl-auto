const Pool = require('pg-pool');
const url = require('url')

const params = url.parse(process.env.pgurl);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true,
  max: 3,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 30000
};

const pool = new Pool(config);

async function runSql(sql) {
  try {
    var result = await pool.query(sql);
  } catch (err) {
    console.dir(err);
    console.dir(err.stack);
  }
  if (result) {
    return result.command === 'UPDATE' ? result.rowCount : result.rows;
  } else {
    throw new Error('Something went wrong during DB query ' + sql.replace(/\*/g, 'star').replace(/_/g, '-'));
  }
}

module.exports = { runSql }