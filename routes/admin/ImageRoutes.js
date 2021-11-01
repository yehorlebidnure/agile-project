const { Router } = require('express');
const { ControllerFactory } = require('../../factories');
const { ErrorHelper } = require('../../utils/ErrorHelper/ErrorHelper')

const router = new Router();

router.post('/:id/images/', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createImageController();
        return controller.save(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
});

module.exports = { imageRouter: router };