const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  getClubServer,
  joinClubServer,
  createCustomClubServer,
} = require('../controllers/clubServer.controller');

const router = Router();

router.get('/', routeProtector, getClubServer);
router.patch('/:serverId', routeProtector, joinClubServer);
router.post('/', routeProtector, createCustomClubServer);

module.exports = router;
