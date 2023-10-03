const router = require("express").Router();
const UserController = require("../controllers/user-controller");
const { body } = require("express-validator");

router.get(
  '/search',
  body('searchQuery').isString().optional(),
  UserController.searchUsers,
);

module.exports = { router };
