const { Router } = require('express');
const { imageRouter } = require('./ImageRoutes');
const { ControllerFactory } = require('../../factories');
const { ErrorHelper } = require('../../utils/ErrorHelper/ErrorHelper');

const router = new Router();

router.post('/', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createProductController();
        return controller.create(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createProductController();
        return controller.update(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createProductController();
        return controller.delete(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
});

router.use(imageRouter);

module.exports = { productRouter: router };