const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  createchat,
  getChats,
  updateChatSettings,
  leaveGroupChat,
} = require('../controllers/chats.controller');
const uploader = require('../utils/fileUpload');
const fileErrorHandler = require('../middleware/multerErrorHandler');

const router = Router();

router.post('/createchat', routeProtector, createchat);
router.get('/getchats/:chatType', routeProtector, getChats);
router.patch(
  '/updatechat/:chatId',
  routeProtector,
  uploader.single('photo'),
  fileErrorHandler,
  updateChatSettings
);
router.patch('/leavechat/:chatId', routeProtector, leaveGroupChat);

module.exports = router;
