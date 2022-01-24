const { Connection } = require('../core/Connection');

class Dao {

    /**
     * DatabaseClient constructor
     * @param   {Connection}  client  client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * setter for client
     * @param   {Connection}  client  client
     */
    set client(client) {
        this._client = client;
    }

    /**
     * getter for client
     * @return  {Connection}
     */
    get client() {
        return this._client;
    }
}

module.exports = { Dao };
