/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `from` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userdata_id` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userdata_id` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "from" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "to" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userdata_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "from" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "to" TIMESTAMP(3),
ADD COLUMN     "userdata_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "name",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Certificate" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "issuing_organization" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "expiration_date" TIMESTAMP(3),
    "certificate_url" TEXT,
    "additional_information" TEXT,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Custom_Box" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "string_titles" TEXT[],
    "text_content" TEXT[],

    CONSTRAINT "Custom_Box_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserData" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserData_user_id_key" ON "UserData"("user_id");

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userdata_id_fkey" FOREIGN KEY ("userdata_id") REFERENCES "UserData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_userdata_id_fkey" FOREIGN KEY ("userdata_id") REFERENCES "UserData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserData" ADD CONSTRAINT "UserData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
