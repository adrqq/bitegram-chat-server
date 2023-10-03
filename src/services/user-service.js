const natural = require('natural');
const sequelize = require('sequelize');
const db = require('../sequelize/models');
const UserModel = require('../sequelize/models/user')(db, sequelize.DataTypes);

class UserService {
  async searchUsers(searchQuery) {
    if (!searchQuery) {
      return [];
    }

    // Convert the search query to lowercase for case-insensitive search
    const searchQueryLower = searchQuery.toLowerCase();

    const searchResults = await UserModel.findAll({
      attributes: ['nickname', 'id'],
      limit: 12,
    })

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
}

module.exports = new UserService();






