const { Router } = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getLoginStatus,
  forgetPassword,
  resetPassword,
} = require('../controllers/auth.controller');

const router = Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/loginstatus', getLoginStatus);
router.post('/forgetpassword', forgetPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
