const app = require('./app');
const {
  PORT,
  HOST,
  API_URL,
} = require('./config');

try {
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on ${API_URL}`);
  });
} catch (err) {
  console.log(err)
}

module.exports = app;
