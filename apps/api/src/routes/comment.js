import { Router } from 'express';
import commentController from '../controllers/commentController.js';
import auth from '../middlewares/auth.js';
import { commentValidation } from '../middlewares/validations.js';

const commentRouter = Router({ mergeParams: true });
const adminCommentRouter = Router();

commentRouter.get('/', commentController.postComments_get);
commentRouter.get('/:commentid', commentController.singleComment_get);
commentRouter.put(
  '/:commentid',
  auth.verifyToken,
  commentValidation,
  commentController.comment_update,
);
commentRouter.delete(
  '/:commentid',
  auth.verifyToken,
  commentController.comment_delete,
);
commentRouter.post(
  '/',
  auth.verifyToken,
  commentValidation,
  commentController.createComment_post,
);

adminCommentRouter.get('/', commentController.allComments_get);

export { commentRouter, adminCommentRouter };
