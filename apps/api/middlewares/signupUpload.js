import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!allowed.includes(file.mimetype)) {
    req.uploadErr = 'The profile picture file is not a valid image.';
    return cb(null, false);
  }
  cb(null, true);
};

const signUupload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default signUupload;
