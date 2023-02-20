const router = require('express').Router();
const { isAuth } = require('../middlewares/authentication');
const { validate } = require('express-validation');
const { register, verify, login } = require('../validations/users');

const USER_CONTROLLER = require('../controllers/users');

/**
 * User Routes
 */
router.post('/register', validate(register, { context: true }), USER_CONTROLLER.register);
router.post('/verify', validate(verify, { context: true }), USER_CONTROLLER.verify);
router.post('/login',  validate(login, { context: true }), USER_CONTROLLER.login);
router.post('/logout', isAuth(), USER_CONTROLLER.logout);

module.exports = router;