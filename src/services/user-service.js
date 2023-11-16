const natural = require('natural');
const sequelize = require('sequelize');
const db = require('../sequelize/models');
const UserModel = require('../sequelize/models/user-model')(
  db,
  sequelize.DataTypes
);
const ChatModel = require('../sequelize/models/chat-model')(
  db,
  sequelize.DataTypes
);
const ApiError = require('../exceptions/api-error');

class UserService {
  async searchUsers(searchQuery, userId, next) {
    if (!searchQuery) {
      return [];
    }
    // Convert the search query to lowercase for case-insensitive search
    const searchQueryLower = searchQuery.toLowerCase();

    const searchResults = await UserModel.findAll({
      attributes: ['nickname', 'id'],
      where: {
        id: {
          [sequelize.Op.ne]: userId, // Exclude the user with the provided userId
        },
      },
      limit: 12,
    });

    // Filter and save users with a 50% or higher match based on Levenshtein distance
    const filteredUsers = searchResults.filter((user) => {
      const nicknameLower = user.nickname.toLowerCase();
      const distance = natural.LevenshteinDistance(
        searchQueryLower,
        nicknameLower
      );

      // Define a threshold for considering a match (adjust as needed)
      const threshold =
        Math.max(searchQueryLower.length, nicknameLower.length) * 0.3;

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
      // all of the attributes
      attributes: {
        exclude: [],
      },
    });

    if (!user) {
      // If user is falsy, send an error response and return from the function
      return ApiError.BadRequest('User not found');
    }

    return user;
  }

  async sendFriendRequest(userId, friendId, next) {
    try {
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
        throw ApiError.BadRequest(
          `You are already friends with ${foundFriend.nickname}`
        );
      }

      if (
        foundFriend.incomingFriendRequests &&
        foundFriend.incomingFriendRequests.includes(userId)
      ) {
        throw ApiError.BadRequest(
          `You have already sent a friend request to ${foundFriend.nickname}`
        );
      }

      if (
        user.incomingFriendRequests &&
        user.incomingFriendRequests.includes(friendId)
      ) {
        throw ApiError.BadRequest(
          `You have already received a friend request from ${foundFriend.nickname}`
        );
      }

      foundFriend.incomingFriendRequests = foundFriend.incomingFriendRequests
        ? [...foundFriend.incomingFriendRequests, userId]
        : [userId];
      user.outgoingFriendRequests = user.outgoingFriendRequests
        ? [...user.outgoingFriendRequests, friendId]
        : [friendId];

      await Promise.all([foundFriend.save(), user.save()]);

      return 'Friend request sent';
    } catch (e) {
      return e.message;
    }
  }

  async checkFriendStatus(userId, friendId, next) {
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

    if (
      user.incomingFriendRequests &&
      user.incomingFriendRequests.includes(friendId)
    ) {
      return 'FRIEND_REQUEST_RECEIVED';
    }

    if (
      user.outgoingFriendRequests &&
      user.outgoingFriendRequests.includes(friendId)
    ) {
      return 'FRIEND_REQUEST_SENT';
    }

    return 'NOT_FRIEND';
  }

  async acceptFriendRequest(userId, friendId, next) {
    try {
      if (!userId) {
        throw ApiError.BadRequest(`Invalid userId of ${userId}`);
      }

      if (!friendId) {
        throw ApiError.BadRequest(`Invalid friendId of ${friendId}`);
      }

      const [user, friend] = await Promise.all([
        UserModel.findOne({
          where: { id: userId },
        }),
        UserModel.findOne({
          where: { id: friendId },
        }),
      ]);

      if (!user || !friend) {
        throw ApiError.BadRequest('User not found');
      }

      if (user.friends && user.friends.includes(friendId)) {
        throw ApiError.BadRequest(
          `You are already friends with ${friend.nickname}`
        );
      }

      if (friend.friends && friend.friends.includes(userId)) {
        throw ApiError.BadRequest(
          `You are already friends with ${user.nickname}`
        );
      }

      if (
        user.incomingFriendRequests &&
        !user.incomingFriendRequests.includes(friendId)
      ) {
        throw ApiError.BadRequest(
          `You have not received a friend request from ${friend.nickname}`
        );
      }

      if (
        friend.outgoingFriendRequests &&
        !friend.outgoingFriendRequests.includes(userId)
      ) {
        throw ApiError.BadRequest(
          `You have not sent a friend request to ${user.nickname}`
        );
      }

      user.incomingFriendRequests = user.incomingFriendRequests.filter(
        (id) => id !== friendId
      );
      friend.outgoingFriendRequests = friend.outgoingFriendRequests.filter(
        (id) => id !== userId
      );

      user.friends = user.friends ? [...user.friends, friendId] : [friendId];
      friend.friends = friend.friends ? [...friend.friends, userId] : [userId];

      await Promise.all([user.save(), friend.save()]);

      return user;
    } catch (e) {
      next(e);
    }
  }

  async deleteFriend(userId, friendId, next) {
    try {
      if (!userId) {
        throw ApiError.BadRequest(`Invalid userId of ${userId}`);
      }

      if (!friendId) {
        throw ApiError.BadRequest(`Invalid friendId of ${friendId}`);
      }

      const [user, friend] = await Promise.all([
        UserModel.findOne({
          where: { id: userId },
        }),
        UserModel.findOne({
          where: { id: friendId },
        }),
      ]);

      if (!user || !friend) {
        throw ApiError.BadRequest('User not found');
      }

      if (user.friends && !user.friends.includes(friendId)) {
        throw ApiError.BadRequest(
          `You are not friends with ${friend.nickname}`
        );
      }

      if (friend.friends && !friend.friends.includes(userId)) {
        throw ApiError.BadRequest(`You are not friends with ${user.nickname}`);
      }

      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== userId);

      await Promise.all([user.save(), friend.save()]);

      return 'Friend deleted';
    } catch (e) {
      next(e);
    }
  }

  async createChat(userId, friendId) {
    if (!userId) {
      throw ApiError.BadRequest(`Invalid userId of ${userId}`);
    }

    if (!friendId) {
      throw ApiError.BadRequest(`Invalid friendId of ${friendId}`);
    }

    console.table({ userId, friendId });

    const [user, friend] = await Promise.all([
      UserModel.findOne({
        where: { id: userId },
      }),
      UserModel.findOne({
        where: { id: friendId },
      }),
    ]);

    console.table({ user, friend });

    if (!user || !friend) {
      throw ApiError.BadRequest('User not found');
    }

    if (user.friends && !user.friends.includes(friendId)) {
      throw ApiError.BadRequest(`You are not friends with ${friend.nickname}`);
    }

    if (friend.friends && !friend.friends.includes(userId)) {
      throw ApiError.BadRequest(`You are not friends with ${user.nickname}`);
    }

    if (user.chats && user.chats.includes(friendId)) {
      throw ApiError.BadRequest(
        `You already have a chat with ${friend.nickname}`
      );
    }

    if (friend.chats && friend.chats.includes(userId)) {
      throw ApiError.BadRequest(
        `You already have a chat with ${user.nickname}`
      );
    }

    const chat = await ChatModel.create({
      users: [userId, friendId],
    });

    user.chats = user.chats ? [...user.chats, chat.id] : [chat.id];
    friend.chats = friend.chats ? [...friend.chats, chat.id] : [chat.id];

    await Promise.all([user.save(), friend.save()]);

    return chat;
  }

  async getChatById(chatId) {
    if (!chatId) {
      throw ApiError.BadRequest(`Invalid chatId of ${chatId}`);
    }

    const chat = await ChatModel.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw ApiError.BadRequest('Chat not found');
    }

    return chat;
  }

  async getChatsInfoList(chatIds) {
    if (!chatIds) {
      throw ApiError.BadRequest(`Invalid chatIds of ${chatIds}`);
    }

    const chats = await ChatModel.findAll({
      where: { id: chatIds },
    });

    if (!chats) {
      throw ApiError.BadRequest('Chats not found');
    }

    return chats;
  }
}

module.exports = new UserService();
