const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  getActiveClubChat,
  sendClubChatMessage,
  getClubChatMessages,
  joinClubChat,
} = require('../controllers/clubChat.controller');

const router = Router();

router.get('/activeclubchat', routeProtector, getActiveClubChat);
router.post('/clubchatmsg', routeProtector, sendClubChatMessage);
router.get(
  '/messages/:section/:dateQuery',
  routeProtector,
  getClubChatMessages
);
router.patch('/joinclubchat', routeProtector, joinClubChat);

module.exports = router;
