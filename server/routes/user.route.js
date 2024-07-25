const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const { addContact } = require('../controllers/user.controller');

const router = Router();

router.patch('/addcontact/:contactId', routeProtector, addContact);

module.exports = router;
