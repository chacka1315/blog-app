import { fileTypeFromBuffer } from 'file-type';

const avatarValidation = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

    const type = await fileTypeFromBuffer(req.file.buffer);
    if (!type || !allowed.includes(type.mime)) {
      req.uploadErr = 'The profile picture file is not a valid image.';
    }
    next();
  } catch (err) {
    next(err);
  }
};

export default { avatarValidation };
