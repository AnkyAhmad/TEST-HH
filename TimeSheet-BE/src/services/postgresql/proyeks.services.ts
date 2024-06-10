import prisma from "../connections";

export const findAllProyeks = async () => {
  return await prisma.proyeks.findMany();
};

export const getProyeksByName = async (name_proyek: string) => {
  return await prisma.proyeks.findUnique({
    where: {
      name_proyek: name_proyek.toLowerCase()
    }
  });
};

export const createProyeks = async (name_proyek: string) => {
  return await prisma.proyeks.create({
    data: { name_proyek }
  });
};
