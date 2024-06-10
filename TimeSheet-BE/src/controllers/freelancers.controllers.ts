import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import CustomError from "../utils/CustomError";
import { StatusCodes } from "http-status-codes";
import { createFreelancers, getFreelancerByNama, updateFreelancers } from "../services/postgresql/freelancers.services";
import { findAllFreelancersActivitiesByUidFreelances } from "../services/postgresql/freelancers_activities.services";

export const addFreelancers = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { nama_karyawan, tarif } = req.body;

  if (!nama_karyawan || !tarif) {
    const error = new CustomError(`Nama Karyawan atau tarif Kosong`, StatusCodes.BAD_REQUEST);
    return next(error);
  }

  if (typeof nama_karyawan !== "string" && !Number.isInteger(tarif)) {
    const error = new CustomError(`Nama Karyawan atau tarif bukan huruf dan angka`, StatusCodes.BAD_REQUEST);
    return next(error);
  }

  const existingFreelancer = await getFreelancerByNama(nama_karyawan);
  let data;

  if (existingFreelancer) {
    const result = await updateFreelancers(nama_karyawan, tarif);
    const kegiatan_freelance = await findAllFreelancersActivitiesByUidFreelances(existingFreelancer.id_Freelancer);
    data = { freelance: result, kegiatan_freelance };
  } else {
    const result = await createFreelancers(nama_karyawan, tarif);
    const kegiatan_freelance = await findAllFreelancersActivitiesByUidFreelances(result.id_Freelancer);
    data = { freelance: result, kegiatan_freelance };
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    message: "Success",
    data
  });
});
