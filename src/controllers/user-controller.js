const UserService = require('../services/user-service');
const ApiError = require('../exceptions/api-error');

class UserController {
  async searchUsers(req, res, next) {
    try {
      const { searchQuery } = req.query;

      const users = await UserService.searchUsers(searchQuery);

      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(404).json({ message: 'User not found' }); // 404 for "User not found"
      }
  
      const user = await UserService.getUserById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' }); // 404 for "User not found"
      }

      console.log(`user: ${user}`);
  
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async sendFriendRequest(req, res, next) {
    try {
      const { userId, friendId } = req.body;

      const user = await UserService.sendFriendRequest(userId, friendId);

      return res.send(user);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();