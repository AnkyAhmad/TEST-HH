import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const GlobalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const errStatus = err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const errSuccess = err?.success || "false";
  const errMsg = err?.message || "Terjadi Kesalahan Pada Server";
  const errStack = err?.stack || {};

  res.status(errStatus).json({
    success: errSuccess,
    status: errStatus,
    message: errMsg
  });
};

export default GlobalErrorHandler;
