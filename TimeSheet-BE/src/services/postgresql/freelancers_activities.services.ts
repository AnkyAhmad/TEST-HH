import prisma from "../connections";

export const findFreelancersActivitiesByUid = async (id_kegiatan: string) => {
  return await prisma.kegiatan_Freelancers.findUnique({
    where: {
      id_kegiatan
    },
    include: {
      nama_karyawan: true,
      nama_proyek: true
    }
  });
};

export const findAllFreelancersActivitiesByUidFreelances = async (id_Freelancer: string) => {
  return await prisma.kegiatan_Freelancers.findMany({
    where: {
      nama_karyawan: {
        id_Freelancer
      }
    },
    include: {
      nama_karyawan: false,
      nama_proyek: true
    }
  });
};

export const createFreelancersActivities = async (
  judul_kegiatan: string,
  tanggal_mulai: string,
  tanggal_berakhir: string,
  freelancersId_Freelancer: string,
  proyekId_proyek: string
) => {
  return await prisma.kegiatan_Freelancers.create({
    data: {
      judul_kegiatan,
      tanggal_mulai,
      tanggal_berakhir,
      freelancersId_Freelancer,
      proyekId_proyek
    },
    include: {
      nama_karyawan: true,
      nama_proyek: true
    }
  });
};

export const updateFreelancersActivitiesByUidActivity = async (
  id_kegiatan: string,
  judul_kegiatan: string,
  tanggal_mulai: string,
  tanggal_berakhir: string
) => {
  return await prisma.kegiatan_Freelancers.update({
    where: {
      id_kegiatan
    },
    data: {
      judul_kegiatan,
      tanggal_mulai,
      tanggal_berakhir
    }
  });
};

export const deleteFreelancersActivitiesByUidActivity = async (id_kegiatan: string) => {
  return await prisma.kegiatan_Freelancers.delete({
    where: {
      id_kegiatan
    }
  });
};
