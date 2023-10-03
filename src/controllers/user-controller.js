const UserService = require('../services/user-service');
const ApiError = require('../exceptions/api-error');

class UserController {
  async searchUsers(req, res, next) {
    try {
      const { searchQuery } = req.query;

      const users = await UserService.searchUsers(searchQuery);

      return res.json(users);
    } catch (e) {
      next(ApiError.Internal(e));
    }
  }
}

module.exports = new UserController();