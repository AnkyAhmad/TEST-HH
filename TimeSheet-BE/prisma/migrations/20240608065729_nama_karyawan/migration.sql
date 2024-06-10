/*
  Warnings:

  - A unique constraint covering the columns `[nama_karyawan]` on the table `Freelancers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Freelancers_nama_karyawan_key" ON "Freelancers"("nama_karyawan");
