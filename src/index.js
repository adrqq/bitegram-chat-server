const app = require('./app');
const { PORT } = require('./config');

try {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.log(err)
}

module.exports = app;
