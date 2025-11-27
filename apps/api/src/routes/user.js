import { Router } from 'express';
import userController from '../controllers/userController.js';
import auth from '../middlewares/auth.js';
import authController from '../controllers/authController.js';

const userRouter = Router();
const adminUserRouter = Router();

userRouter.get('/me', auth.verifyToken, userController.connectedUser_get);
userRouter.get('/:userid', userController.user_get);

adminUserRouter.get(
  '/me',
  auth.checkRole('ADMIN'),
  userController.connectedUser_get,
);
adminUserRouter.get('/', userController.allUsers_get);
adminUserRouter.put('/set-admin/:userid', userController.role_update('ADMIN'));
adminUserRouter.put('/set-user/:userid', userController.role_update('USER'));
adminUserRouter.get('/:userid', userController.user_get);

export { userRouter, adminUserRouter };
