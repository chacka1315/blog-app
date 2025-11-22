import { userRouter, adminUserRouter } from './user.js';
import { postRouter, adminPostRouter } from './post.js';
import { commentRouter, adminCommentRouter } from './comment.js';
import auth from './auth.js';

export default {
  user: userRouter,
  userAdmin: adminUserRouter,
  post: postRouter,
  postAdmin: adminPostRouter,
  comment: commentRouter,
  adminComment: adminCommentRouter,
  auth,
};
