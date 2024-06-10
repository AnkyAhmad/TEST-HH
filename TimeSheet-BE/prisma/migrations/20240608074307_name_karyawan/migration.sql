/*
  Warnings:

  - A unique constraint covering the columns `[name_proyek]` on the table `Proyeks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Proyeks_name_proyek_key" ON "Proyeks"("name_proyek");
