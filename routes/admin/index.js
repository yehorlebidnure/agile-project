const { Router } = require('express');
const { cartRouter } = require('./CartRouter');
const { productRouter } = require('./ProductRoutes');
const { categoryRouter } = require('./CategoryRoutes');
const { Authorization } = require('../../middlewares/Authorization')

const router = new Router();

router.use('/carts', [Authorization.authorizeAdmin,], cartRouter);
router.use('/products', [Authorization.authorizeAdmin,], productRouter);
router.use('/categories', [Authorization.authorizeAdmin,], categoryRouter);

module.exports.adminRouter = router;