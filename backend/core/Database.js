const { Client } = require('pg');
const { ServerError } = require('../utils/ErrorHelper/customErrors');
const { Connection } = require('./Connection');

class Database {
    static _instance = null;

    /**
     * setter for database instance
     * @param   {Database}  v  database instance
     */
    static set instance(v) {
        Database._instance = v;
    }

    /**
     * getter for databse instance
     * @return  {Database}
     */
    static get instance() {
        return Database._instance;
    }

    /**
     * Database constructor
     * @param   {{
     *     username: string,
     *     database: string,
     *     password: string,
     *     host: string,
     *     port: number,
     * }}  config  Database configuration
     */
    constructor(config) {
        if (Database.instance) {
            return Database.instance;
        }

        Database.instance = this;
        this.config = {
            user: config.username,
            password: config.password,
            database: config.database,
            host: config.host,
            port: config.port,
        };
        Connection.initializePool(this.config);
    }

    /**
     * create connection to db and return client
     * @return  {Client}
     */
    async createClient() {
        try {
            const connection = new Connection();
            return await connection.connect();
        }
        catch (error) {
            console.log('DATABASE CONNECTION ERROR -----------');
            console.error(error);
            throw new ServerError('Failed to connect to database.');
        }
    }
}

module.exports = { Database };
