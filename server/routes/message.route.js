const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const { sendMessage } = require('../controllers/message.controller');

const router = Router();

router.post('/sendmessage/:chatId', routeProtector, sendMessage);

module.exports = router;
