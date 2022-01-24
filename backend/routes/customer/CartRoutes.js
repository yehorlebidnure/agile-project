const {Router} = require('express');
const {ControllerFactory} = require('../../factories');
const {ErrorHelper} = require('../../utils/ErrorHelper/ErrorHelper');
const {ServerError} = require('../../utils/ErrorHelper/customErrors/ServerError')

const router = new Router();

router.get('/:userId', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createCartController();
        return controller.getByUserId(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
})

router.put('/:userId', async (req, res, next) => {
    try {
        const controller = await ControllerFactory.createCartController();
        return controller.update(req, res, next);
    } catch (error) {
        const serverError = new ServerError(error);
        const errorHelper = new ErrorHelper(serverError);
        return errorHelper.processResponse(res);
    }
});

module.exports = {cartRouter: router};
