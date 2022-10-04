const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

router.use(require('./auth.routes'));

router.use(require('../middlewares/auth'));

router.use(require('./users'));
router.use(require('./movies'));

router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
