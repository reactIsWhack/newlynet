const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const { getActiveClubChat } = require('../controllers/clubChat.controller');

const router = Router();

router.get('/activeclubchat', routeProtector, getActiveClubChat);

module.exports = router;
