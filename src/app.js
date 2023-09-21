const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors'); // Import the cors middleware
const helmet = require('helmet');
const sequelize = require('sequelize');
require('dotenv').config();
const db = require('./sequelize/models');

const { router: authRouter } = require('./routes/auth-route');
const errorMiddleware = require('./middlewares/error-middleware');
const UserModel = require('./sequelize/models/user')(db, sequelize.DataTypes);

const app = express();

// Middleware
app.use(helmet());

// Configure CORS to allow requests from 'http://localhost:3000'
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // Allow credentials (e.g., cookies) to be sent with the request
}));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const setup = async (app) => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
    await db.sync();
    console.log('All models were synchronized successfully.');

    app.use('/auth', express.json(), authRouter);

    app.use(errorMiddleware);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

setup(app);

module.exports = app;
