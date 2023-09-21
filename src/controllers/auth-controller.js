const { validationResult } = require('express-validator');
const AuthService = require('../services/auth-service');
const ApiError = require('../exceptions/api-error');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await AuthService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });


      console.log(userData);
      return res.json(userData);
    } catch (e) {
      next(ApiError.Internal(e));
    }
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
        nickname,
        email,
        password,
      } = req.body;

      if (!firstName || !lastName || !email || !password || !nickname) {
        return next(ApiError.BadRequest('Some fields are empty'));
      }

      console.log(nickname);

      const userData = await AuthService.register(firstName, lastName, nickname, email, password);
      
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.json(userData);
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