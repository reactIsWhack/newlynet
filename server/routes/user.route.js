const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  addContact,
  getCommonNewStudents,
  getPersonalProfile,
  updateProfile,
} = require('../controllers/user.controller');
const uploader = require('../utils/fileUpload');
const fileErrorHandler = require('../middleware/multerErrorHandler');

const router = Router();

router.patch('/addcontact/:contactId', routeProtector, addContact);
router.get('/commonstudents/:filter', routeProtector, getCommonNewStudents);
router.get('/personalprofile', routeProtector, getPersonalProfile);
router.patch(
  '/updateprofile',
  routeProtector,
  uploader.single('pfp'),
  fileErrorHandler,
  updateProfile
);

module.exports = router;
