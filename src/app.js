const express = require('express');
require('dotenv').config();
const { CLIENT_URL, PORT } = require('./config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const sequelize = require('sequelize');
const db = require('./sequelize/models');
const { io: userSockets } = require('./socketio/user-sockets');

const { router: authRouter } = require('./routes/auth-route');
const { router: userRouter } = require('./routes/user-route');
const errorMiddleware = require('./middlewares/error-middleware');
const UserModel = require('./sequelize/models/user-model')(db, sequelize.DataTypes);
const ChatModel = require('./sequelize/models/chat-model')(db, sequelize.DataTypes);

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure CORS to allow requests from 'http://localhost:3000'
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

const setup = async (app) => {
  try {
    // Sync models

    ChatModel.sync({ alter: true });
    UserModel.sync({ alter: true });

    app.get('/', (req, res) => {
      res.status(200);
      res.send(`<h1>Welcome to bitegram server root "/"</h1>`);
    });

    app.use('/auth', express.json(), authRouter);
    app.use('/user', express.json(), userRouter);

    app.use(errorMiddleware);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

setup(app);

module.exports = { app }; // Export app and io
