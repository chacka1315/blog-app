import bcrypt from 'bcryptjs';
import { matchedData, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';
import { BadRequestError } from '../errors/CustomErrors.js';
import prisma from '../prisma/prisma.js';

const signup_post = async (req, res, next) => {
  const validationErr = validationResult(req);
  if (!validationErr.isEmpty() || req.uploadErr) {
    let errors = validationErr.array();
    req.uploadErr && errors.push({ msg: req.uploadErr });
    const err = new BadRequestError('Some fields are invalid.');
    return res.status(err.statusCode).json({
      msg: err.message,
      formErrors: errors,
    });
  }

  try {
    let uploadResult = null;

    if (req.file) {
      uploadResult = await new Promise((resolve, reject) => {
        const options = { folder: 'blog-avatars', resource_type: 'image' };
        cloudinary.uploader
          .upload_stream(options, (err, uploadResult) => {
            if (err) return reject(err);
            return resolve(uploadResult);
          })
          .end(req.file.buffer);
      });
    }

    const { username, email, password } = matchedData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    const signupData = {
      username,
      email,
      password: hashedPassword,
      avatar: uploadResult?.secure_url,
      avatarPublicId: uploadResult?.public_id,
    };

    const user = await prisma.user.create({
      data: signupData,
      omit: { password: true },
    });
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

const signin_post = async (req, res, next) => {
  const validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    let errors = validationErr.array();
    const err = new BadRequestError('Some fields are invalid.');
    return res.status(err.statusCode).json({
      msg: err.message,
      formErrors: errors,
    });
  }

  const { email, password } = matchedData(req);
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const error = new BadRequestError('No account with that email.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new BadRequestError('Wrong password.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    const jwt_payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    const jwt_options = { expiresIn: '14d' };
    jwt.sign(
      { user: jwt_payload },
      process.env.JWT_SECRET,
      jwt_options,
      (err, token) => {
        if (err) return next(err);
        res.json({ token });
      },
    );
  } catch (err) {
    next(err);
  }
};

export default { signup_post, signin_post };
