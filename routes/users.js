const router = require('express').Router();
const { celebrate } = require('celebrate');
const { userInfoSchemaValidation } = require('../middlewares/req-validation');
const { getCurrentUser, updateUser } = require('../controllers/users');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', celebrate(userInfoSchemaValidation), updateUser);

module.exports = router;
