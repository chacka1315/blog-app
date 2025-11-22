import utils from '../../../../packages/utils/index.js';
import prisma from '../prisma/prisma.js';
import { validationResult, matchedData } from 'express-validator';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/CustomErrors.js';

//GET controllers
const allPosts_get = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { username: true, avatar: true } },
      },
      orderBy: [{ createdAt: 'desc' }, { publishedAt: 'desc' }],
    });
    res.json({ data: posts });
  } catch (err) {
    next(err);
  }
};

const publishedPosts_get = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { username: true, avatar: true } },
      },
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: posts });
  } catch (err) {
    next(err);
  }
};

const post_get = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      const error = new NotFoundError('This post does not exist.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }
    res.json({ data: post });
  } catch (err) {
    next(err);
  }
};

const publishedPost_get = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug, published: true },
    });

    if (!post) {
      const error = new NotFoundError('This post does not exist.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }
    res.json({ data: post });
  } catch (err) {
    next(err);
  }
};

//POST controllers
const create_post = async (req, res, next) => {
  const validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    const errors = validationErr.array();
    const err = new BadRequestError('Some fields failed validation.');
    return res.status(err.statusCode).json({
      msg: err.message,
      formErrors: errors,
    });
  }

  const { title, content } = matchedData(req);
  const slug = utils.createSlug(title);
  const snippet = content.slice(255) + '...';

  try {
    const post = await prisma.post.create({
      data: {
        authorId: req.user.id,
        title,
        content,
        slug,
        snippet,
      },
      include: {
        user: {
          select: { username: true, avatar: true },
        },
      },
    });

    return res.status(201).json({ data: post });
  } catch (err) {
    next(err);
  }
};

//UPDATE controllers
const post_update = async (req, res, next) => {
  const validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    const errors = validationErr.array();
    const err = new BadRequestError('Some fields failed validation.');
    return res.status(err.statusCode).json({
      msg: err.message,
      formErrors: errors,
    });
  }

  const { title, content } = matchedData(req);
  const slug = utils.createSlug(title);
  const snippet = content.slice(255) + '...';
  const { postid } = req.params;
  try {
    const post = await prisma.post.update({
      where: { id: Number(postid), authorId: req.user.id },
      data: { title, slug, snippet, content },
    });

    if (!post) {
      const error = new UnauthorizedError('Not authorized to update.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    res.json({ data: post });
  } catch (err) {
    next(err);
  }
};

const publish_update = async (req, res, next) => {
  const { postid } = req.params;

  try {
    const post = await prisma.post.update({
      where: { id: Number(postid), authorId: req.user.id },
      data: {
        published: true,
        publishedAt: new Date(),
      },
    });

    if (!post) {
      const error = new UnauthorizedError('Not authorized to publish.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    res.json({ data: post });
  } catch (err) {
    next(err);
  }
};

const unpublish_update = async (req, res, next) => {
  const { postid } = req.params;

  try {
    const post = await prisma.post.update({
      where: { id: Number(postid), authorId: req.user.id },
      data: {
        published: false,
        publishedAt: null,
      },
    });

    if (!post) {
      const error = new UnauthorizedError('Not authorized to unpublish.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    res.json({ data: post });
  } catch (err) {
    next(err);
  }
};

const publishAll_update = async (req, res, next) => {
  try {
    const updatedCount = await prisma.post.updateMany({
      where: { published: false, authorId: req.user.id },
      data: {
        published: true,
        publishedAt: new Date(),
      },
    });

    res.json({ data: updatedCount });
  } catch (err) {
    next(err);
  }
};

//DELETE controllers
const post_delete = async (req, res, next) => {
  const { postid } = req.params;

  try {
    const post = await prisma.post.delete({
      where: { id: Number(postid), authorId: req.user.id },
    });

    if (!post) {
      const error = new UnauthorizedError('Not authorized to delete.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    res.json({ data: post });
  } catch (err) {
    next(err);
  }
};

export default {
  create_post,
  allPosts_get,
  publishedPosts_get,
  post_get,
  publishedPost_get,
  publishAll_update,
  publish_update,
  post_delete,
  post_update,
  unpublish_update,
};
