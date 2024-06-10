import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import CustomError from "../utils/CustomError";
import { StatusCodes } from "http-status-codes";
import {
  createFreelancersActivities,
  deleteFreelancersActivitiesByUidActivity,
  findAllFreelancersActivitiesByUidFreelances,
  findFreelancersActivitiesByUid,
  updateFreelancersActivitiesByUidActivity
} from "../services/postgresql/freelancers_activities.services";

export const getAllFreelancersActivitiesByUidFreelances = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { freelancersId } = req.body;

    if (!freelancersId) {
      const error = new CustomError(`UID Freelances/Karyawan Kosong`, StatusCodes.BAD_REQUEST);
      return next(error);
    }

    const result = await findAllFreelancersActivitiesByUidFreelances(freelancersId);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Success",
      data: result
    });
  }
);

export const addFreelancersActivities = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { judul_kegiatan, tanggal_mulai, tanggal_berakhir, freelancersId_Freelancer, proyekId_proyek } = req.body;

  if (!judul_kegiatan || !tanggal_mulai || !tanggal_berakhir || !freelancersId_Freelancer || !proyekId_proyek) {
    const error = new CustomError(`Nama Projek, Kegiatan atau tanggal belum terisi lengkap`, StatusCodes.BAD_REQUEST);
    return next(error);
  }

  const result = await createFreelancersActivities(
    judul_kegiatan,
    tanggal_mulai,
    tanggal_berakhir,
    freelancersId_Freelancer,
    proyekId_proyek
  );

  res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    message: "Success",
    data: result
  });
});

export const modifyFreelancersActivities = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { UID_FreelancerActivity } = req.params;
    const { judul_kegiatan, tanggal_mulai, tanggal_berakhir, freelancersId_Freelancer } = req.body;

    if (!UID_FreelancerActivity) {
      const error = new CustomError(`UID Kegiatan Kosong`, StatusCodes.BAD_REQUEST);
      return next(error);
    }

    if (!(await findFreelancersActivitiesByUid(UID_FreelancerActivity))) {
      const error = new CustomError(`UID Kegiatan tidak ditemukan`, StatusCodes.NOT_FOUND);
      return next(error);
    }

    const resultUpdate = await updateFreelancersActivitiesByUidActivity(
      UID_FreelancerActivity,
      judul_kegiatan,
      tanggal_mulai,
      tanggal_berakhir
    );

    if (!resultUpdate) {
      const error = new CustomError(`Gagal update`, StatusCodes.BAD_REQUEST);
      return next(error);
    }

    if (!freelancersId_Freelancer) {
      const error = new CustomError(`Gagal update`, StatusCodes.BAD_REQUEST);
      return next(error);
    }
    const result = await findAllFreelancersActivitiesByUidFreelances(freelancersId_Freelancer);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Success",
      data: result
    });
  }
);

export const removeFreelancersActivities = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { UID_FreelancerActivity } = req.params;

    if (!(await findFreelancersActivitiesByUid(UID_FreelancerActivity))) {
      const error = new CustomError(`Kegiatan Tidak ditemukan`, StatusCodes.NOT_FOUND);
      return next(error);
    }

    const result = deleteFreelancersActivitiesByUidActivity(UID_FreelancerActivity);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Success",
      data: result
    });
  }
);
