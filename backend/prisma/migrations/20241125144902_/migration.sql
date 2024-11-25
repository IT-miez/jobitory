-- CreateTable
CREATE TABLE "JobStatus" (
    "id" SERIAL NOT NULL,
    "status" TEXT,
    "company_name" TEXT,
    "apply_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "JobStatus_pkey" PRIMARY KEY ("id")
);
