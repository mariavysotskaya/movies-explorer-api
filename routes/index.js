const router = require('express').Router();

router.use(require('./auth.routes'));

router.use(require('../middlewares/auth'));

router.use(require('./users'));
router.use(require('./movies'));

module.exports = router;
