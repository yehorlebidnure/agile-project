const path = require('path');
const { Router } = require('express');

const { adminRouter } = require('./admin');
const { guestRouter } = require('./guest');
const { customerRouter } = require('./customer');
const { Authorization } = require('../middlewares/Authorization');

const router = new Router();

router.use(Authorization.authorize);
router.use('/api', guestRouter);
router.use('/api', customerRouter);
router.use('/api/admin', adminRouter);

// router.get('*', (req, res) => {
//     const rootPath = path.parse(__dirname).dir;
//     const clientHtmlPath = path.resolve(rootPath, 'client', 'dist', 'client', 'index.html');
//     return res.sendFile(clientHtmlPath);
// });

router.use('*', (req, res) => {
    res.status(404).json({ error: 'Page Not Found' })
});

module.exports = { router };