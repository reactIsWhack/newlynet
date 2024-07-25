const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  addContact,
  getCommonNewStudents,
  getPersonalProfile,
} = require('../controllers/user.controller');

const router = Router();

router.patch('/addcontact/:contactId', routeProtector, addContact);
router.get('/commonstudents/:filter', routeProtector, getCommonNewStudents);
router.get('/personalprofile', routeProtector, getPersonalProfile);

module.exports = router;
