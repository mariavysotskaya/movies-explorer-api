const router = require('express').Router();
const { celebrate } = require('celebrate');
const { userFullInfoSchemaValidation, userCredentialsSchemaValidation } = require('../middlewares/req-validation');
const { createUser, login } = require('../controllers/users');

router.post('/signup', celebrate(userFullInfoSchemaValidation), createUser);
router.post('/signin', celebrate(userCredentialsSchemaValidation), login);

module.exports = router;
