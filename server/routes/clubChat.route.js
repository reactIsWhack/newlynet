const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  sendClubChatMessage,
  getClubChatMessages,
  joinClubChat,
} = require('../controllers/clubChat.controller');

const router = Router();

router.post('/:serverId', routeProtector, sendClubChatMessage);
router.get('/:chatId/:dateQuery', routeProtector, getClubChatMessages);

module.exports = router;
