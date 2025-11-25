import validator from 'validator';

export function validateField(name, value) {
  if (name === 'email') {
    return { isValid: validator.isEmail(value), err: 'Invalid email.' };
  }

  if (name === 'password') {
    return {
      isValid: validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 0,
      }),
      err: 'Password must have at least: 8 characters, one capital letter, one number.',
    };
  }

  if (name === 'username') {
    let err;
    let isValid = false;
    if (!validator.isAlphanumeric(value, 'fr-FR', { ignore: ' ' })) {
      err = 'Username can only contain letters and numbers.';
    } else if (!validator.isLength(value, { min: 2, max: 50 })) {
      err = 'Username must be between 2 and 50 characters.';
    } else {
      isValid = true;
      err = '';
    }
    return { isValid, err };
  }

  if (name === 'avatar') {
    let isValid = false;
    let err = '';
    if (value.size > 5 * 1024 * 1024) {
      err = 'The file must no exceed 5 Mb.';
    } else if (!value.type.startsWith('image/')) {
      err = 'Only images are aloowed';
    } else {
      isValid = true;
    }
    return { err, isValid };
  }
  return { isValid: true, err: '' };
}

export function checkConfirmationPwd(pwd, confirm_pwd) {
  return {
    isValid: pwd === confirm_pwd,
    err: "Confirmation password doesn't match the password. ",
  };
}
