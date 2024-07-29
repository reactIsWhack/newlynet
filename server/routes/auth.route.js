const { Router } = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getLoginStatus,
} = require('../controllers/auth.controller');

const router = Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/loginstatus', getLoginStatus);

module.exports = router;
