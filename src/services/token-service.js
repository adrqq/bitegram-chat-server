const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const { Sequelize } = require('sequelize');
const db = require('../sequelize/models');
const TokenModel = require('../sequelize/models/token')(db, sequelize.DataTypes);
const ApiError = require('../exceptions/api-error');

class TokenService {

  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    }
  }

  async saveToken(userId, refreshToken) {
    try {
      let tokenData = await TokenModel.findOne({ where: { userId } });

      if (tokenData) {
        tokenData.refreshToken = refreshToken;
        await tokenData.save();
      } else {
        tokenData = await TokenModel.create({ userId, refreshToken });
      }

      return tokenData;
    } catch (error) {
      if (error instanceof Sequelize.UniqueConstraintError) {
        // Handle unique constraint violation (e.g., userId already exists)
        throw new ApiError('User with this ID already has a token.');
      } else {
        // Handle other types of errors
        throw error; // Re-throw the original error
      }
    }
  }

  async removeToken(refreshToken) {
    try {
      const tokenData = await TokenModel.destroy({ where: { refreshToken } });

      return tokenData;
    } catch (error) {
      throw new ApiError(error);
    }
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      throw new ApiError(e);
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      throw new ApiError(e);
    }
  }

  async findToken(refreshToken) {
    try {
      const tokenData = await TokenModel.findOne({ where: { refreshToken } });

      return tokenData;
    } catch (e) {
      throw new ApiError(e);
    }
  };
}

module.exports = new TokenService();
