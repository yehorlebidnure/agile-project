const { Router } = require('express');
const { cartRouter } = require('./CartRoutes');
const { Authorization } = require('../../middlewares/Authorization');

const router = new Router();

router.use('/carts', [Authorization.authorizeUser,], cartRouter);

module.exports = { customerRouter: router };