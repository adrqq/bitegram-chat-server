'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chat', {
      id: {
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        allowNull: false,
      },
      users: {
        type: Sequelize.DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        limit: 2,
      },
      messages: {
        type: Sequelize.DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chat');
  },
};

// Chat.init({
//   id: {
//     primaryKey: true,
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     allowNull: false,
//   },
//   users: {
//     type: DataTypes.ARRAY(DataTypes.STRING),
//     allowNull: false,
//     limit: 2,
//   },
//   messages: {
//     type: DataTypes.ARRAY(DataTypes.STRING),
//     defaultValue: [],
//   },
// }, {
//   sequelize,
//   modelName: 'Chat',
// });
// return Chat;
