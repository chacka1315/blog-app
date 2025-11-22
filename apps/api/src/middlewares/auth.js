import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../errors/CustomErrors.js';

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader) {
    const error = new UnauthorizedError('Your are not authenticated.');
    return res.status(error.statusCode).json({
      msg: error.message,
    });
  }

  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      const error = new UnauthorizedError('Your are not authenticated.');
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    req.user = authData.user;
    next();
  });
};

const checkRole = (role) => [
  verifyToken,
  (req, res, next) => {
    if (req.user?.role !== role) {
      const error = new ForbiddenError(
        'Not authorized to access this ressource.',
      );
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    next();
  },
];
export default { verifyToken, checkRole };
