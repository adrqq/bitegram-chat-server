const router = require('express').Router();
const AuthController = require('../controllers/auth-controller');
const { body, cookie, param } = require('express-validator');

router.get('/users', AuthController.getAllUsers);

router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 32 }),
  AuthController.login
);
router.post(
  '/register',
  body('firstName').isString(),
  body('lastName').isString(),
  body('nickname').isString().isLength({ min: 4, max: 14 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 32 }),
  AuthController.register
);
router.post(
  '/logout',
  cookie('refreshToken').isString().isLength({ min: 1 }),
  AuthController.logout
);

router.get(
  '/activate/:link', 
  param('link').isString(),
  AuthController.activate
);
router.post('/send-activation-link', AuthController.sendActivationLink);
router.get(
  '/refresh',
  cookie('refreshToken').isString(),
  AuthController.refresh
);

module.exports = { router };
