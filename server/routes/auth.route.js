const { Router } = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controller');

const router = Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);

module.exports = router;
