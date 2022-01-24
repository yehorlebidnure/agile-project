const dotenv = require('dotenv');

class Config {

    /**
     * Config constructor
     */
    constructor() {
        this.db = {
            username: null,
            database: null,
            password: null,
            host: null,
            port: null,
        };
        this.app = {
            port: null,
            host: null,
        };
    }

    /**
     * load .env variables
     */
    load() {
        dotenv.config();

        // Database env variables
        this.db.username = process.env['POSTGRES_USERNAME'];
        this.db.database = process.env['POSTGRES_DATABASE'];
        this.db.password = process.env['POSTGRES_PASSWORD'];
        this.db.host = process.env['POSTGRES_HOST'];
        this.db.port = process.env['POSTGRES_PORT'];

        // App env variables
        this.app.port = process.env['PORT'];
        this.app.host = process.env['HOST'];
    }
}

module.exports = { Config }