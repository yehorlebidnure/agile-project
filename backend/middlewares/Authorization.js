const { ControllerFactory } = require('../factories');
const { ServerError } = require('../utils/ErrorHelper/customErrors/ServerError');
const { ErrorHelper } = require('../utils/ErrorHelper/ErrorHelper');

class Authorization {

    static async authorize(req, res, next) {
        try {
            if (req.method === 'OPTIONS') {
                return next();
            }
            const controller = await ControllerFactory.createUserController();
            return controller.authorize(req, res, next);
        } catch (error) {
            const serverError = new ServerError(error);
            const errorHelper = new ErrorHelper(serverError);
            return errorHelper.processResponse(res);
        }
    }

    static async authorizeUser(req, res, next) {
        try {
            if (req.method === 'OPTIONS') {
                return next();
            }
            const controller = await ControllerFactory.createUserController();
            return controller.authorizeUser(req, res, next)
        } catch (error) {
            const serverError = new ServerError(error);
            const errorHelper = new ErrorHelper(serverError);
            return errorHelper.processResponse(res);
        }
    }

    static async authorizeAdmin(req, res, next) {
        try {
            if (req.method === 'OPTIONS') {
                return next();
            }
            const controller = await ControllerFactory.createUserController();
            return controller.authorizeAdmin(req, res, next)
        } catch (error) {
            console.log(error);
            const serverError = new ServerError(error);
            const errorHelper = new ErrorHelper(serverError);
            return errorHelper.processResponse(res);
        }
    }
}

module.exports = { Authorization };
