const UserService = require('../services/user-service');
const ApiError = require('../exceptions/api-error');

class UserController {
  async searchUsers(req, res, next) {
    try {
      const { searchQuery, userId } = req.query;

      console.log(`searchQuery: ${searchQuery}, userId: ${userId}`)

      const users = await UserService.searchUsers(searchQuery, userId, next);

      return res.json(users);

    } catch (e) {
      next(e);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { userId } = req.query;

      console.log(`userId: ${userId}`);
  
      if (!userId) {
        return res.status(404).json({ message: 'User not found' }); // 404 for "User not found"
      }
  
      const user = await UserService.getUserById(userId, next);
  
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

      const user = await UserService.sendFriendRequest(userId, friendId, next);

      return res.send(user);
    } catch (e) {
      next(e);
    }
  }

  async checkFriendStatus(req, res, next) {
    try {
      const { userId, friendId } = req.query;

      console.log(`userId: ${userId}, friendId: ${friendId}`);

      const status = await UserService.checkFriendStatus(userId, friendId, next);

      return res.send(status);
    } catch (e) {
      next(e);
    }
  }

  async createChat(req, res, next) {
    try {
      const { userId, friendId } = req.body;

      const chat = await UserService.createChat(userId, friendId, next);

      return res.json(chat);
    } catch (e) {
      next(e);
    }
  }

  async getChatById(req, res, next) {
    try {
      const { chatId } = req.query;

      const chat = await UserService.getChatById(chatId);

      return res.json(chat);
    } catch (e) {
      next(e);
    }
  }

  async getChatsInfoList(req, res, next) {
    try {
      const { chatIds } = req.query;

      const chats = await UserService.getChatsInfoList(chatIds);

      return res.json(chats);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();