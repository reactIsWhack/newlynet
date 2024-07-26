const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  sendMessage,
  getMessages,
} = require('../controllers/message.controller');

const router = Router();

router.post('/sendmessage/:chatId', routeProtector, sendMessage);
router.get('/messages', routeProtector, getMessages);

module.exports = router;
