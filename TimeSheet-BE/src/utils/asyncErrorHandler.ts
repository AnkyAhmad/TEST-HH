import { Request, Response, NextFunction } from "express";

const asyncErrorHandler = (func: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((err: any) => next(err));
  };
};

export default asyncErrorHandler;
