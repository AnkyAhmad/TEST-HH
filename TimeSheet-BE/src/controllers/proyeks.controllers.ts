import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import CustomError from "../utils/CustomError";
import { StatusCodes } from "http-status-codes";
import { createProyeks, findAllProyeks, getProyeksByName } from "../services/postgresql/proyeks.services";

export const getAllProyeks = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const result = await findAllProyeks();

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    message: "Success",
    data: result
  });
});

export const addProyeks = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name_proyek } = req.body;

  if (!name_proyek) {
    const error = new CustomError(`Nama Proyek Kosong`, StatusCodes.BAD_REQUEST);
    return next(error);
  }

  if (typeof name_proyek !== "string") {
    const error = new CustomError(`Error Tipe Data`, StatusCodes.BAD_REQUEST);
    return next(error);
  }

  if (await getProyeksByName(name_proyek)) {
    const error = new CustomError(`Nama Proyek Sudah Ada`, StatusCodes.BAD_REQUEST);
    return next(error);
  }

  const result = await createProyeks(name_proyek);

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    message: "Success",
    data: result
  });
});
