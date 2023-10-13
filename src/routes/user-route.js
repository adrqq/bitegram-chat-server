const router = require("express").Router();
const UserController = require("../controllers/user-controller");
const { body } = require("express-validator");

router.get(
  '/search',
  body('searchQuery').isString().optional(),
  UserController.searchUsers,
);

router.get(
  '/:userId',
  body('userId').isString(),
  UserController.getUserById,
);

router.post(
  '/send-friend-request',
  body('friendId').isString(),
  UserController.sendFriendRequest,
);


module.exports = { router };
