const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  addContact,
  getCommonNewStudents,
  getPersonalProfile,
  updateProfile,
  addSocialMediaInfo,
  searchForUser,
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
router.patch('/addsocialmedia', routeProtector, addSocialMediaInfo);
router.get('/search/:searchQuery', routeProtector, searchForUser);

module.exports = router;
