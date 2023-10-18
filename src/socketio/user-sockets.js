const { io } = require('./index.js');
const sequelize = require('sequelize');
const UserService = require('../services/user-service');

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('addFriend', (data) => {
    const { userId, friendId } = data;

    console.table({ userId, friendId });

    socket.join(userId);
    socket.join(friendId);

    io.to(friendId).emit('newFriendRequest', { userId, friendId });
  });

  socket.on('acceptFriendRequest', async (data) => {
    const { userId, friendId } = data;

    console.table({ userId, friendId });

    socket.join(userId);
    socket.join(friendId);

    const user = await UserService.acceptFriendRequest(userId, friendId);

    io.to(userId).emit('friendRequestAccepted', { userId, friendId });
  });
});

module.exports = { io }; // Export io
