const { Router } = require('express');
const routeProtector = require('../middleware/routeProtector');
const {
  sendMessage,
  getMessages,
} = require('../controllers/message.controller');
const uploader = require('../utils/fileUpload');
const fileErrorHandler = require('../middleware/multerErrorHandler');

const router = Router();

router.post(
  '/sendmessage/:chatId',
  uploader.single('image'),
  fileErrorHandler,
  routeProtector,
  sendMessage
);
router.get('/messages/:chatId', routeProtector, getMessages);

module.exports = router;
