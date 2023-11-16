const router = require("express").Router();
const UserController = require("../controllers/user-controller");
const { body, param } = require("express-validator");

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

router.post(
  '/create-chat',
  body('userId').isString(),
  body('friendId').isString(),
  UserController.createChat,
)

router.get(
  '/get-chat-by-id',
  // param('chatId').isString(),
  UserController.getChatById,
)

router.get(
  '/get-chats-info-list',
  body('chatIds').isArray(),
  UserController.getChatsInfoList,
)


module.exports = { router };
