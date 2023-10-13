const router = require("express").Router();
const UserController = require("../controllers/user-controller");
const { body } = require("express-validator");

router.get(
  '/search',
  body('searchQuery').isString().optional(),
  UserController.searchUsers,
);

router.get(
  '/get-user-by-id',
  body('userId').isString(),
  UserController.getUserById,
);

router.get(
  '/check-friend-status',
  body('friendId').isString(),
  body('userId').isString(),
  UserController.checkFriendStatus,
)

router.post(
  '/send-friend-request',
  body('friendId').isString(),
  UserController.sendFriendRequest,
);


module.exports = { router };
