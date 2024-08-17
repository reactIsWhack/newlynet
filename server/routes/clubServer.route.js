const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  getClubServer,
  joinClubServer,
  createCustomClubServer,
  inviteUserToServer,
  getUserClubServers,
  getSuggestedServers,
  createServerChannel,
  addServerAdmin,
  leaveClubServer,
} = require('../controllers/clubServer.controller');

const router = Router();

router.get('/', routeProtector, getClubServer);
router.patch('/:serverId', routeProtector, joinClubServer);
router.post('/', routeProtector, createCustomClubServer);
router.patch('/invite/:serverId/:userId', routeProtector, inviteUserToServer);
router.get('/allservers', routeProtector, getUserClubServers);
router.get('/suggestedservers', routeProtector, getSuggestedServers);
router.patch('/newchannel/:serverId', routeProtector, createServerChannel);
router.patch('/addadmin/:serverId/:userId', routeProtector, addServerAdmin);
router.patch('/leaveserver/:serverId', routeProtector, leaveClubServer);

module.exports = router;
