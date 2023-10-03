const { validationResult } = require('express-validator');
const AuthService = require('../services/auth-service');
const ApiError = require('../exceptions/api-error');

const {
  CLIENT_URL
} = require('../config');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await AuthService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true });

      // res.setHeader('Set-Cookie', `refreshToken=${userData.refreshToken}; Max-Age=2592000; Path=/; HttpOnly; SameSite=None;`);

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
        return next(ApiError.BadRequest(`Some fields are empty ${firstName} ${lastName} ${email} ${password} ${nickname}}`));
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

      return res.redirect(`${CLIENT_URL}`);
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

  async sendActivationLink(req, res, next) {
    try {
      const { email } = req.body;

      await AuthService.sendActivationLink(email);

      return res.json('Activation link has been sent to your email');
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      console.log(`refreshToken`, refreshToken)

      const userData = await AuthService.refresh(refreshToken);

      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();