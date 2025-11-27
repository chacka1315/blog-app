import { Router } from 'express';
import { postValidation } from '../middlewares/validations.js';
import postController from '../controllers/postController.js';
import { commentRouter } from './comment.js';

const postRouter = Router();
const adminPostRouter = Router();

postRouter.get('/', postController.publishedPosts_get);
postRouter.get('/archive', postController.postsTitle_get);
postRouter.use('/:postid/comments', commentRouter);
postRouter.get('/:slug', postController.publishedPost_get);

adminPostRouter.get('/', postController.allPosts_get);
adminPostRouter.post('/', postValidation, postController.create_post);
adminPostRouter.put('/publish', postController.publishAll_update);
adminPostRouter.put('/publish/:postid', postController.publish_update);
adminPostRouter.put('/unpublish/:postid', postController.unpublish_update);
adminPostRouter.use('/:postid/comments', commentRouter);
adminPostRouter.get('/:slug', postController.post_get);
adminPostRouter.put('/:postid', postValidation, postController.post_update);
adminPostRouter.delete('/:postid', postController.post_delete);

export { postRouter, adminPostRouter };
