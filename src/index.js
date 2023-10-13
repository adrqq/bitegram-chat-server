const { app } = require('./app');
const { io } = require('./socketio');
const { PORT, HOST, API_URL } = require('./config');

try {
  const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on ${API_URL}`);
  });

  io.attach(server);
} catch (err) {
  console.log(err);
}
