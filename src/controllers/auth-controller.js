const { validationResult } = require('express-validator');
const AuthService = require('../services/auth-service');
const ApiError = require('../exceptions/api-error');

class AuthController {
  async login(req, res) {
    res.send({ message: 'login' });
  }

  async register(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }

      const {
        firstName,
        lastName,
        email,
        password,
      } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return next(ApiError.BadRequest('Some fields are empty'));
      }

      const userData = await AuthService.register(firstName, lastName, email, password);

      res.send(userData);
    } catch (e) {
      next(ApiError.Internal(e));
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await AuthService.activate(activationLink);

      // return res.redirect(`${process.env.CLIENT_URL}`);

      res.send({ message: 'User successfully activated' });
    } catch (e) {
      next(ApiError.Internal(e));
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await AuthService.getAllUsers();

      res.send(users);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();