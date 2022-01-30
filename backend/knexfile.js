const path = require('path');
const { Config } = require('./utils/Config');

// setup configuration
const config = new Config();
config.load();

module.exports = {
  client: 'pg',
  connection: {
    user: config.db.username,
    password: config.db.password,
    database: config.db.database,
    host: config.db.host,
    port: config.db.port,
  },
  migrations: {
    directory: path.join(__dirname, 'db', 'migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'db', 'seeds')
  }
}
