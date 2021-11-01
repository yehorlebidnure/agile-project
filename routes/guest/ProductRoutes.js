const { Router } = require('express');
const { ControllerFactory } = require('../../factories');
const { ErrorHelper } = require('../../utils/ErrorHelper/ErrorHelper')

const router = new Router();

router.get('/', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createProductController();
        return controller.getAll(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createProductController();
        return controller.getById(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
});

module.exports = { productRouter: router };