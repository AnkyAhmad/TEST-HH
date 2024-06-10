class CustomError extends Error {
  statusCode: number;
  success: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.success = statusCode >= 400 && statusCode <= 500 ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
