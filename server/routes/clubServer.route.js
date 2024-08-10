const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  getClubServer,
  joinClubServer,
} = require('../controllers/clubServer.controller');

const router = Router();

router.get('/', routeProtector, getClubServer);
router.patch('/:serverId', routeProtector, joinClubServer);

module.exports = router;
