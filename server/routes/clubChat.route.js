const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  getActiveClubChat,
  sendClubChatMessage,
} = require('../controllers/clubChat.controller');

const router = Router();

router.get('/activeclubchat', routeProtector, getActiveClubChat);
router.post('/clubchatmsg', routeProtector, sendClubChatMessage);

module.exports = router;
