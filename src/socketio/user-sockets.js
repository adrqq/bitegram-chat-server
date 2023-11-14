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

    // console.table({ userId, friendId });
    console.table(friendId  );

    if (!users[friendId]) {
      // users[friendId].emit('newFriendRequest', { userId, friendId });

      return;
    }

    await UserService.sendFriendRequest(userId, friendId)
      .then(() => {
        users[userId].emit('friendRequestSent');
 
        users[friendId].emit('friendRequestSent');
      })
  });

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

    io.emit('testSocket', { message: 'testSocket' });
  });
});

module.exports = { io };
