-- CreateTable
CREATE TABLE "Freelancers" (
    "id_Freelancer" TEXT NOT NULL,
    "nama_karyawan" VARCHAR(250) NOT NULL,
    "tarif" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Freelancers_pkey" PRIMARY KEY ("id_Freelancer")
);

-- CreateTable
CREATE TABLE "kegiatan_Freelancers" (
    "id_kegiatan" TEXT NOT NULL,
    "judul_kegiatan" VARCHAR(250) NOT NULL,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "tanggal_berakhir" TIMESTAMP(3) NOT NULL,
    "freelancersId_Freelancer" TEXT NOT NULL,
    "proyekId_proyek" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kegiatan_Freelancers_pkey" PRIMARY KEY ("id_kegiatan")
);

-- CreateTable
CREATE TABLE "Proyeks" (
    "id_proyek" TEXT NOT NULL,
    "name_proyek" VARCHAR(250) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proyeks_pkey" PRIMARY KEY ("id_proyek")
);

-- CreateIndex
CREATE UNIQUE INDEX "Freelancers_id_Freelancer_key" ON "Freelancers"("id_Freelancer");

-- CreateIndex
CREATE UNIQUE INDEX "kegiatan_Freelancers_id_kegiatan_key" ON "kegiatan_Freelancers"("id_kegiatan");

-- CreateIndex
CREATE UNIQUE INDEX "Proyeks_id_proyek_key" ON "Proyeks"("id_proyek");

-- AddForeignKey
ALTER TABLE "kegiatan_Freelancers" ADD CONSTRAINT "kegiatan_Freelancers_freelancersId_Freelancer_fkey" FOREIGN KEY ("freelancersId_Freelancer") REFERENCES "Freelancers"("id_Freelancer") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kegiatan_Freelancers" ADD CONSTRAINT "kegiatan_Freelancers_proyekId_proyek_fkey" FOREIGN KEY ("proyekId_proyek") REFERENCES "Proyeks"("id_proyek") ON DELETE RESTRICT ON UPDATE CASCADE;
