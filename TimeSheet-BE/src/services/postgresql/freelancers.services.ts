import prisma from "../connections";

export const getFreelancerByNama = async (nama_karyawan: string) => {
  return await prisma.freelancers.findFirst({
    where: {
      nama_karyawan: nama_karyawan.toLowerCase()
    }
  });
};

export const createFreelancers = async (nama_karyawan: string, tarif: number) => {
  return await prisma.freelancers.create({
    data: { nama_karyawan, tarif }
  });
};

export const updateFreelancers = async (nama_karyawan: string, tarif: number) => {
  return await prisma.freelancers.update({
    where: {
      nama_karyawan: nama_karyawan.toLowerCase()
    },
    data: {
      nama_karyawan,
      tarif
    }
  });
};
