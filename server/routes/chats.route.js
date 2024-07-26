const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const { createchat, getChats } = require('../controllers/chats.controller');

const router = Router();

router.post('/createchat', routeProtector, createchat);
router.get('/getchats/:chatType', routeProtector, getChats);

module.exports = router;
