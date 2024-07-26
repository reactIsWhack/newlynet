const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const { createchat } = require('../controllers/chats.controller');

const router = Router();

router.post('/createchat', routeProtector, createchat);

module.exports = router;
