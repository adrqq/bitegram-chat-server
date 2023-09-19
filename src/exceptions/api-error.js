module.exports = class ApiError extends Error {
  1
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError('User is not authorized', 401);
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static Internal(err) {
    return new ApiError(500, err.message);
  }
}