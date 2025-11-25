import { body } from 'express-validator';
import prisma from '../prisma/prisma.js';

//errors messages
const alphaNumErr = 'must contain only letters and numbers.';
const emailErr = 'This email is not a valid one.';
const passwordErr = `Password must contain at least one capital letter, one lowercase letter, and one number.`;

//Custom validators
const emailNotInUse = async (value) => {
  const user = await prisma.user.findUnique({ where: { email: value } });
  if (user) throw new Error('This email has already an account.');
};

const usernameNotInUse = async (value) => {
  const user = await prisma.user.findUnique({ where: { username: value } });
  if (user) throw new Error('This username is not available.');
};

const confirmationPasswordMatchPassword = (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Confirmation password does not match the password.');
  }
  return true;
};

//Validations chains
export const signupValidation = [
  body('email').trim().isEmail().withMessage(emailErr).custom(emailNotInUse),
  body('password_confirmation').custom(confirmationPasswordMatchPassword),
  body('username')
    .trim()
    .isAlphanumeric('fr-FR', { ignore: ' ' })
    .withMessage(`Username ${alphaNumErr}`)
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 cahracters.')
    .custom(usernameNotInUse),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must contain at least 8 characters')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(passwordErr),
];

export const signinValidation = [
  body('password').trim().notEmpty().withMessage('Password must not be empty.'),
  body('email').trim().isEmail().withMessage(emailErr),
];

export const postValidation = [
  body('title').trim().notEmpty().withMessage('Title should not be empty.'),
  body('content')
    .trim()
    .isLength({ min: 300 })
    .withMessage('Blog content must be at least 300 characters.'),
];

export const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment content must be between 2 and 1000 characters.'),
];
