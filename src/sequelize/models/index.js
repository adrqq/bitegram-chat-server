'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.ENV || 'DEV';
const config = require(__dirname + '/../config/config.js')[env];

const db = new Sequelize(config.url, config,);

module.exports = db;
