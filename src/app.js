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
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure CORS to allow requests from 'http://localhost:3000'
app.use(cors({
  origin: process.env.ENV === 'DEV' ? '*' : process.env.API_URL_PROD,
  credentials: true // Allow credentials (e.g., cookies) to be sent with the request
}));

const setup = (async (app) => {
  try {
    // await db.authenticate({ logging: false });
    // console.log('Connection has been established successfully.');

    // await db.sync({ force: true });
    // console.log('All models were synchronized successfully.');

    app.get('/', (req, res) => {
      res.status(200);
      res.send(`<h1>Welcome to bitegram server root "/"</h1>`);
    });

    app.use('/auth', express.json(), authRouter);

    app.use(errorMiddleware);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})(app);

module.exports = app;
