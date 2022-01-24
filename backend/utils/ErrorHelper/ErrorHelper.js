const { AppError } = require('./customErrors');

class ErrorHelper {

    /**
     * ErrorHelper constructor
     * @param   {AppError}  error  error
     */
    constructor(error) {
        this._error = error;
        console.log('[TIME:]', new Date().toLocaleString(), error);
    }

    /**
     * getter for error
     * @return  {AppError}
     */
    get error() {
        return this._error;
    }

    /**
     * process response
     * @param   {Response}  response  response
     * @return  {Response}
     */
    processResponse(response) {
        try {
            return response
                .status(this.error.status || this.error._status || 500)
                .json({ errors: this.error.errors || this.error._errors || ['Internal Server Error'] });
        } catch (error) {
            return response
                .status(500)
                .json({ errors: ['Internal Server Error'] });
        }
    }
}

module.exports = { ErrorHelper };