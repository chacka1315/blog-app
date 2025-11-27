import prisma from '../prisma/prisma.js';
import { validationResult, matchedData } from 'express-validator';
import { BadRequestError, UnauthorizedError } from '../errors/CustomErrors.js';

//GET controllers
const postComments_get = async (req, res, next) => {
  const { postid } = req.params;
  try {
    const postExists = await prisma.post.findUnique({
      where: { id: Number(postid), published: true },
    });

    if (!postExists) {
      const err = new BadRequestError('Try to get unexisted post comments ');
      return res.status(err.statusCode).json({
        msg: err.message,
      });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: Number(postid),
      },
      include: { user: { select: { username: true, avatar: true } } },
      orderBy: { publishedAt: 'desc' },
    });

    res.json(comments);
  } catch (err) {
    next(err);
  }
};

const allComments_get = async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { publishedAt: 'desc' },
    });

    res.json(comments);
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

    res.json(comment);
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
    const postExists = await prisma.post.findUnique({
      where: { id: Number(postid), published: true },
    });

    if (!postExists) {
      const err = new BadRequestError('Try to comment unexisted post.');
      return res.status(err.statusCode).json({
        msg: err.message,
      });
    }

    const comment = await prisma.comment.create({
      data: { content, postId: Number(postid), authorId: req.user.id },
      include: {
        user: { omit: { password: true } },
      },
    });

    res.status(201).json(comment);
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
    let comment;

    if (req.user.role === 'ADMIN') {
      comment = await prisma.comment.update({
        where: { id: Number(commentid) },
        data: { content },
      });
    } else {
      comment = await prisma.comment.update({
        where: { id: Number(commentid), authorId: req.user.id },
        data: { content },
      });
    }

    if (!comment) {
      const error = new UnauthorizedError('Not authorized to update.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    res.json(comment);
  } catch (err) {
    next(err);
  }
};

//DELETE controllers
const comment_delete = async (req, res, next) => {
  const { commentid } = req.params;
  console.log(commentid, req.user.id);

  try {
    let comment;

    if (req.user.role === 'ADMIN') {
      comment = await prisma.comment.delete({
        where: { id: Number(commentid) },
      });
    } else {
      comment = await prisma.comment.delete({
        where: { id: Number(commentid), authorId: req.user.id },
      });
    }

    res.json(comment);
  } catch (err) {
    if (err.code === 'P2025') {
      const error = new UnauthorizedError('Not authorized to update.');
      return res.status(error.statusCode).json({ msg: error.message });
    }
    next(err);
  }
};
export default {
  createComment_post,
  postComments_get,
  comment_update,
  comment_delete,
  singleComment_get,
  allComments_get,
};
