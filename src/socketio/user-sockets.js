const { io } = require('../socketio');
const sequelize = require('sequelize');
const UserService = require('../services/user-service');

io.on('connection', (socket) => {
  console.log('connected user with id: ', socket.id);

  // socket.on('addFriend', async (data) => {
  //   const { userId, friendId } = data;

  //   console.table({ userId, friendId });
  //   console.table(socket.rooms);

  //   // socket.join(friendId);
  //   // socket.join(userId);

  //   await UserService.sendFriendRequest(userId, friendId)
  //     .then(() => {
  //       // io.to(userId).emit('friendRequestSent', { userId, friendId });

  //       io.emit('friendRequestSent', { userId, friendId });
  //     })
  // });

  // socket.on('acceptFriendRequest', async (data) => {
  //   const { userId, friendId } = data;

  //   console.table({ userId, friendId });

  //   socket.join(userId);
  //   socket.join(friendId);

  //   const user = await UserService.acceptFriendRequest(userId, friendId);

  //   io.to(userId).emit('friendRequestAccepted', { userId, friendId });
  // });

  socket.on('testSocket', async () => {
    console.log('testSocket');

    socket.broadcast.emit('testSocket', { message: 'testSocket' });
  });
});

module.exports = { io };
