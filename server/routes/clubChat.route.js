const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  sendClubChatMessage,
  getClubChatMessages,
  joinClubChat,
} = require('../controllers/clubChat.controller');

const router = Router();

router.post('/clubchatmsg', routeProtector, sendClubChatMessage);
router.get(
  '/messages/:section/:dateQuery',
  routeProtector,
  getClubChatMessages
);
router.patch('/joinclubchat', routeProtector, joinClubChat);

module.exports = router;
