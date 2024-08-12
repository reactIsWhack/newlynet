const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  sendClubChatMessage,
  getClubChatMessages,
  readClubChatMessages,
} = require('../controllers/clubChat.controller');

const router = Router();

router.post('/:serverId', routeProtector, sendClubChatMessage);
router.get('/:chatId/:dateQuery', routeProtector, getClubChatMessages);
router.patch('/:chatId', routeProtector, readClubChatMessages);

module.exports = router;
