const express = require('express');
// const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('sequelize');
const passport = require('passport');
require('dotenv').config();
const db = require('./sequelize/models');

const { router: userRouter } = require('./routes/user');
const errorMiddleware = require('./middlewares/error-middleware');
const UserModel = require('./sequelize/models/user')(db, sequelize.DataTypes);

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieSession({
//   name: 'session',
// }));

const setup = async (app) => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
    await db.sync();
    console.log('All models were synchronized successfully.');

    // UserModel.create({
    //   firstName: 'John',
    //   lastName: 'Doe',
    // });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

setup(app);

module.exports = app;
