const { Router } = require('express');
const { registerUser } = require('../controllers/auth.controller');

const router = Router();

router.post('/signup', registerUser);

module.exports = router;
