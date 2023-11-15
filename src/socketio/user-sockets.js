const { io } = require('../socketio');
const sequelize = require('sequelize');
const UserService = require('../services/user-service');

const users = {};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  console.log('connected user with id: ', userId);

  users[userId] = socket;

  socket.on('addFriend', async (data) => {
    const { userId, friendId } = data;

    console.table({ userId, friendId });

    if (!users[friendId]) {
      // users[friendId].emit('newFriendRequest', { userId, friendId });

      return;
    }

    await UserService.sendFriendRequest(userId, friendId)
      .then(() => {
        users[userId].emit('friendRequestSent', { userId, friendId });

        users[friendId].emit('newFriendRequest', { userId, friendId });
      })
  });

  socket.on('deleteFriend', async (data) => {
    const { userId, friendId } = data;

    console.table({ userId, friendId });

    await UserService.deleteFriend(userId, friendId)
      .then(() => {
        users[userId].emit('friendDeleted', { userId, friendId });

        users[friendId].emit('friendDeleted', { userId, friendId });
      })
  });

  socket.on('testSocket', async () => {
    console.log('testSocket');

    io.emit('testSocket', { message: 'testSocket' });
  });

  socket.on('acceptFriendRequest', async (data) => {
    const { userId, friendId } = data;

    console.table({ userId, friendId });

    const user = await UserService.acceptFriendRequest(userId, friendId);

    users[userId].emit('friendRequestAccepted', { userId, friendId });
    users[friendId].emit('friendRequestAccepted', { userId: friendId, friendId: userId });
  });
});

module.exports = { io };
