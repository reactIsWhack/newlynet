const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  getClubServer,
  joinClubServer,
  createCustomClubServer,
  inviteUserToServer,
  getUserClubServers,
  getSuggestedServers,
} = require('../controllers/clubServer.controller');

const router = Router();

router.get('/', routeProtector, getClubServer);
router.patch('/:serverId', routeProtector, joinClubServer);
router.post('/', routeProtector, createCustomClubServer);
router.patch('/invite/:serverId/:userId', routeProtector, inviteUserToServer);
router.get('/allservers', routeProtector, getUserClubServers);
router.get('/suggestedservers', routeProtector, getSuggestedServers);

module.exports = router;
