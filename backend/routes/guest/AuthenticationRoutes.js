const { Router } = require('express');
const { ControllerFactory } = require('../../factories');
const { ErrorHelper } = require('../../utils/ErrorHelper/ErrorHelper')

const router = new Router();

router.post('/registration', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createUserController();
        return controller.registration(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createUserController();
        return controller.login(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
});

module.exports = { authenticationRouter: router };