const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  addContact,
  getCommonNewStudents,
} = require('../controllers/user.controller');

const router = Router();

router.patch('/addcontact/:contactId', routeProtector, addContact);
router.get(
  '/commonstudents/:filter/:dateQuery',
  routeProtector,
  getCommonNewStudents
);

module.exports = router;
