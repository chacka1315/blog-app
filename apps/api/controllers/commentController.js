import prisma from '../prisma/prisma.js';
import { validationResult, matchedData } from 'express-validator';
import { BadRequestError, UnauthorizedError } from '../errors/CustomErrors.js';

//GET controllers
const postComments_get = async (req, res, next) => {
  const { postid } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: Number(postid),
      },
      orderBy: { publishedAt: 'desc' },
    });

    res.json({ data: comments });
  } catch (err) {
    next(err);
  }
};

const singleComment_get = async (req, res, next) => {
  const { commentid } = req.params;
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(commentid),
      },
    });

    if (!comment) {
      const error = new BadRequestError('This comment does not exist.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    res.json({ data: comment });
  } catch (err) {
    next(err);
  }
};

//POST controllers
const createComment_post = async (req, res, next) => {
  const validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    const errors = validationErr.array();
    const err = new BadRequestError('Some fields failed validation.');
    return res.status(err.statusCode).json({
      msg: err.message,
      formErrors: errors,
    });
  }

  const { content } = matchedData(req);
  const { postid } = req.params;

  try {
    const comment = await prisma.comment.create({
      data: { content, postId: Number(postid), authorId: req.user.id },
    });

    res.status(201).json({ data: comment });
  } catch (err) {
    next(err);
  }
};

//UPDATE controllers
const comment_update = async (req, res, next) => {
  const validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    const errors = validationErr.array();
    const err = new BadRequestError('Some fields failed validation.');
    return res.status(err.statusCode).json({
      msg: err.message,
      formErrors: errors,
    });
  }

  const { content } = matchedData(req);
  const { commentid } = req.params;

  try {
    const comment = await prisma.comment.update({
      where: { id: Number(commentid), authorId: req.user?.id },
      data: { content },
    });

    if (!comment) {
      const error = new UnauthorizedError('Not authorized to update.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    res.json({ data: comment });
  } catch (err) {
    next(err);
  }
};

//DELETE controllers
const comment_delete = async (req, res, next) => {
  const { commentid } = req.params;

  try {
    const comment = await prisma.post.delete({
      where: { id: Number(commentid), authorId: req.user?.id },
    });

    if (!comment) {
      const error = new UnauthorizedError('Not authorized to delete.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }
    res.json({ data: comment });
  } catch (err) {
    next(err);
  }
};
export default {
  createComment_post,
  postComments_get,
  comment_update,
  comment_delete,
  singleComment_get,
};
