const { Router } = require('express');
const { ControllerFactory } = require('../../factories');
const { ErrorHelper } = require('../../utils/ErrorHelper/ErrorHelper')

const router = new Router();

router.post('/', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createCategoryController();
        return controller.create(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createCategoryController();
        return controller.update(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createCategoryController();
        return controller.delete(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
});

module.exports = { categoryRouter: router };