const natural = require('natural');
const sequelize = require('sequelize');
const db = require('../sequelize/models');
const UserModel = require('../sequelize/models/user')(db, sequelize.DataTypes);
const ApiError = require('../exceptions/api-error');

class UserService {
  async searchUsers(searchQuery, userId) {
    if (!searchQuery) {
      return [];
    }
    // Convert the search query to lowercase for case-insensitive search
    const searchQueryLower = searchQuery.toLowerCase();

    // const searchResults = await UserModel.findAll({
    //   attributes: ['nickname', 'id'],
    //   limit: 12,


    // })

    const searchResults = await UserModel.findAll({
      attributes: ['nickname', 'id'],
      where: {
        id: {
          [sequelize.Op.ne]: userId // Exclude the user with the provided userId
        },
      },
      limit: 12,
    });
  

    // Filter and save users with a 50% or higher match based on Levenshtein distance
    const filteredUsers = searchResults.filter((user) => {
      const nicknameLower = user.nickname.toLowerCase();
      const distance = natural.LevenshteinDistance(searchQueryLower, nicknameLower);

      // Define a threshold for considering a match (adjust as needed)
      const threshold = Math.max(searchQueryLower.length, nicknameLower.length) * 0.3;

      return distance <= threshold;
    });

    return filteredUsers;
  }

  async getUserById(userId) {
    if (!userId) {
      // If userId is falsy, send an error response and return from the function
      return ApiError.BadRequest('User not found');
    }

    const user = await UserModel.findOne({
      where: {
        id: userId,
      },
      attributes: ['id', 'firstName', 'lastName', 'nickname', 'email'],
    });

    if (!user) {
      // If user is falsy, send an error response and return from the function
      return ApiError.BadRequest('User not found');
    }

    return user;
  }
  
  async sendFriendRequest(userId, friendId) {
    async function findUserById(id) {
      return await UserModel.findOne({
        where: { id },
      });
    }

      if (!userId) {
        if (!userId) {
          throw ApiError.BadRequest(`Invalid userId of ${userId}`);
        }
        
        if (!friendId) {
          throw ApiError.BadRequest(`Invalid friendId of ${friendId}`);
        }
      }
  
      const [user, foundFriend] = await Promise.all([
        findUserById(userId),
        findUserById(friendId),
      ]);
  
      if (!user || !foundFriend) {
        throw ApiError.BadRequest('User not found');
      }
  
      if (user.friends && user.friends.includes(friendId)) {
        throw ApiError.BadRequest(`You are already friends with ${foundFriend.nickname}`);
      }
  
      if (foundFriend.incomingFriendRequests && foundFriend.incomingFriendRequests.includes(userId)) {
        throw ApiError.BadRequest(`You have already sent a friend request to ${foundFriend.nickname}`);
      }
  
      if (user.incomingFriendRequests && user.incomingFriendRequests.includes(friendId)) {
        throw ApiError.BadRequest(`You have already received a friend request from ${foundFriend.nickname}`);
      }
  
      foundFriend.incomingFriendRequests = foundFriend.incomingFriendRequests ? [...foundFriend.incomingFriendRequests, userId] : [userId];
      user.outgoingFriendRequests = user.outgoingFriendRequests ? [...user.outgoingFriendRequests, friendId] : [friendId];
  
      await Promise.all([foundFriend.save(), user.save()]);

      const updatedUserDTO = new UserDTO(user);
  
      return 'Friend request sent';
  }
  
  async checkFriendStatus(userId, friendId) {
    async function findUserById(id) {
      return await UserModel.findOne({
        where: { id },
      });
    }

    if (!userId) {
      throw ApiError.BadRequest(`Invalid userId of ${userId}`);
    }

    if (!friendId) {
      throw ApiError.BadRequest(`Invalid friendId of ${friendId}`);
    }

    const [user, friend] = await Promise.all([
      findUserById(userId),
      findUserById(friendId),
    ]);

    if (!user || !friend) {
      throw ApiError.BadRequest('User not found');
    }

    if (user.friends && user.friends.includes(friendId)) {
      return 'FRIEND';
    }

    if (user.incomingFriendRequests && user.incomingFriendRequests.includes(friendId)) {
      return 'FRIEND_REQUEST_RECEIVED';
    }
    
    if (user.outgoingFriendRequests && user.outgoingFriendRequests.includes(friendId)) {
      return 'FRIEND_REQUEST_SENT';
    }

    return 'NOT_FRIEND';
  }
}

module.exports = new UserService();






