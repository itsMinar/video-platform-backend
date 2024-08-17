// method for formatting the error
const formatError = (err) => {
  const error = {
    message: err?.message ? err.message : err.toString(),
    errors: err.errors || [],
    hints: err.hints
      ? `${err.hints}. If the problem is not resolved, please feel free to contact our technical team.`
      : 'Please Create a support ticket for further assistance, or contact our technical team.',
  };

  return error;
};

// Custom Error Instance
class CustomError {
  static notFound(error) {
    const err = formatError(error);
    return {
      status: 404,
      ...err,
    };
  }

  static unauthorized(error) {
    const err = formatError(error);
    return {
      status: 401,
      ...err,
    };
  }

  static conflict(error) {
    const err = formatError(error);
    return {
      status: 409,
      ...err,
    };
  }

  static badRequest(error) {
    const err = formatError(error);
    return {
      status: 400,
      ...err,
    };
  }

  static serverError(error) {
    const err = formatError(error);
    return {
      status: 500,
      ...err,
    };
  }

  static throwError(error) {
    const err = new Error(error.message);
    err.status = error.status;
    err.errors = error.errors;
    err.hints = error.hints;

    throw err;
  }
}

module.exports = CustomError;
