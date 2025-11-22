export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Bad_Request_Error';
    this.statusCode = 400;
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Unauthorized_Error';
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Forbidden_Error';
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'This page does not exist!') {
    super(message);
    this.name = 'Not_Found_Error';
    this.statusCode = 404;
  }
}

export class CustomMulterError {
  #messages = {
    LIMIT_PART_COUNT: 'Too many parts in the request.',
    LIMIT_FILE_SIZE: 'One or more uploaded file is too large.',
    LIMIT_FILE_COUNT: 'Too many files sent in the one request',
    LIMIT_FIELD_KEY: 'The field name is too long.',
    LIMIT_FIELD_VALUE: 'Field value too long',
    LIMIT_FIELD_COUNT: 'Too many form fields were sent.',
    LIMIT_UNEXPECTED_FILE: 'Unexpected file field detected.',
    MISSING_FIELD_NAME: 'Field name missing',
    UNKNOWN_ERR: 'Unknown error occurred during file upload, try later.',
  };

  constructor(errCode) {
    this.message = this.#messages[errCode] || this.#messages.UNKNOWN_ERR;
    this.statusCode = 422;
  }
}
