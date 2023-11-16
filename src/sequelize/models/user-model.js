'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    activationLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    incomingFriendRequests: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    outgoingFriendRequests: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    friends: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    chats: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    groups: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
