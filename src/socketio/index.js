const app = require('../app'); // Import app
const { CLIENT_URL, PORT } = require('../config');
const { Server } = require('socket.io'); // Import Server from socket.io
const http = require('http'); // Use http module
const { instrument } = require('@socket.io/admin-ui');


const server = http.createServer(app); // Create an http server


// Initialize Socket.io with CORS options
const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL, 'https://admin.socket.io'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

instrument(io, { auth: false });

module.exports = { io }; // Export io