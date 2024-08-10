const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const { getClubServer } = require('../controllers/clubServer.controller');

const router = Router();

router.get('/', routeProtector, getClubServer);

module.exports = router;
