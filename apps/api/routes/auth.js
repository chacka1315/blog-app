import { Router } from 'express';
import { MulterError } from 'multer';
import { CustomMulterError } from '../errors/CustomErrors.js';
import signUupload from '../middlewares/signupUpload.js';
import checkFileType from '../middlewares/checkFileType.js';
import authController from '../controllers/authController.js';
import {
  signupValidation,
  signinValidation,
} from '../middlewares/validations.js';

const authRouter = Router();

authRouter.post(
  '/sign-up',
  signUupload.single('avatar'),
  checkFileType.avatarValidation,
  signupValidation,
  authController.signup_post,
);

authRouter.post('/sign-in', signinValidation, authController.signin_post);

authRouter.use((err, req, res, next) => {
  if (err instanceof MulterError) {
    console.log(err);
    const multerErr = new CustomMulterError(err.code);
    return res.status(multerErr.statusCode).json({
      msg: multerErr.message,
    });
  }
  next(err);
});
export default authRouter;
