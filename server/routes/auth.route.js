const { Router } = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
} = require('../controllers/auth.controller');

const router = Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

module.exports = router;
