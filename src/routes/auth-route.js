const router = require('express').Router();
const AuthController = require('../controllers/auth-controller');

router.get('/users', AuthController.getAllUsers)
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/activate/:link', AuthController.activate);
router.post('/send-activation-link', AuthController.sendActivationLink);
router.get('/refresh', AuthController.refresh);

module.exports = { router };
