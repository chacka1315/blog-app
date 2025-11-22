import { Router } from 'express';
import commentController from '../controllers/commentController.js';
import auth from '../middlewares/auth.js';
import { commentValidation } from '../middlewares/validations.js';

const commentRouter = Router({ mergeParams: true });

commentRouter.get('/', commentController.postComments_get);
commentRouter.get('/:commentid', commentController.singleComment_get);
commentRouter.put('/', auth.verifyToken, commentController.comment_update);
commentRouter.delete('/', auth.verifyToken, commentController.comment_delete);
commentRouter.post(
  '/',
  auth.verifyToken,
  commentValidation,
  commentController.createComment_post,
);
export default commentRouter;
