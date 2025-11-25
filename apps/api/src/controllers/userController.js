import { NotFoundError } from '../errors/CustomErrors.js';
import prisma from '../prisma/prisma.js';

const allUsers_get = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: [{ role: 'asc' }, { username: 'desc' }],
      omit: { password: true },
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
};

const connectedUser_get = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      omit: { password: true },
    });

    if (!user) {
      const error = new NotFoundError('User does not exist.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const user_get = async (req, res, next) => {
  const { userid } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userid) },
      omit: { password: true },
    });

    if (!user) {
      const error = new NotFoundError('User does not exist.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const role_update = (role) => async (req, res, next) => {
  const { userid } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id: Number(userid) },
      data: { role },
      omit: { password: true },
    });

    if (!user) {
      const error = new NotFoundError('User does not exist.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export default { role_update, allUsers_get, user_get, connectedUser_get };
