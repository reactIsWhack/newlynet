const multer = require('multer');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname + '--' + Date.now());
  },
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'video/mov' ||
    file.mimetype === 'video/mp4'
  ) {
    return cb(null, true);
  }

  const err = new Error(
    `${file.mimetype.slice(
      file.mimetype.indexOf('/') + 1
    )} file type not permitted`
  );
  return cb(err);
};

const uploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100000000 },
});

module.exports = uploader;
