const { Pool } = require('pg');
const { ServerError } = require('../utils/ErrorHelper/customErrors/ServerError');

class Connection {

    static pool = null;
    // reconnection interval properties
    static reconnectionIntervalTime = 2 * 1000;
    static reconnectionTimeoutTime = 15 * 1000;
    static reconnectionIntervalSubscription = null;
    // reconnection data properties
    static reconnecting = false;
    static reconnectingPromise = null;

    /**
     * Connection constructor
     * @constructor
     */
    constructor() {
        this.reconnectionTimeoutSubscription = null;
        this._hasError = false;
        this.connection = null;
    }

    /**
     * initialize pool
     * @param {object}  config - connection config
     */
    static initializePool(config) {
        Connection.pool = new Pool({
            ...config,
            max: 10
        });
        Connection.pool.on('error', Connection._handleStaticError);
    }

    /**
     * handle client reconnection
     * @return {Promise<boolean>}
     */
    static _handleClientReconnect() {
        if (!Connection.reconnecting) {
            Connection.startReconnecting();
        }
        return Connection.reconnectingPromise;
    }

    static _handleStaticError(error) {
        console.error(error);
    }

    /**
     * start reconnecting process
     */
    static startReconnecting() {
        Connection.reconnecting = true;
        Connection.reconnectingPromise = new Promise((resolve, reject) => {
            Connection.initializeReconnectionInterval(() => {
                Connection.pool.connect((error, connection) => {
                    if (!error) {
                        Connection.reconnecting = false;
                        Connection.refuseReconnectionInterval();
                        return resolve(true);
                    } else {
                        console.error(error);
                    }
                });
            });
        });
    }

    /**
     * initialize reconnection interval
     * @param   {Function}  callback  callback
     */
    static initializeReconnectionInterval(callback) {
        Connection.reconnectionIntervalSubscription = setInterval(
            callback, Connection.reconnectionIntervalTime
        );
    }

    /**
     * refuse reconnection interval
     */
    static refuseReconnectionInterval() {
        clearInterval(Connection.reconnectionIntervalSubscription);
        Connection.reconnectionIntervalSubscription = null;
    }

    /**
     * handle static error - if error is not emited in client
     * @param   {Error}  error - pg error
     */
    static _handleStaticReconnect(error) {
        console.log('static reconnect');
        console.error(error);
    }

    /**
     * setter for hasError
     * @param   {boolean}  v  value
     */
    set hasError(v) {
        if (!v && this.connection && typeof this.connection.refuse === 'function') {
            this.connection.refuse();
        }
        this._hasError = v;
    }

    /**
     * getter for hasError
     * @return  {boolean}
     */
    get hasError() {
        return this._hasError;
    }

    /**
     * query to database
     * @param   {string}  sql sql
     * @param   {any[]}  values  values
     * @return  {Promise<any[]>}
     */
    query(sql, values) {
        return new Promise((resolve, reject) => {
            if (this.hasError) return reject(new Error('Connection error'));

            this.connection.query(sql, values)
                .then(res => resolve(res))
                .catch(error => this._handleClientReconnect(
                    error,
                    () => resolve(this.connection.query(sql, values)),
                    reject
                ));
        });
    }

    /**
     * connect to database
     * @return  {Promise<Connection>}
     */
    connect() {
        return new Promise((resolve, reject) => {
            Connection.pool.connect((error, connection) => {
                // handle reconnect if failed to connect to db
                if (error) {
                    return this._handleClientReconnect(error, resolve, reject);
                }
                // handle reconnect if error event emit
                connection.on('error', error => {
                    // this._handleClientReconnect(error);
                    this.hasError = true;
                    console.log('Error event emited');
                });
                connection.on('end', () => {
                    connection.removeAllListeners();
                });
                // if connection is success
                this.connection = connection;
                resolve(this);
            });
        });
    }

    /**
     * refuse connection
     */
    refuse() {
        this.connection.release();
    }

    /**
     * handle client reconnection
     * @param   {Error}  error    pg error
     * @param   {Function}  resolve  resolve
     * @param   {Function}  reject   reject
     */
    _handleClientReconnect(error, resolve = null, reject = null) {
        if (!this._shouldReconnect(error)) return;

        // initialize reconnection timer if it takes too long to reconnect to database
        this.initializeReconnectionTimeoutTimer(() => {
            this.onFailedToReconnectClient(reject);
        });

        // initialize reconnection process
        return Connection._handleClientReconnect()
            .then(() => this.onSuccessReconnectClient(resolve))
            .catch(() => this.onFailedToReconnectClient(reject));
    }

    /**
     * on success reconnect client
     * @param   {Function}  resolve  resolve
     * @return  {Promise<Connection>}
     */
    onSuccessReconnectClient(resolve) {
        return this.connect().then(() => {
            this.hasError = false;
            return resolve ? resolve(this) : this;
        });
    }

    /**
     * emit reconnection error
     * @param   {Function}  reject  reject
     */
    onFailedToReconnectClient(reject) {
        this.hasError = true;
        if (reject) reject(new ServerError('Database error'));
    }

    /**
     * define by error if client should reconnect
     * @param   {Error}  error  pg error
     * @return  {boolean}
     */
    _shouldReconnect(error) {
        if (this.reconnectionTimeoutSubscription) {
            // if connection instance already has reconnection subscription
            return false;
        }
        else if (error.errno === 'ECONNREFUSED' || error.errno === 'ECONNREFUSED') {
            // if failed to connect to database while creating client (pool)
            return true;
        }
        else if (error.code === '57P01' || error.severity === 'FATAL') {
            // if error event is emited (connection)
            return true;
        }
    }

    /**
     * initialie reconnection timeout timer
     * @param   {Function}  callback  callback
     */
    initializeReconnectionTimeoutTimer(callback) {
        this.reconnectionTimeoutSubscription = setTimeout(
            callback, Connection.reconnectionTimeoutTime
        );
    }

    /**
     * refuse reconnection timeout timer
     */
    refuseReconnectionTimeoutTimer() {
        clearTimeout(this.reconnectionTimeoutSubscription);
        this.reconnectionTimeoutSubscription = null;
    }
}

module.exports = { Connection };
